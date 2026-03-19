import { useRef, useState, useEffect, useCallback } from 'react'

export default function PDFCanvas({
  imageUrl, blocks, mode, pageInfo,
  onBlockClick, onBlockHover,
  onSelectionFinished, onPaste,
}) {
  const containerRef = useRef(null)
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 })
  const [drag, setDrag] = useState(null)       // {x,y,w,h} em pixels do canvas
  const [dragging, setDragging] = useState(false)
  const [startPt, setStartPt] = useState(null)

  // Quando imagem carrega, pega tamanho real
  const onImgLoad = (e) => {
    setImgSize({ w: e.target.naturalWidth, h: e.target.naturalHeight })
  }

  // Converte pixel do canvas → % da página PDF
  const toPct = useCallback((px, py, pw, ph) => {
    const cont = containerRef.current
    if (!cont || !imgSize.w) return null
    const img = cont.querySelector('img')
    if (!img) return null
    const rect = img.getBoundingClientRect()
    const x_pct = Math.max(0, (px / rect.width) * 100)
    const y_pct = Math.max(0, (py / rect.height) * 100)
    const w_pct = Math.min(100 - x_pct, (pw / rect.width) * 100)
    const h_pct = Math.min(100 - y_pct, (ph / rect.height) * 100)
    return { x_pct, y_pct, w_pct, h_pct }
  }, [imgSize])

  // Converte coordenadas PDF (pts) → % do canvas
  const pdfToCanvasPct = useCallback((x0, y0, x1, y1) => {
    if (!pageInfo) return null
    return {
      left: `${(x0 / pageInfo.width) * 100}%`,
      top:  `${(y0 / pageInfo.height) * 100}%`,
      width: `${((x1 - x0) / pageInfo.width) * 100}%`,
      height: `${((y1 - y0) / pageInfo.height) * 100}%`,
    }
  }, [pageInfo])

  // Mouse events para seleção por arrasto
  const getLocalPos = (e) => {
    const img = containerRef.current?.querySelector('img')
    if (!img) return { x: 0, y: 0 }
    const rect = img.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
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

  const onMouseUp = (e) => {
    if (!dragging) return
    setDragging(false)
    if (drag && drag.w > 10 && drag.h > 10) {
      const pct = toPct(drag.x, drag.y, drag.w, drag.h)
      if (pct) onSelectionFinished(pct)
    }
    setDrag(null)
    setStartPt(null)
  }

  // Ctrl+V
  useEffect(() => {
    const handlePaste = async (e) => {
      if (mode !== 'signature') return
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) onPaste(file)
          break
        }
      }
    }
    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [mode, onPaste])

  const cursorClass = mode === 'edit' ? 'cursor-default' : 'cursor-crosshair'

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${cursorClass}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* Imagem da página PDF */}
      <img
        src={imageUrl}
        alt="PDF page"
        onLoad={onImgLoad}
        className="block w-full shadow-2xl"
        draggable={false}
      />

      {/* Blocos de texto sobrepostos */}
      {mode === 'edit' && pageInfo && blocks.map(block => {
        const style = pdfToCanvasPct(block.x0, block.y0, block.x1, block.y1)
        if (!style) return null
        return (
          <div
            key={block.id}
            style={{ position: 'absolute', ...style }}
            className="group cursor-text"
            onClick={() => onBlockClick(block)}
            onMouseEnter={() => onBlockHover(block)}
            onMouseLeave={() => onBlockHover(null)}
          >
            {/* Hover highlight */}
            <div className="absolute inset-0 border border-dashed border-transparent group-hover:border-[#ff8c00] group-hover:bg-[#ff8c0015] rounded-sm transition-all" />
            {/* Se editado, mostra o texto novo */}
            {block._edited && (
              <div
                className="absolute inset-0 bg-[#ffffb4dd] border border-[#ff8c00] rounded-sm flex items-center px-1"
                style={{
                  fontSize: `${block.font_size * 0.72}px`,
                  color: `rgb(${(block.color_rgb[0]*255).toFixed()},${(block.color_rgb[1]*255).toFixed()},${(block.color_rgb[2]*255).toFixed()})`,
                  fontWeight: block.is_bold ? 'bold' : 'normal',
                  fontStyle: block.is_italic ? 'italic' : 'normal',
                }}
              >
                {block._new_text}
              </div>
            )}
          </div>
        )
      })}

      {/* Retângulo de seleção */}
      {drag && (drag.w > 5 || drag.h > 5) && (
        <div
          className="selection-box pointer-events-none"
          style={{
            left: drag.x,
            top: drag.y,
            width: drag.w,
            height: drag.h,
            borderColor: mode === 'erase' ? '#cc3333' : '#3366cc',
            backgroundColor: mode === 'erase' ? '#cc333320' : '#3366cc20',
          }}
        />
      )}
    </div>
  )
}
