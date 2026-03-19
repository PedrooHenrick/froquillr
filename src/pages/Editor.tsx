import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Componentes do editor real
// @ts-ignore
import Toolbar from "@/components/Toolbar";
// @ts-ignore
import PDFCanvas from "@/components/PDFCanvas";
// @ts-ignore
import TextPanel from "@/components/TextPanel";
import {
  renderPage, extractText, eraseArea,
  addSignature, saveTextEdits, downloadUrl,
// @ts-ignore
} from "@/services/api";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [session, setSession]     = useState<any>(null);

  // Estados do editor
  const [page, setPage]           = useState(0);
  const [mode, setMode]           = useState("edit");
  const [blocks, setBlocks]       = useState<any[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [status, setStatus]       = useState('Clique em "Extrair Textos" para começar');
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const [pending, setPending]     = useState<any[]>([]);
  const [textEdits, setTextEdits] = useState<any>({});
  const [imgKey, setImgKey]       = useState(0);
  const [tokenReady, setTokenReady] = useState(false);

  const hasPending = pending.length > 0 || Object.keys(textEdits).length > 0;
  const editCount  = Object.keys(textEdits).length;

  // Aguarda token ficar disponível
  useEffect(() => {
    import("@/services/api").then(({ default: api }) => {
      // getToken já foi chamado no import, aguarda cache
      setTimeout(() => setTokenReady(true), 300);
    });
  }, []);

  // ── Carrega o PDF do Supabase e envia pro FastAPI ──────────────────────
  useEffect(() => {
    const init = async () => {
      if (!id || !user) return;

      try {
        // Pega token do Supabase
        const { data: { session: sbSession } } = await supabase.auth.getSession();
        const token = sbSession?.access_token || '';

        // ── Verifica sessão salva no sessionStorage ──────────────────
        const cacheKey = `editor_session_${id}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const cachedData = JSON.parse(cached);
          // Verifica se sessão ainda está ativa no backend
          const check = await fetch(
            `${API_BASE}/session-check/${cachedData.session_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (check.ok) {
            const checkData = await check.json();
            if (checkData.valid) {
              setSession(checkData);
              setLoading(false);
              return; // ✅ reutiliza sessão — não faz upload de novo
            }
          }
          // Sessão expirou — remove do cache
          sessionStorage.removeItem(cacheKey);
        }

        // ── Sessão nova — faz upload ──────────────────────────────────
        const { data: doc, error: docErr } = await supabase
          .from("documents")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();

        if (docErr || !doc) {
          setError("Documento não encontrado.");
          return;
        }

        const { data: urlData } = await supabase.storage
          .from("pdfs")
          .createSignedUrl(doc.file_path, 300);

        if (!urlData?.signedUrl) {
          setError("Erro ao acessar o arquivo.");
          return;
        }

        const pdfBlob = await fetch(urlData.signedUrl).then(r => r.blob());
        const pdfFile = new File([pdfBlob], doc.name, { type: "application/pdf" });

        const form = new FormData();
        form.append("file", pdfFile);

        const res = await fetch(`${API_BASE}/upload`, {
          method: "POST",
          body: form,
          headers: { "Authorization": `Bearer ${token}` },
        });

        if (res.status === 401) throw new Error("Sessão expirada. Faça login novamente.");
        if (res.status === 429) throw new Error("Muitas requisições. Aguarde e tente novamente.");
        if (!res.ok) throw new Error(`Erro no servidor: ${res.status}`);

        const data = await res.json();
        if (!data.session_id) throw new Error("Falha no upload para o editor.");

        // Salva sessão no sessionStorage para reutilizar
        sessionStorage.setItem(cacheKey, JSON.stringify(data));

        await supabase.from("documents").update({ status: "editing" }).eq("id", id);

        setSession(data);
      } catch (e: any) {
        setError(e.message || "Erro ao carregar editor.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, user]);

  const refreshImage = () => setImgKey(k => k + 1);
  const sb = (msg: string) => setStatus(msg);

  // ── Handlers (mesmos do editor original) ──────────────────────────────
  const handleExtract = async () => {
    if (!session) return;
    setExtracting(true);
    sb("Extraindo textos...");
    try {
      const result = await extractText(session.session_id, page);
      setBlocks(result);
      sb(`✅ ${result.length} blocos extraídos`);
    } catch {
      sb("❌ Erro ao extrair textos");
    } finally {
      setExtracting(false);
    }
  };

  const handleBlockClick = (block: any) => {
    if (mode !== "edit") return;
    const newText = prompt("Editar texto:", block._new_text || block.text);
    if (newText === null) return;
    if (newText === block.text) {
      const updated = { ...textEdits };
      delete updated[block.id];
      setTextEdits(updated);
      setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, _edited: false, _new_text: undefined } : b));
    } else {
      setTextEdits((prev: any) => ({ ...prev, [block.id]: { block, new_text: newText, page } }));
      setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, _edited: true, _new_text: newText } : b));
    }
    sb(`✏️ "${newText}" — lembre de salvar!`);
  };

  const handlePanelEdit = (block: any, newText: string) => {
    if (newText === block.text) {
      const updated = { ...textEdits };
      delete updated[block.id];
      setTextEdits(updated);
      setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, _edited: false, _new_text: undefined } : b));
    } else {
      setTextEdits((prev: any) => ({ ...prev, [block.id]: { block, new_text: newText, page } }));
      setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, _edited: true, _new_text: newText } : b));
    }
  };

  const handleSelection = async (rect: any) => {
    if (!session) return;
    if (mode === "erase") {
      if (!window.confirm("Apagar o conteúdo desta área?")) return;
      setPending(prev => [...prev, { type: "erase", page, rect }]);
      sb(`🧹 Área marcada — ${pending.length + 1} apagamento(s) pendente(s) · Aperte 💾 para salvar`);
    } else if (mode === "signature") {
      const input = document.createElement("input");
      input.type  = "file";
      input.accept = "image/*";
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          setPending(prev => [...prev, { type: "signature", page, rect, file }]);
          sb("✍️ Assinatura marcada · Aperte 💾 para salvar");
        }
      };
      input.click();
    }
  };

  const handlePaste = (file: File) => {
    const rect = { x_pct: 25, y_pct: 25, w_pct: 50, h_pct: 20 };
    setPending(prev => [...prev, { type: "signature", page, rect, file }]);
    sb("📋 Imagem colada · Aperte 💾 para salvar");
  };

  const handleSave = async () => {
    if (!session || !hasPending) return;
    setSaving(true);
    sb("💾 Salvando...");
    try {
      for (const p of pending.filter(p => p.type === "erase"))
        await eraseArea(session.session_id, p.page, p.rect);
      for (const p of pending.filter(p => p.type === "signature"))
        await addSignature(session.session_id, p.page, p.rect, p.file);

      const edits = Object.values(textEdits).map(({ block, new_text, page }: any) => ({
        page, block_id: block.id, original_text: block.text, new_text,
        x0: block.x0, y0: block.y0, x1: block.x1, y1: block.y1,
        font_name: block.font_name, color_rgb: block.color_rgb, align: block.align,
      }));
      if (edits.length > 0) await saveTextEdits(session.session_id, edits);

      setPending([]);
      setTextEdits({});
      setBlocks(prev => prev.map(b => ({ ...b, _edited: false, _new_text: undefined })));
      refreshImage();
      sb("✅ Salvo com sucesso!");

      // Atualiza status no Supabase
      await supabase.from("documents").update({ status: "completed" }).eq("id", id);
    } catch (e: any) {
      sb(`❌ Erro ao salvar: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const goPage = (n: number) => {
    setPage(n);
    setBlocks([]);
    setMode("edit");
    refreshImage();
    sb("Página " + (n + 1));
  };

  // ── Renders ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" >
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Carregando editor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" >
        <p className="text-red-400">{error}</p>
        <button onClick={() => navigate("/dashboard")} className="text-orange-400 underline text-sm">
          Voltar ao painel
        </button>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50" >
      <Toolbar
        mode={mode}
        setMode={setMode}
        page={page}
        pageCount={session.page_count}
        onPrev={() => goPage(page - 1)}
        onNext={() => goPage(page + 1)}
        onExtract={handleExtract}
        extracting={extracting}
        onSave={handleSave}
        saving={saving}
        hasPending={hasPending}
        onDownload={() => window.open(downloadUrl(session.session_id))}
        filename={session.filename}
        downloadUrl={downloadUrl(session.session_id)}
      />

      {/* Status bar */}
      <div className="text-gray-400 text-xs px-3 py-1 border-b border-white/10 flex items-center gap-2" >
        <button onClick={() => navigate("/dashboard")} className="text-orange-400 hover:text-orange-300 mr-2">
          ← Painel
        </button>
        <span>{status}</span>
        {mode === "erase"     && <span className="text-red-400">🧹 Arraste sobre a área que deseja apagar</span>}
        {mode === "signature" && <span className="text-blue-400">✍️ Arraste para posicionar · ou Ctrl+V para colar imagem</span>}
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto bg-gray-100 flex justify-center p-6" >
          <div className="w-full max-w-3xl">
            <PDFCanvas
              key={imgKey}
              imageUrl={renderPage(session.session_id, page)}
              blocks={blocks}
              mode={mode}
              pageInfo={session.pages?.[page]}
              onBlockClick={handleBlockClick}
              onBlockHover={setHoveredBlock}
              onSelectionFinished={handleSelection}
              onPaste={handlePaste}
            />
          </div>
        </div>
        <TextPanel
          blocks={blocks}
          onEdit={handlePanelEdit}
          onFocus={setHoveredBlock}
          editCount={editCount}
        />
      </div>
    </div>
  );
};

export default Editor;
