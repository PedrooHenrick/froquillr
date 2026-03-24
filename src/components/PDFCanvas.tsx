import { useRef, useState, useEffect, useCallback } from 'react'

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
function DraggableText({ item, imgRef, onUpdate, onRemove }) {
  const [editing, setEditing]       = useState(item._justCreated || false)
  const [localText, setLocalText]   = useState(item.text)
  const [localStyle, setLocalStyle] = useState({ ...item.textStyle })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef(null)

  const getImgRect = () => imgRef.current?.getBoundingClientRect() ?? null

  // ── Arrastar ──────────────────────────────────────────────────────────
  const handleMouseDownDrag = (e) => {
    if (editing) return
    if (e.target.closest('[data-nodrag]')) return
    e.preventDefault()
    e.stopPropagation()

    const rect    = getImgRect()
    if (!rect) return

    // Posição do clique dentro da imagem (em %)
    const clickXpct = ((e.clientX - rect.left) / rect.width)  * 100
    const clickYpct = ((e.clientY - rect.top)  / rect.height) * 100

    // Offset: onde dentro do elemento o usuário clicou
    const offsetX = clickXpct - item.x_pct
    const offsetY = clickYpct - item.y_pct

    dragRef.current = {
      offsetX,
      offsetY,
      rectW: rect.width,
      rectH: rect.height,
    }
    setIsDragging(true)
  }

  useEffect(() => {
    if (!isDragging) return

    const onMove = (e) => {
      const d = dragRef.current
      if (!d) return
      const rect = getImgRect()
      if (!rect) return

      // Posição atual do mouse em % da imagem
      const mouseXpct = ((e.clientX - rect.left) / rect.width)  * 100
      const mouseYpct = ((e.clientY - rect.top)  / rect.height) * 100

      // Subtrai o offset para o elemento não "saltar"
      onUpdate(item.id, {
        x_pct: Math.max(0, Math.min(96, mouseXpct - d.offsetX)),
        y_pct: Math.max(0, Math.min(96, mouseYpct - d.offsetY)),
      })
    }

    const onUp = () => {
      dragRef.current = null
      setIsDragging(false)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [isDragging, item.id, onUpdate])

  // ── Confirmar edição ──────────────────────────────────────────────────
  const commitEdit = () => {
    onUpdate(item.id, { text: localText, textStyle: { ...localStyle }, _justCreated: false })
    setEditing(false)
  }

  const cancelEdit = () => {
    if (item._justCreated) { onRemove(item.id); return }
    setLocalText(item.text)
    setLocalStyle({ ...item.textStyle })
    setEditing(false)
  }

  const fontFamily =
    localStyle.fontName === 'times'   ? 'Georgia, serif' :
    localStyle.fontName === 'courier' ? 'Courier New, monospace' :
    localStyle.fontName === 'verdana' ? 'Verdana, sans-serif' :
    'Arial, sans-serif'

  const displayFontFamily =
    item.textStyle.fontName === 'times'   ? 'Georgia, serif' :
    item.textStyle.fontName === 'courier' ? 'Courier New, monospace' :
    item.textStyle.fontName === 'verdana' ? 'Verdana, sans-serif' :
    'Arial, sans-serif'

  return (
    <div
      data-text-element="true"
      style={{
        position:   'absolute',
        left:       `${item.x_pct}%`,
        top:        `${item.y_pct}%`,
        width:      editing ? `${Math.max(item.w_pct, 25)}%` : 'auto',
        minWidth:   '60px',
        maxWidth:   '80%',
        cursor:     isDragging ? 'grabbing' : editing ? 'default' : 'grab',
        userSelect: 'none',
        zIndex:     editing ? 100 : 50,
      }}
      onMouseDown={handleMouseDownDrag}
    >
      {/* ── Modo visualização ── */}
      {!editing && (
        <div
          style={{
            position:        'relative',
            padding:         '2px 6px',
            border:          '1.5px solid #f97316',
            borderRadius:    2,
            backgroundColor: 'transparent',
            fontFamily:      displayFontFamily,
            fontWeight:      item.textStyle.bold   ? 'bold'   : 'normal',
            fontStyle:       item.textStyle.italic ? 'italic' : 'normal',
            color:           item.textStyle.color  || '#000',
            fontSize:        `${item.textStyle.fontSize || 16}px`,
            whiteSpace:      'pre-wrap',
            wordBreak:       'break-word',
            lineHeight:      1.3,
          }}
          onDoubleClick={() => {
            setLocalText(item.text)
            setLocalStyle({ ...item.textStyle })
            setEditing(true)
          }}
        >
          {item.text || <span style={{ opacity: 0.4, fontStyle: 'italic' }}>texto vazio</span>}

          {/* Botão remover */}
          <button
            data-nodrag="true"
            onMouseDown={e => e.stopPropagation()}
            onClick={() => onRemove(item.id)}
            title="Remover"
            style={{
              position:   'absolute', top: -10, right: -10,
              width: 20, height: 20, borderRadius: '50%',
              background: '#ef4444', border: '2px solid #fff',
              color: '#fff', fontSize: 13, lineHeight: '16px',
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}
          >×</button>

          {/* Dica */}
          <div style={{
            position: 'absolute', bottom: -16, left: 0,
            fontSize: 9, color: '#f97316', whiteSpace: 'nowrap',
            pointerEvents: 'none', opacity: 0.8,
          }}>
            ✥ arrastar · duplo clique para editar
          </div>
        </div>
      )}

      {/* ── Modo edição ── */}
      {editing && (
        <div
          data-nodrag="true"
          onMouseDown={e => e.stopPropagation()}
          style={{
            background:   '#fff',
            border:       '2px solid #f97316',
            borderRadius: 8,
            padding:      8,
            boxShadow:    '0 4px 20px rgba(0,0,0,0.25)',
            minWidth:     240,
          }}
        >
          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={localStyle.fontName}
              onChange={e => setLocalStyle(s => ({ ...s, fontName: e.target.value }))}
              style={{ fontSize: 10, border: '1px solid #e5e7eb', borderRadius: 4, padding: '2px 4px' }}
            >
              {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>

            <select
              value={localStyle.fontSize}
              onChange={e => setLocalStyle(s => ({ ...s, fontSize: parseInt(e.target.value) }))}
              style={{ fontSize: 10, border: '1px solid #e5e7eb', borderRadius: 4, padding: '2px 4px', width: 46 }}
            >
              {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <button
              onClick={() => setLocalStyle(s => ({ ...s, bold: !s.bold }))}
              style={{
                padding: '2px 7px', borderRadius: 4, fontSize: 12, fontWeight: 'bold',
                border:     localStyle.bold ? '2px solid #111' : '1px solid #d1d5db',
                background: localStyle.bold ? '#111' : '#f9fafb',
                color:      localStyle.bold ? '#fff' : '#374151',
                cursor: 'pointer',
              }}
            >B</button>

            <button
              onClick={() => setLocalStyle(s => ({ ...s, italic: !s.italic }))}
              style={{
                padding: '2px 7px', borderRadius: 4, fontSize: 12, fontStyle: 'italic',
                border:     localStyle.italic ? '2px solid #111' : '1px solid #d1d5db',
                background: localStyle.italic ? '#111' : '#f9fafb',
                color:      localStyle.italic ? '#fff' : '#374151',
                cursor: 'pointer',
              }}
            >I</button>

            {/* Paleta de cores */}
            <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', maxWidth: 100 }}>
              {COLORS.map(c => (
                <div
                  key={c}
                  onClick={() => setLocalStyle(s => ({ ...s, color: c }))}
                  style={{
                    width: 14, height: 14, borderRadius: 3,
                    backgroundColor: c,
                    border: localStyle.color === c ? '2px solid #f97316' : '1px solid #d1d5db',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Textarea */}
          <textarea
            autoFocus
            value={localText}
            onChange={e => setLocalText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit() }
              if (e.key === 'Escape') cancelEdit()
            }}
            placeholder="Digite o texto..."
            style={{
              width:        '100%',
              minHeight:    36,
              resize:       'vertical',
              border:       '1px solid #e5e7eb',
              borderRadius: 6,
              padding:      '4px 6px',
              fontSize:     13,
              outline:      'none',
              fontFamily,
              fontWeight:   localStyle.bold   ? 'bold'   : 'normal',
              fontStyle:    localStyle.italic ? 'italic' : 'normal',
              color:        localStyle.color,
              lineHeight:   1.4,
            }}
          />

          {/* Botões */}
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <button
              onClick={commitEdit}
              style={{
                flex: 1, padding: '5px 0',
                background: '#f97316', color: '#fff',
                border: 'none', borderRadius: 6,
                fontSize: 12, fontWeight: 'bold', cursor: 'pointer',
              }}
            >✓ OK</button>
            <button
              onClick={cancelEdit}
              style={{
                flex: 1, padding: '5px 0',
                background: '#f3f4f6', color: '#374151',
                border: '1px solid #e5e7eb', borderRadius: 6,
                fontSize: 12, cursor: 'pointer',
              }}
            >Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── PDFCanvas principal ────────────────────────────────────────────────────
export default function PDFCanvas({
  imageUrl, blocks, mode, pageInfo,
  onBlockClick, onBlockHover,
  onSelectionFinished, onPaste,
  textElements, onUpdateTextElement, onRemoveTextElement,
}) {
  const containerRef              = useRef(null)
  const imgRef                    = useRef(null)
  const [imgSize, setImgSize]     = useState({ w: 0, h: 0 })
  const [drag, setDrag]           = useState(null)
  const [dragging, setDragging]   = useState(false)
  const [startPt, setStartPt]     = useState(null)
  const [hoveredId, setHoveredId] = useState(null)

  const onImgLoad = (e) => setImgSize({ w: e.target.naturalWidth, h: e.target.naturalHeight })

  const toPct = useCallback((px, py, pw, ph) => {
    if (!imgRef.current || !imgSize.w) return null
    const rect = imgRef.current.getBoundingClientRect()
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
    if (!imgRef.current) return { x: 0, y: 0 }
    const rect = imgRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onMouseDown = (e) => {
    if (mode === 'edit') return
    if (e.target.closest('[data-text-element]')) return
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
        ref={imgRef}
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
                position: 'absolute', inset: '-2px',
                border: '2px solid #ff8c00', borderRadius: 2,
                backgroundColor: 'rgba(255,140,0,0.08)', pointerEvents: 'none',
              }} />
            )}
            {isEdited && (
              <div style={{
                position: 'absolute', inset: 0,
                backgroundColor: 'rgba(255,255,180,0.92)',
                border: '2px solid #ff8c00', borderRadius: 2,
                display: 'flex', alignItems: 'center',
                paddingLeft: 3, paddingRight: 3,
                overflow: 'hidden', whiteSpace: 'nowrap',
                fontSize: `${Math.max(9, block.font_size * 0.72)}px`,
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

      {/* Elementos de texto arrastáveis */}
      {(textElements || []).map(item => (
        <DraggableText
          key={item.id}
          item={item}
          imgRef={imgRef}
          onUpdate={onUpdateTextElement}
          onRemove={onRemoveTextElement}
        />
      ))}

      {/* Retângulo de seleção */}
      {drag && (drag.w > 5 || drag.h > 5) && (
        <div style={{
          position: 'absolute',
          left: drag.x, top: drag.y,
          width: drag.w, height: drag.h,
          border: `2px dashed ${mode === 'erase' ? '#cc3333' : mode === 'pencil' ? '#16a34a' : '#3366cc'}`,
          backgroundColor: mode === 'erase' ? 'rgba(204,51,51,0.1)' : mode === 'pencil' ? 'rgba(22,163,74,0.1)' : 'rgba(51,102,204,0.1)',
          pointerEvents: 'none', borderRadius: 2,
        }} />
      )}
    </div>
  )
}
