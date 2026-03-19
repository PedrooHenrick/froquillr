export default function Toolbar({
  mode, setMode,
  page, pageCount,
  onPrev, onNext,
  onExtract, extracting,
  onSave, saving, hasPending,
  onDownload,
  downloadUrl,
  filename,
}) {
  const btn = (label, active, onClick, activeClass = '', icon = '') => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all flex items-center gap-1.5 relative ${
        active
          ? activeClass || 'bg-orange-100 text-orange-700 border-orange-400 shadow-sm'
          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      {active && (
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-500 border-2 border-white" />
      )}
      {label}
      {active && <span className="text-[10px] font-bold opacity-70">ON</span>}
    </button>
  )

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center gap-2 px-4 flex-shrink-0 shadow-sm">
      <span className="text-gray-900 font-bold text-sm mr-1">
        Quill<span className="text-orange-500">r</span>
      </span>
      <span className="text-gray-400 text-xs truncate max-w-[140px]" title={filename}>
        {filename}
      </span>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button
        onClick={onExtract}
        disabled={extracting}
        className="px-3 py-1.5 rounded-md text-sm font-medium border bg-white text-gray-600 border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-all"
      >
        {extracting ? 'Extraindo...' : 'Extrair Textos'}
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {btn('Apagar Area', mode === 'erase', () => setMode(mode === 'erase' ? 'edit' : 'erase'),
        'bg-red-50 text-red-600 border-red-300')}
      {btn('Assinatura', mode === 'signature', () => setMode(mode === 'signature' ? 'edit' : 'signature'),
        'bg-blue-50 text-blue-600 border-blue-300')}

      <div className="w-px h-6 bg-gray-200 mx-1" />

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
        <span className="text-orange-500 text-xs font-medium">Alteracoes nao salvas</span>
      )}

      <button onClick={onSave} disabled={saving || !hasPending}
        className="px-3 py-1.5 rounded-md text-sm font-medium border bg-orange-500 text-white border-orange-500 hover:bg-orange-400 disabled:opacity-40 transition-all">
        {saving ? 'Salvando...' : 'Salvar'}
      </button>

      <a href={downloadUrl} download="documento_editado.pdf"
        className="px-3 py-1.5 rounded-md text-sm font-medium border bg-white text-gray-600 border-gray-200 hover:bg-gray-50 transition-all">
        Baixar
      </a>
    </div>
  )
}
