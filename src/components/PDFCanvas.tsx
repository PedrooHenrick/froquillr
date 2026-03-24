import { useRef, useState, useEffect, useCallback } from 'react'
import { GripVertical, X, Check, Bold, Italic } from 'lucide-react'

const FONTS = [
  { value: "arial",   label: "Arial" },
  { value: "times",   label: "Times" },
  { value: "courier", label: "Courier" },
  { value: "calibri", label: "Calibri" },
  { value: "verdana", label: "Verdana" },
]
const SIZES  = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48]
const COLORS = [
  "#000000","#1a1a2e","#c0392b","#e67e22",
  "#f1c40f","#27ae60","#2980b9","#8e44ad",
  "#ffffff","#7f8c8d","#ff6b6b","#54a0ff",
]

// ── Elemento de texto flutuante ───────────────────────────────────────────
function DraggableText({ item, containerRef, onUpdate, onRemove, onConfirm }) {
  const elRef      = useRef(null)
  const [editing, setEditing]   = useState(item._justCreated || false)
  const [localText, setLocalText] = useState(item.text)
  const [localStyle, setLocalStyle] = useState(item.textStyle)
  const [dragging, setDragging] = useState(false)
  const [resizing, setResizing] = useState(false)
  const dragStart  = useRef(null)
  const resizeStart = useRef(null)

  // Arrastar
  const onMouseDownDrag = (e) => {
    if (e.target.closest('.no-drag')) return
    e.preventDefault()
    e.stopPropagation()  // ← impede que o PDFCanvas inicie seleção de área
    setDragging(true)
    dragStart.current = {
      mx: e.clientX, my: e.clientY,
      ox: item.x_pct, oy: item.y_pct,
    }
  }

  // Redimensionar (canto inferior direito)
  const onMouseDownResize = (e) => {
    e.preventDefault()
    e.stopPropagation()  // ← já tinha, mantido
    setResizing(true)
    resizeStart.current = {
      mx: e.clientX, my: e.clientY,
      ow: item.w_pct, oh: item.h_pct,
    }
  }

  useEffect(() => {
    if (!dragging && !resizing) return
    const cont = containerRef.current
    if (!cont) return

    const onMove = (e) => {
      // Recalcula o rect a cada movimento para precisão
      const img = cont.querySelector('img')
      const rect = img ? img.getBoundingClientRect() : cont.getBoundingClientRect()

      if (dragging && dragStart.current) {
        const dx = ((e.clientX - dragStart.current.mx) / rect.width)  * 100
        const dy = ((e.clientY - dragStart.current.my) / rect.height) * 100
        onUpdate(item.id, {
          x_pct: Math.max(0, Math.min(95, dragStart.current.ox + dx)),
          y_pct: Math.max(0, Math.min(95, dragStart.current.oy + dy)),
        })
      }
      if (resizing && resizeStart.current) {
        const dx = ((e.clientX - resizeStart.current.mx) / rect.width)  * 100
        const dy = ((e.clientY - resizeStart.current.my) / rect.height) * 100
        onUpdate(item.id, {
          w_pct: Math.max(5,  resizeStart.current.ow + dx),
          h_pct: Math.max(2,  resizeStart.current.oh + dy),
        })
      }
    }
    const onUp = () => { setDragging(false); setResizing(false) }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [dragging, resizing])

  const commitEdit = () => {
    onUpdate(item.id, { text: localText, textStyle: localStyle, _justCreated: false })
    setEditing(false)
    dragStart.current = null   // limpa qualquer drag residual
    resizeStart.current = null
  }

  const fontFamily = localStyle.fontName === 'times'
    ? 'serif' : localStyle.fontName === 'courier'
    ? 'monospace' : 'sans-serif'

  return (
    <div
      ref={elRef}
      style={{
        position:  'absolute',
        left:      `${item.x_pct}%`,
        top:       `${item.y_pct}%`,
        width:     `${item.w_pct}%`,
        minHeight: `${item.h_pct}%`,
        cursor:    dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        zIndex: editing ? 60 : 40,
      }}
      onMouseDown={onMouseDownDrag}
    >
      {/* Borda */}
      <div style={{
        position: 'absolute', inset: 0,
        border: editing ? '2px solid #f97316' : '1.5px dashed #f97316',
        borderRadius: 4,
        backgroundColor: editing ? '#ffffff' : 'rgba(255,255,255,0.0)',
        pointerEvents: 'none',
        zIndex: -1,
      }} />

      {/* Texto renderizado (quando não editando) */}
      {!editing && (
        <div
          style={{
            padding: '2px 4px',
            fontFamily,
            fontWeight:  item.textStyle.bold   ? 'bold'   : 'normal',
            fontStyle:   item.textStyle.italic  ? 'italic' : 'normal',
            color:       item.textStyle.color,
            fontSize:    `${Math.min(item.textStyle.fontSize, 32)}px`,
            whiteSpace:  'pre-wrap',
            wordBreak:   'break-word',
            lineHeight:  1.2,
          }}
          onDoubleClick={() => { setEditing(true); setLocalText(item.text); setLocalStyle(item.textStyle) }}
        >
          {item.text}
        </div>
      )}

      {/* Editor inline */}
      {editing && (
        <div className="no-drag" style={{ padding: 6 }} onMouseDown={e => e.stopPropagation()}>
          {/* Mini toolbar */}
          <div style={{ display:'flex', gap:4, marginBottom:6, flexWrap:'wrap', alignItems:'center' }}>
            <select
              value={localStyle.fontName}
              onChange={e => setLocalStyle(s => ({ ...s, fontName: e.target.value }))}
              style={{ fontSize:10, border:'1px solid #e5e7eb', borderRadius:6, padding:'2px 4px' }}
            >
              {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            <select
              value={localStyle.fontSize}
              onChange={e => setLocalStyle(s => ({ ...s, fontSize: parseInt(e.target.value) }))}
              style={{ fontSize:10, border:'1px solid #e5e7eb', borderRadius:6, padding:'2px 4px', width:48 }}
            >
              {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              onClick={() => setLocalStyle(s => ({ ...s, bold: !s.bold }))}
              style={{
                padding:'2px 6px', borderRadius:6, fontSize:11, fontWeight:'bold',
                border: localStyle.bold ? '2px solid #111' : '1px solid #e5e7eb',
                background: localStyle.bold ? '#111' : '#fff',
                color: localStyle.bold ? '#fff' : '#374151',
              }}
            >B</button>
            <button
              onClick={() => setLocalStyle(s => ({ ...s, italic: !s.italic }))}
              style={{
                padding:'2px 6px', borderRadius:6, fontSize:11, fontStyle:'italic',
                border: localStyle.italic ? '2px solid #111' : '1px solid #e5e7eb',
                background: localStyle.italic ? '#111' : '#fff',
                color: localStyle.italic ? '#fff' : '#374151',
              }}
            >I</button>
            {/* Cores */}
            <div style={{ display:'flex', gap:2, flexWrap:'wrap', maxWidth:96 }}>
              {COLORS.map(c => (
                <div
                  key={c}
                  onClick={() => setLocalStyle(s => ({ ...s, color: c }))}
                  style={{
                    width:14, height:14, borderRadius:3,
                    backgroundColor: c,
                    border: localStyle.color === c ? '2px solid #f97316' : '1px solid #e5e7eb',
                    cursor:'pointer',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Input */}
          <textarea
            autoFocus
            value={localText}
            onChange={e => setLocalText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit() } if (e.key === 'Escape') { setEditing(false) } }}
            style={{
              width: '100%', minHeight: 40, resize: 'none',
              border: '1px solid #e5e7eb', borderRadius: 6,
              padding: '4px 6px', fontSize: 12, outline: 'none',
              fontFamily, fontWeight: localStyle.bold ? 'bold' : 'normal',
              fontStyle: localStyle.italic ? 'italic' : 'normal',
              color: localStyle.color,
            }}
          />
          <div style={{ display:'flex', gap:4, marginTop:4 }}>
            <button
              onClick={commitEdit}
              style={{ flex:1, padding:'4px 0', background:'#f97316', color:'#fff', border:'none', borderRadius:6, fontSize:11, fontWeight:'bold', cursor:'pointer' }}
            >✓ OK</button>
            <button
              onClick={() => setEditing(false)}
              style={{ flex:1, padding:'4px 0', background:'#f3f4f6', color:'#374151', border:'none', borderRadius:6, fontSize:11, cursor:'pointer' }}
            >Cancelar</button>
          </div>
        </div>
      )}

      {/* Botões de ação (quando não editando) */}
      {!editing && (
        <>
          {/* Editar */}
          <button
            className="no-drag"
            onMouseDown={e => e.stopPropagation()}
            onClick={() => { setEditing(true); setLocalText(item.text); setLocalStyle(item.textStyle) }}
            style={{
              position:'absolute', top:-12, right:20,
              width:20, height:20, borderRadius:'50%',
              background:'#f97316', border:'none', color:'#fff',
              fontSize:10, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            }}
            title="Editar texto"
          >✎</button>

          {/* Remover */}
          <button
            className="no-drag"
            onMouseDown={e => e.stopPropagation()}
            onClick={() => onRemove(item.id)}
            style={{
              position:'absolute', top:-12, right:-4,
              width:20, height:20, borderRadius:'50%',
              background:'#ef4444', border:'none', color:'#fff',
              fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            }}
            title="Remover"
          >×</button>
        </>
      )}

      {/* Alça de redimensionar */}
      <div
        className="no-drag"
        onMouseDown={onMouseDownResize}
        style={{
          position:'absolute', bottom:-6, right:-6,
          width:14, height:14, borderRadius:3,
          background:'#f97316', cursor:'se-resize',
          border:'2px solid #fff',
        }}
      />
    </div>
  )
}

// ── PDFCanvas principal ────────────────────────────────────────────────────
export default function PDFCanvas({
  imageUrl, blocks, mode, pageInfo,
  onBlockClick, onBlockHover,
  onSelectionFinished, onPaste,
  // elementos de texto arrastáveis
  textElements, onUpdateTextElement, onRemoveTextElement,
}) {
  const containerRef = useRef(null)
  const [imgSize, setImgSize]   = useState({ w: 0, h: 0 })
  const [drag, setDrag]         = useState(null)
  const [dragging, setDragging] = useState(false)
  const [startPt, setStartPt]   = useState(null)
  const [hoveredId, setHoveredId] = useState(null)

  const onImgLoad = (e) => setImgSize({ w: e.target.naturalWidth, h: e.target.naturalHeight })

  const toPct = useCallback((px, py, pw, ph) => {
    const cont = containerRef.current
    if (!cont || !imgSize.w) return null
    const img = cont.querySelector('img')
    if (!img) return null
    const rect = img.getBoundingClientRect()
    return {
      x_pct: Math.max(0, (px / rect.width)  * 100),
      y_pct: Math.max(0, (py / rect.height) * 100),
      w_pct: Math.min(100, (pw / rect.width)  * 100),
      h_pct: Math.min(100, (ph / rect.height) * 100),
    }
  }, [imgSize])

  const pdfToCanvasPct = useCallback((x0, y0, x1, y1) => {
    if (!pageInfo) return null
    return {
      left:   `${(x0 / pageInfo.width)  * 100}%`,
      top:    `${(y0 / pageInfo.height) * 100}%`,
      width:  `${((x1 - x0) / pageInfo.width)  * 100}%`,
      height: `${((y1 - y0) / pageInfo.height) * 100}%`,
    }
  }, [pageInfo])

  const getLocalPos = (e) => {
    const img = containerRef.current?.querySelector('img')
    if (!img) return { x: 0, y: 0 }
    const rect = img.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onMouseDown = (e) => {
    if (mode === 'edit') return
    // Não inicia drag se clicar em elemento de texto (verifica o alvo e seus pais)
    if (e.target.closest('[data-text-element]')) return
    // Também ignora se o evento já foi stopPropagated por um filho
    if (e.defaultPrevented) return
    e.preventDefault()
    const pos = getLocalPos(e)
    setStartPt(pos)
    setDrag({ x: pos.x, y: pos.y, w: 0, h: 0 })
    setDragging(true)
  }

  const onMouseMove = (e) => {
    if (!dragging || !startPt) return
    const pos = getLocalPos(e)
    setDrag({
      x: Math.min(pos.x, startPt.x),
      y: Math.min(pos.y, startPt.y),
      w: Math.abs(pos.x - startPt.x),
      h: Math.abs(pos.y - startPt.y),
    })
  }

  const onMouseUp = () => {
    if (!dragging) return
    setDragging(false)
    if (drag && drag.w > 10 && drag.h > 10) {
      const pct = toPct(drag.x, drag.y, drag.w, drag.h)
      if (pct) onSelectionFinished(pct)
    }
    setDrag(null)
    setStartPt(null)
  }

  useEffect(() => {
    const handlePaste = (e) => {
      if (mode !== 'signature') return
      for (const item of (e.clipboardData?.items || [])) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) { onPaste(file); break }
        }
      }
    }
    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [mode, onPaste])

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${mode === 'edit' ? 'cursor-text' : 'cursor-crosshair'}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* PDF */}
      <img
        src={imageUrl}
        alt="PDF page"
        onLoad={onImgLoad}
        className="block w-full shadow-2xl"
        draggable={false}
      />

      {/* Blocos de texto extraídos */}
      {mode === 'edit' && pageInfo && blocks.map(block => {
        const style = pdfToCanvasPct(block.x0, block.y0, block.x1, block.y1)
        if (!style) return null
        const isHovered = hoveredId === block.id
        const isEdited  = block._edited

        return (
          <div
            key={block.id}
            style={{ position: 'absolute', ...style }}
            className="cursor-text"
            onClick={() => onBlockClick(block)}
            onMouseEnter={() => { setHoveredId(block.id); onBlockHover(block) }}
            onMouseLeave={() => { setHoveredId(null); onBlockHover(null) }}
          >
            {isHovered && !isEdited && (
              <div style={{
                position:'absolute', inset:'-2px',
                border:'2px solid #ff8c00', borderRadius:2,
                backgroundColor:'rgba(255,140,0,0.08)', pointerEvents:'none',
              }} />
            )}
            {isEdited && (
              <div style={{
                position:'absolute', inset:0,
                backgroundColor:'rgba(255,255,180,0.92)',
                border:'2px solid #ff8c00', borderRadius:2,
                display:'flex', alignItems:'center',
                paddingLeft:3, paddingRight:3,
                overflow:'hidden', whiteSpace:'nowrap',
                fontSize:`${Math.max(9, block.font_size * 0.72)}px`,
                fontWeight: block.is_bold   ? 'bold'   : 'normal',
                fontStyle:  block.is_italic ? 'italic' : 'normal',
                color: block.color_rgb
                  ? `rgb(${(block.color_rgb[0]*255).toFixed()},${(block.color_rgb[1]*255).toFixed()},${(block.color_rgb[2]*255).toFixed()})`
                  : '#000',
              }}>
                {block._new_text}
              </div>
            )}
          </div>
        )
      })}

      {/* Elementos de texto arrastáveis (modo lápis) */}
      {(textElements || []).map(item => (
        <div key={item.id} data-text-element="true">
          <DraggableText
            item={item}
            containerRef={containerRef}
            onUpdate={onUpdateTextElement}
            onRemove={onRemoveTextElement}
            onConfirm={() => {}}
          />
        </div>
      ))}

      {/* Retângulo de seleção */}
      {drag && (drag.w > 5 || drag.h > 5) && (
        <div style={{
          position:'absolute',
          left: drag.x, top: drag.y,
          width: drag.w, height: drag.h,
          border:`2px dashed ${mode === 'erase' ? '#cc3333' : mode === 'pencil' ? '#16a34a' : '#3366cc'}`,
          backgroundColor: mode === 'erase' ? 'rgba(204,51,51,0.1)' : mode === 'pencil' ? 'rgba(22,163,74,0.1)' : 'rgba(51,102,204,0.1)',
          pointerEvents:'none', borderRadius:2,
        }} />
      )}
    </div>
  )
}
