import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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

// ── Baixa PDF original do Supabase e envia pro Railway ────────────────────
async function uploadToRailway(filePath: string, filename: string) {
  const { data: urlData } = await supabase.storage
    .from("pdfs").createSignedUrl(filePath, 600);
  if (!urlData?.signedUrl) throw new Error("Erro ao acessar o arquivo.");
  const blob = await fetch(urlData.signedUrl).then(r => r.blob());
  const file = new File([blob], filename, { type: "application/pdf" });

  const form = new FormData();
  form.append("file", file);
  const res  = await fetch(`${API_BASE}/upload`, { method: "POST", body: form });
  const data = await res.json();
  if (!data.session_id) throw new Error("Falha no upload para o editor.");
  return data;
}

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const initialized = useRef(false);

  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [session, setSession]       = useState<any>(null);
  const [page, setPage]             = useState(0);
  const [mode, setMode]             = useState("edit");
  const [blocks, setBlocks]         = useState<any[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving]         = useState(false);
  const [status, setStatus]         = useState('Clique em "Extrair Textos" para começar');
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const [pending, setPending]       = useState<any[]>([]);
  const [textEdits, setTextEdits]   = useState<any>({});
  const [imgTimestamp, setImgTimestamp] = useState(() => Date.now());

  const hasPending = pending.length > 0 || Object.keys(textEdits).length > 0;
  const editCount  = Object.keys(textEdits).length;
  const refreshImage = () => setImgTimestamp(Date.now());
  const sb = (msg: string) => setStatus(msg);

  // ── Keep-alive — evita Railway hibernar ───────────────────────────────
  useEffect(() => {
    const ping = () => fetch(`${API_BASE}/`).catch(() => {});
    ping();
    const interval = setInterval(ping, 8 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Init — roda só UMA vez ────────────────────────────────────────────
  useEffect(() => {
    if (!id || !user?.id) return;
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      try {
        const { data: doc, error: docErr } = await supabase
          .from("documents").select("*")
          .eq("id", id).eq("user_id", user.id).single();

        if (docErr || !doc) { setError("Documento não encontrado."); return; }

        // Guarda file_path original — nunca sobrescreve
        sessionStorage.setItem(`doc_${id}`, JSON.stringify({
          file_path: doc.file_path,
          name: doc.name,
        }));

        // Usa sessão salva se Railway ainda tem ela
        const stored = sessionStorage.getItem(`session_${id}`);
        if (stored) {
          setSession(JSON.parse(stored));
          setLoading(false);
          return;
        }

        // Primeira vez — baixa original do Supabase e envia pro Railway
        sb("Carregando documento...");
        const sessionData = await uploadToRailway(doc.file_path, doc.name);
        sessionStorage.setItem(`session_${id}`, JSON.stringify(sessionData));
        await supabase.from("documents").update({ status: "editing" }).eq("id", id);
        setSession(sessionData);
      } catch (e: any) {
        setError(e.message || "Erro ao carregar editor.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, user?.id]);

  // ── Volta à aba — reconecta silenciosamente se Railway reiniciou ──────
  useEffect(() => {
    if (!id) return;
    const handle = async () => {
      if (document.visibilityState !== "visible") return;
      const stored = sessionStorage.getItem(`session_${id}`);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      try {
        const res = await fetch(`${API_BASE}/session-check/${parsed.session_id}`);
        if (!res.ok) {
          // Railway reiniciou — baixa ORIGINAL do Supabase (não versão editada)
          const storedDoc = sessionStorage.getItem(`doc_${id}`);
          if (!storedDoc) return;
          const doc = JSON.parse(storedDoc);
          const sessionData = await uploadToRailway(doc.file_path, doc.name);
          sessionStorage.setItem(`session_${id}`, JSON.stringify(sessionData));
          setSession(sessionData);
          setBlocks([]);
          refreshImage();
          sb("Sessão reconectada · Extraia os textos novamente");
        }
      } catch { /* silencioso */ }
    };
    document.addEventListener("visibilitychange", handle);
    return () => document.removeEventListener("visibilitychange", handle);
  }, [id]);

  // ── Extrair ───────────────────────────────────────────────────────────
  const handleExtract = async () => {
    if (!session) return;
    setExtracting(true); sb("Extraindo textos...");
    try {
      const result = await extractText(session.session_id, page);
      setBlocks(result);
      sb(`✅ ${result.length} blocos extraídos`);
    } catch { sb("❌ Erro ao extrair textos"); }
    finally { setExtracting(false); }
  };

  // ── Edição de texto ───────────────────────────────────────────────────
  const handleBlockClick = (block: any) => {
    if (mode !== "edit") return;
    if (block._confirmedText !== undefined) {
      const newText = block._confirmedText;
      if (!newText || newText === block.text) {
        const u = { ...textEdits }; delete u[block.id]; setTextEdits(u);
        setBlocks(prev => prev.map(b => b.id === block.id
          ? { ...b, _edited: false, _new_text: undefined } : b));
      } else {
        setTextEdits((prev: any) => ({ ...prev, [block.id]: { block, new_text: newText, page } }));
        setBlocks(prev => prev.map(b => b.id === block.id
          ? { ...b, _edited: true, _new_text: newText } : b));
      }
      return;
    }
    const newText = prompt("Editar texto:", block._new_text || block.text);
    if (newText === null) return;
    if (newText === block.text) {
      const u = { ...textEdits }; delete u[block.id]; setTextEdits(u);
      setBlocks(prev => prev.map(b => b.id === block.id
        ? { ...b, _edited: false, _new_text: undefined } : b));
    } else {
      setTextEdits((prev: any) => ({ ...prev, [block.id]: { block, new_text: newText, page } }));
      setBlocks(prev => prev.map(b => b.id === block.id
        ? { ...b, _edited: true, _new_text: newText } : b));
    }
  };

  const handlePanelEdit = (block: any, newText: string) => {
    if (newText === block.text) {
      const u = { ...textEdits }; delete u[block.id]; setTextEdits(u);
      setBlocks(prev => prev.map(b => b.id === block.id
        ? { ...b, _edited: false, _new_text: undefined } : b));
    } else {
      setTextEdits((prev: any) => ({ ...prev, [block.id]: { block, new_text: newText, page } }));
      setBlocks(prev => prev.map(b => b.id === block.id
        ? { ...b, _edited: true, _new_text: newText } : b));
    }
  };

  // ── Erase / Signature ─────────────────────────────────────────────────
  const handleSelection = async (rect: any) => {
    if (!session) return;
    if (mode === "erase") {
      if (!window.confirm("Apagar o conteúdo desta área?")) return;
      setPending(prev => [...prev, { type: "erase", page, rect }]);
      sb("Área marcada · Aperte Salvar");
    } else if (mode === "signature") {
      const input = document.createElement("input");
      input.type = "file"; input.accept = "image/*";
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          setPending(prev => [...prev, { type: "signature", page, rect, file }]);
          sb("Assinatura marcada · Aperte Salvar");
        }
      };
      input.click();
    }
  };

  const handlePaste = (file: File) => {
    const rect = { x_pct: 25, y_pct: 25, w_pct: 50, h_pct: 20 };
    setPending(prev => [...prev, { type: "signature", page, rect, file }]);
    sb("Imagem colada · Aperte Salvar");
  };

  // ── Salvar — tudo fica na memória do Railway ──────────────────────────
  const handleSave = async () => {
    if (!session || !hasPending) return;
    setSaving(true); sb("💾 Salvando...");
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

      // NÃO salva no Supabase — PDF editado fica só na memória do Railway
      // Usuário baixa pelo botão Baixar direto do Railway

      setPending([]);
      setTextEdits({});
      setBlocks(prev => prev.map(b => ({ ...b, _edited: false, _new_text: undefined })));
      refreshImage();
      await supabase.from("documents").update({ status: "completed" }).eq("id", id);
      sb("✅ Salvo! Clique em Baixar para obter o PDF editado.");
    } catch (e: any) {
      sb(`❌ Erro ao salvar: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const goPage = (n: number) => {
    setPage(n); setBlocks([]); setMode("edit"); refreshImage();
    sb("Página " + (n + 1));
  };

  // ── Render ────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">{status || "Carregando editor..."}</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-red-400">{error}</p>
      <button onClick={() => navigate("/dashboard")} className="text-orange-400 underline text-sm">
        Voltar ao painel
      </button>
    </div>
  );

  if (!session) return null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <Toolbar
        mode={mode} setMode={setMode}
        page={page} pageCount={session.page_count}
        onPrev={() => goPage(page - 1)}
        onNext={() => goPage(page + 1)}
        onExtract={handleExtract} extracting={extracting}
        onSave={handleSave} saving={saving} hasPending={hasPending}
        onDownload={() => window.open(downloadUrl(session.session_id))}
        filename={session.filename}
        downloadUrl={downloadUrl(session.session_id)}
      />

      <div className="text-gray-400 text-xs px-3 py-1 border-b border-gray-200 flex items-center gap-2">
        <button onClick={() => navigate("/dashboard")} className="text-orange-400 hover:text-orange-300 mr-2">
          ← Painel
        </button>
        <span>{status}</span>
        {mode === "erase"     && <span className="text-red-400 ml-2">Arraste sobre a área que deseja apagar</span>}
        {mode === "signature" && <span className="text-blue-400 ml-2">Arraste para posicionar · Ctrl+V para colar</span>}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto bg-gray-100 flex justify-center p-6">
          <div className="w-full max-w-3xl">
            <PDFCanvas
              imageUrl={`${renderPage(session.session_id, page)}&t=${imgTimestamp}`}
              blocks={blocks} mode={mode}
              pageInfo={session.pages?.[page]}
              onBlockClick={handleBlockClick}
              onBlockHover={setHoveredBlock}
              onSelectionFinished={handleSelection}
              onPaste={handlePaste}
            />
          </div>
        </div>
        <TextPanel blocks={blocks} onEdit={handlePanelEdit} onFocus={setHoveredBlock} editCount={editCount} />
      </div>
    </div>
  );
};

export default Editor;
