import { useRef, useState, useEffect, useCallback } from 'react'

export default function PDFCanvas({
  imageUrl, blocks, mode, pageInfo,
  onBlockClick, onBlockHover,
  onSelectionFinished, onPaste,
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
      x_pct: Math.max(0, (px / rect.width) * 100),
      y_pct: Math.max(0, (py / rect.height) * 100),
      w_pct: Math.min(100, (pw / rect.width) * 100),
      h_pct: Math.min(100, (ph / rect.height) * 100),
    }
  }, [imgSize])

  const pdfToCanvasPct = useCallback((x0, y0, x1, y1) => {
    if (!pageInfo) return null
    return {
      left:   `${(x0 / pageInfo.width) * 100}%`,
      top:    `${(y0 / pageInfo.height) * 100}%`,
      width:  `${((x1 - x0) / pageInfo.width) * 100}%`,
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
        style={{ transition: 'opacity 0.15s ease' }}
        draggable={false}
      />

      {/* Blocos de texto */}
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
            {/* Retângulo de hover — aparece ao passar o mouse */}
            {isHovered && !isEdited && (
              <div
                style={{
                  position: 'absolute',
                  inset: '-2px',
                  border: '2px solid #ff8c00',
                  borderRadius: '2px',
                  backgroundColor: 'rgba(255, 140, 0, 0.08)',
                  pointerEvents: 'none',
                  // Animação suave de entrada
                  animation: 'fadeInRect 0.1s ease',
                }}
              />
            )}

            {/* Texto editado — overlay amarelo */}
            {isEdited && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(255, 255, 180, 0.92)',
                  border: '2px solid #ff8c00',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '3px',
                  paddingRight: '3px',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  fontSize: `${Math.max(9, block.font_size * 0.72)}px`,
                  fontWeight: block.is_bold ? 'bold' : 'normal',
                  fontStyle: block.is_italic ? 'italic' : 'normal',
                  color: block.color_rgb
                    ? `rgb(${(block.color_rgb[0]*255).toFixed()},${(block.color_rgb[1]*255).toFixed()},${(block.color_rgb[2]*255).toFixed()})`
                    : '#000',
                }}
              >
                {block._new_text}
              </div>
            )}
          </div>
        )
      })}

      {/* Retângulo de seleção (erase/signature) */}
      {drag && (drag.w > 5 || drag.h > 5) && (
        <div
          style={{
            position: 'absolute',
            left: drag.x, top: drag.y,
            width: drag.w, height: drag.h,
            border: `2px dashed ${mode === 'erase' ? '#cc3333' : '#3366cc'}`,
            backgroundColor: mode === 'erase' ? 'rgba(204,51,51,0.1)' : 'rgba(51,102,204,0.1)',
            pointerEvents: 'none',
            borderRadius: '2px',
          }}
        />
      )}

      {/* CSS da animação */}
      <style>{`
        @keyframes fadeInRect {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
