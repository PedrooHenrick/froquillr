import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// @ts-ignore
import Toolbar from "@/components/Toolbar";
// @ts-ignore
import PDFCanvas from "@/components/PDFCanvas";
// @ts-ignore
import TextPanel from "@/components/TextPanel";
// @ts-ignore
import TextToolbar from "@/components/TextToolbar";
import {
  renderPage, extractText, eraseArea,
  addSignature, saveTextEdits, downloadUrl,
// @ts-ignore
} from "@/services/api";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

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

async function syncEditedPdfToSupabase(sessionId: string, filePath: string) {
  try {
    const res = await fetch(`${API_BASE}/download/${sessionId}`);
    if (!res.ok) return false;
    const blob = await res.blob();
    const { error } = await supabase.storage
      .from("pdfs")
      .update(filePath, blob, { contentType: "application/pdf", upsert: true });
    if (error) { console.error("[sync] erro:", error); return false; }
    return true;
  } catch (e) { console.error("[sync] falha:", e); return false; }
}

const DEFAULT_TEXT_STYLE = {
  fontName: "arial",
  fontSize: 16,
  bold:     false,
  italic:   false,
  color:    "#000000",
};

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const initialized = useRef(false);

  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [session, setSession]           = useState<any>(null);
  const [page, setPage]                 = useState(0);
  const [mode, setMode]                 = useState("edit");
  const [blocks, setBlocks]             = useState<any[]>([]);
  const [extracting, setExtracting]     = useState(false);
  const [saving, setSaving]             = useState(false);
  const [status, setStatus]             = useState('Clique em "Extrair Textos" para começar');
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const [pending, setPending]           = useState<any[]>([]);
  const [textEdits, setTextEdits]       = useState<any>({});
  const [imgTimestamp, setImgTimestamp] = useState(() => Date.now());

  // Elementos de texto arrastáveis (modo lápis — ainda não gravados no PDF)
  const [textElements, setTextElements]       = useState<any[]>([]);
  const [textStyle, setTextStyle]             = useState(DEFAULT_TEXT_STYLE);
  const [pendingTextRect, setPendingTextRect] = useState<any>(null);
  const [textInput, setTextInput]             = useState("");
  const [showTextToolbar, setShowTextToolbar] = useState(false);

  // Histórico Ctrl+Z
  const [history, setHistory] = useState<string[]>([]);
  const pushHistory = useCallback(async (sessionId: string) => {
    try {
      const res = await fetch(`${API_BASE}/snapshot/${sessionId}`, { method: "POST" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.snapshot_id) setHistory(prev => [...prev.slice(-19), data.snapshot_id]);
    } catch { /* silencioso */ }
  }, []);

  const hasPending = pending.length > 0 || Object.keys(textEdits).length > 0 || textElements.length > 0;
  const editCount  = Object.keys(textEdits).length;
  const refreshImage = () => setImgTimestamp(Date.now());
  const sb = (msg: string) => setStatus(msg);

  // Keep-alive
  useEffect(() => {
    const ping = () => fetch(`${API_BASE}/`).catch(() => {});
    ping();
    const interval = setInterval(ping, 8 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Ctrl+Z
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (textElements.length > 0) {
          setTextElements(prev => prev.slice(0, -1));
          sb("↩ Elemento removido");
          return;
        }
        if (history.length === 0 || !session) return;
        const snapshotId = history[history.length - 1];
        setHistory(prev => prev.slice(0, -1));
        try {
          sb("↩ Desfazendo...");
          const res = await fetch(`${API_BASE}/undo/${session.session_id}/${snapshotId}`, { method: "POST" });
          if (res.ok) { refreshImage(); setBlocks([]); sb("↩ Ação desfeita"); }
          else sb("❌ Não foi possível desfazer");
        } catch { sb("❌ Erro ao desfazer"); }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [history, session, textElements]);

  // Init
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

        sessionStorage.setItem(`doc_${id}`, JSON.stringify({ file_path: doc.file_path, name: doc.name }));

        const stored = sessionStorage.getItem(`session_${id}`);
        if (stored) { setSession(JSON.parse(stored)); setLoading(false); return; }

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

  // Visibilidade
  useEffect(() => {
    if (!id) return;
    const handle = async () => {
      if (document.visibilityState === "hidden") {
        sessionStorage.setItem(`edits_${id}`, JSON.stringify({ pending, textEdits, page }));
        return;
      }
      const stored = sessionStorage.getItem(`session_${id}`);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      try {
        const res = await fetch(`${API_BASE}/session-check/${parsed.session_id}`);
        if (!res.ok) {
          const storedDoc = sessionStorage.getItem(`doc_${id}`);
          if (!storedDoc) return;
          const doc = JSON.parse(storedDoc);
          sb("Reconectando...");
          const sessionData = await uploadToRailway(doc.file_path, doc.name);
          sessionStorage.setItem(`session_${id}`, JSON.stringify(sessionData));
          setSession(sessionData);
          const savedEdits = sessionStorage.getItem(`edits_${id}`);
          if (savedEdits) {
            const { pending: p, textEdits: t, page: pg } = JSON.parse(savedEdits);
            setPending(p || []); setTextEdits(t || {}); setPage(pg || 0);
            if ((p?.length > 0) || Object.keys(t || {}).length > 0)
              sb("⚠️ Edições pendentes restauradas · Aperte Salvar para aplicar");
            else sb('Clique em "Extrair Textos" para começar');
          }
          setBlocks([]); refreshImage();
        }
      } catch { /* silencioso */ }
    };
    document.addEventListener("visibilitychange", handle);
    return () => document.removeEventListener("visibilitychange", handle);
  }, [id, pending, textEdits, page]);

  // Extrair
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

  // Edição modo extrair
  const handleBlockClick = (block: any) => {
    if (mode !== "edit") return;
    if (block._confirmedText !== undefined) {
      const newText = block._confirmedText;
      if (!newText || newText === block.text) {
        const u = { ...textEdits }; delete u[block.id]; setTextEdits(u);
        setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, _edited: false, _new_text: undefined } : b));
      } else {
        setTextEdits((prev: any) => ({ ...prev, [block.id]: { block, new_text: newText, page } }));
        setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, _edited: true, _new_text: newText } : b));
      }
      return;
    }
    const newText = prompt("Editar texto:", block._new_text || block.text);
    if (newText === null) return;
    if (newText === block.text) {
      const u = { ...textEdits }; delete u[block.id]; setTextEdits(u);
      setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, _edited: false, _new_text: undefined } : b));
    } else {
      setTextEdits((prev: any) => ({ ...prev, [block.id]: { block, new_text: newText, page } }));
      setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, _edited: true, _new_text: newText } : b));
    }
  };

  const handlePanelEdit = (block: any, newText: string) => {
    if (newText === block.text) {
      const u = { ...textEdits }; delete u[block.id]; setTextEdits(u);
      setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, _edited: false, _new_text: undefined } : b));
    } else {
      setTextEdits((prev: any) => ({ ...prev, [block.id]: { block, new_text: newText, page } }));
      setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, _edited: true, _new_text: newText } : b));
    }
  };

  // Seleção de área
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
        if (file) { setPending(prev => [...prev, { type: "signature", page, rect, file }]); sb("Assinatura marcada · Aperte Salvar"); }
      };
      input.click();
    } else if (mode === "pencil") {
      setPendingTextRect(rect);
      setTextInput("");
      setShowTextToolbar(true);
      sb("Digite o texto e confirme");
    }
  };

  const handlePaste = (file: File) => {
    const rect = { x_pct: 25, y_pct: 25, w_pct: 50, h_pct: 20 };
    setPending(prev => [...prev, { type: "signature", page, rect, file }]);
    sb("Imagem colada · Aperte Salvar");
  };

  // Confirmar texto → vira elemento arrastável
  const handleConfirmText = () => {
    if (!textInput.trim() || !pendingTextRect) return;
    const newEl = {
      id:           `txt_${Date.now()}`,
      text:         textInput.trim(),
      textStyle:    { ...textStyle },
      page,
      x_pct:        pendingTextRect.x_pct,
      y_pct:        pendingTextRect.y_pct,
      w_pct:        pendingTextRect.w_pct,
      h_pct:        pendingTextRect.h_pct,
      _justCreated: true,
    };
    setTextElements(prev => [...prev, newEl]);
    setShowTextToolbar(false);
    setPendingTextRect(null);
    setTextInput("");
    sb("Texto adicionado · Arraste para posicionar · Duplo clique para editar · Salvar para gravar");
  };

  const handleCancelText = () => {
    setShowTextToolbar(false);
    setPendingTextRect(null);
    setTextInput("");
    sb("Cancelado");
  };

  // Atualizar / remover elemento arrastável
  const handleUpdateTextElement = (elId: string, updates: any) => {
    setTextElements(prev => prev.map(el => el.id === elId ? { ...el, ...updates } : el));
  };

  const handleRemoveTextElement = (elId: string) => {
    setTextElements(prev => prev.filter(el => el.id !== elId));
  };

  // Salvar
  const handleSave = async () => {
    if (!session || !hasPending) return;
    setSaving(true); sb("💾 Salvando...");
    try {
      await pushHistory(session.session_id);

      for (const p of pending.filter(p => p.type === "erase"))
        await eraseArea(session.session_id, p.page, p.rect);

      for (const p of pending.filter(p => p.type === "signature"))
        await addSignature(session.session_id, p.page, p.rect, p.file);

      // Grava elementos de texto do lápis
      for (const el of textElements) {
        await fetch(`${API_BASE}/add-text`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: session.session_id,
            page:       el.page,
            x_pct:      el.x_pct,
            y_pct:      el.y_pct,
            w_pct:      el.w_pct,
            h_pct:      el.h_pct,
            text:       el.text,
            font_name:  el.textStyle.fontName,
            font_size:  el.textStyle.fontSize,
            bold:       el.textStyle.bold,
            italic:     el.textStyle.italic,
            color_hex:  el.textStyle.color,
          }),
        });
      }

      // Textos extraídos editados
      const edits = Object.values(textEdits).map(({ block, new_text, page }: any) => ({
        page, block_id: block.id, original_text: block.text, new_text,
        x0: block.x0, y0: block.y0, x1: block.x1, y1: block.y1,
        font_name: block.font_name, color_rgb: block.color_rgb,
        align: block.align, source: block.source,
      }));
      if (edits.length > 0) await saveTextEdits(session.session_id, edits);

      // Sincroniza pro Supabase
      const storedDoc = sessionStorage.getItem(`doc_${id}`);
      if (storedDoc) {
        const { file_path } = JSON.parse(storedDoc);
        sb("💾 Sincronizando PDF...");
        await syncEditedPdfToSupabase(session.session_id, file_path);
      }

      setPending([]);
      setTextEdits({});
      setTextElements([]);
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
    setShowTextToolbar(false); setPendingTextRect(null);
    sb("Página " + (n + 1));
  };

  // Render
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">{status || "Carregando editor..."}</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-red-400">{error}</p>
      <button onClick={() => navigate("/dashboard")} className="text-orange-400 underline text-sm">Voltar ao painel</button>
    </div>
  );

  if (!session) return null;

  const currentTextElements = textElements.filter(el => el.page === page);

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
        canUndo={history.length > 0 || textElements.length > 0}
        onUndo={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "z", ctrlKey: true, bubbles: true }))}
      />

      <div className="text-gray-400 text-xs px-3 py-1 border-b border-gray-200 flex items-center gap-2">
        <button onClick={() => navigate("/dashboard")} className="text-orange-400 hover:text-orange-300 mr-2">← Painel</button>
        <span>{status}</span>
        {mode === "erase"     && <span className="text-red-400 ml-2">Arraste sobre a área que deseja apagar</span>}
        {mode === "signature" && <span className="text-blue-400 ml-2">Arraste para posicionar · Ctrl+V para colar</span>}
        {mode === "pencil"    && <span className="text-green-600 ml-2">Arraste para selecionar onde adicionar texto</span>}
        {currentTextElements.length > 0 && (
          <span className="text-orange-500 ml-auto">{currentTextElements.length} texto(s) flutuante(s) · Salvar para gravar</span>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto bg-gray-100 flex justify-center p-6">
          <div className="w-full max-w-3xl relative">
            <PDFCanvas
              imageUrl={`${renderPage(session.session_id, page)}&t=${imgTimestamp}`}
              blocks={blocks} mode={mode}
              pageInfo={session.pages?.[page]}
              onBlockClick={handleBlockClick}
              onBlockHover={setHoveredBlock}
              onSelectionFinished={handleSelection}
              onPaste={handlePaste}
              textElements={currentTextElements}
              onUpdateTextElement={handleUpdateTextElement}
              onRemoveTextElement={handleRemoveTextElement}
            />

            {showTextToolbar && pendingTextRect && (
              <TextToolbar
                rect={pendingTextRect}
                text={textInput}
                onTextChange={setTextInput}
                style={textStyle}
                onStyleChange={setTextStyle}
                onConfirm={handleConfirmText}
                onCancel={handleCancelText}
              />
            )}
          </div>
        </div>
        <TextPanel blocks={blocks} onEdit={handlePanelEdit} onFocus={setHoveredBlock} editCount={editCount} />
      </div>
    </div>
  );
};

export default Editor;
