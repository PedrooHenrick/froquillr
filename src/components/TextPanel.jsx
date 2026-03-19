import { useState } from 'react'

function BlockRow({ block, onEdit, onFocus }) {
  const [val, setVal] = useState(block.text)
  const edited = val !== block.text

  return (
    <div
      onClick={() => onFocus(block)}
      className={`px-2 py-2 rounded mb-1 cursor-pointer border-l-2 transition-all ${
        edited
          ? 'bg-orange-50 border-orange-400'
          : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-1 mb-1">
        <span className="text-[10px] text-gray-400">
          {block.font_name?.slice(0, 14)} · {block.font_size?.toFixed(0)}pt
        </span>
        {block.source !== 'pymupdf' && (
          <span className="text-[9px] bg-blue-100 text-blue-600 px-1 rounded">OCR</span>
        )}
      </div>
      <input
        value={val}
        onChange={(e) => { setVal(e.target.value); onEdit(block, e.target.value) }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full text-xs rounded px-2 py-1 outline-none border transition-all ${
          edited
            ? 'bg-orange-50 text-orange-700 border-orange-300'
            : 'bg-gray-50 text-gray-700 border-gray-200 focus:border-gray-300'
        }`}
      />
    </div>
  )
}

export default function TextPanel({ blocks, onEdit, onFocus, editCount }) {
  const [search, setSearch] = useState('')
  const filtered = blocks.filter(b =>
    !search || b.text.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-72 bg-white border-l border-gray-200 flex flex-col flex-shrink-0 h-full">
      <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between">
        <span className="text-gray-700 text-sm font-medium">Textos Extraidos</span>
        <span className="text-gray-400 text-xs">{blocks.length} blocos</span>
      </div>

      <div className="px-2 py-2 border-b border-gray-100">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar texto..."
          className="w-full bg-gray-50 text-gray-600 text-xs rounded px-2 py-1.5 border border-gray-200 outline-none focus:border-gray-300"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {filtered.length === 0 && (
          <p className="text-gray-400 text-xs text-center py-8">
            {blocks.length === 0
              ? 'Clique em "Extrair Textos" para comecar'
              : 'Nenhum resultado'}
          </p>
        )}
        {filtered.map(b => (
          <BlockRow key={b.id} block={b} onEdit={onEdit} onFocus={onFocus} />
        ))}
      </div>

      <div className={`px-3 py-2 border-t text-xs ${
        editCount > 0
          ? 'border-orange-200 bg-orange-50 text-orange-600'
          : 'border-gray-200 text-gray-400'
      }`}>
        {editCount > 0 ? `${editCount} edicao(oes) pendente(s)` : 'Nenhuma edicao pendente'}
      </div>
    </div>
  )
}
