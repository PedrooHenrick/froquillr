import { Undo2, Pencil } from "lucide-react";

export default function Toolbar({
  mode, setMode,
  page, pageCount,
  onPrev, onNext,
  onExtract, extracting,
  onSave, saving, hasPending,
  onDownload,
  downloadUrl,
  filename,
  canUndo,
  onUndo,
}) {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center gap-2 px-4 flex-shrink-0 shadow-sm">
      <span className="text-gray-900 font-bold text-sm mr-1">Quillr</span>
      <span className="text-gray-400 text-xs truncate max-w-[140px]" title={filename}>
        {filename}
      </span>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Desfazer */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        title="Desfazer (Ctrl+Z)"
        className="p-1.5 rounded-md border bg-white text-gray-600 border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-all"
      >
        <Undo2 className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Extrair Textos */}
      <button
        onClick={onExtract}
        disabled={extracting}
        className="px-3 py-1.5 rounded-md text-sm font-medium border bg-white text-gray-600 border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-all"
      >
        {extracting ? "Extraindo..." : "Extrair Textos"}
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Lápis — adicionar texto */}
      <button
        onClick={() => setMode(mode === "pencil" ? "edit" : "pencil")}
        title="Adicionar texto"
        style={mode === "pencil" ? {
          background: "#f0fdf4",
          color: "#16a34a",
          border: "2px solid #16a34a",
          boxShadow: "0 0 0 3px rgba(22,163,74,0.15)",
        } : {}}
        className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all flex items-center gap-1.5 ${
          mode === "pencil"
            ? ""
            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        <Pencil className="w-3.5 h-3.5" />
        Lápis
      </button>

      {/* Apagar Área */}
      <button
        onClick={() => setMode(mode === "erase" ? "edit" : "erase")}
        style={mode === "erase" ? {
          background: "#fff1f1",
          color: "#dc2626",
          border: "2px solid #dc2626",
          boxShadow: "0 0 0 3px rgba(220,38,38,0.15)",
        } : {}}
        className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all ${
          mode === "erase"
            ? ""
            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        Apagar Área
      </button>

      {/* Assinatura */}
      <button
        onClick={() => setMode(mode === "signature" ? "edit" : "signature")}
        style={mode === "signature" ? {
          background: "#eff6ff",
          color: "#2563eb",
          border: "2px solid #2563eb",
          boxShadow: "0 0 0 3px rgba(37,99,235,0.15)",
        } : {}}
        className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all ${
          mode === "signature"
            ? ""
            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        Assinatura
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Navegação de páginas */}
      <button onClick={onPrev} disabled={page <= 0}
        className="w-7 h-7 rounded bg-white border border-gray-200 text-gray-600 disabled:opacity-30 hover:border-gray-300 text-sm">
        ◀
      </button>
      <span className="text-gray-500 text-sm min-w-[60px] text-center">
        {page + 1} / {pageCount}
      </span>
      <button onClick={onNext} disabled={page >= pageCount - 1}
        className="w-7 h-7 rounded bg-white border border-gray-200 text-gray-600 disabled:opacity-30 hover:border-gray-300 text-sm">
        ▶
      </button>

      <div className="flex-1" />

      {hasPending && (
        <span className="text-orange-500 text-xs font-medium">⚠️ Alterações não salvas</span>
      )}

      <button
        onClick={onSave}
        disabled={saving || !hasPending}
        className="px-3 py-1.5 rounded-md text-sm font-medium border bg-orange-500 text-white border-orange-500 hover:bg-orange-400 disabled:opacity-40 transition-all"
      >
        {saving ? "Salvando..." : "Salvar"}
      </button>

      <a
        href={downloadUrl}
        download="documento_editado.pdf"
        className="px-3 py-1.5 rounded-md text-sm font-medium border bg-white text-gray-600 border-gray-200 hover:bg-gray-50 transition-all"
      >
        Baixar
      </a>
    </div>
  );
}
