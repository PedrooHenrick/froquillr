import { useRef, useEffect } from "react";
import { Check, X, Bold, Italic } from "lucide-react";

const FONTS = [
  { value: "arial",   label: "Arial" },
  { value: "times",   label: "Times New Roman" },
  { value: "courier", label: "Courier" },
  { value: "calibri", label: "Calibri" },
  { value: "verdana", label: "Verdana" },
];

const SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

const COLORS = [
  "#000000", "#1a1a2e", "#16213e", "#0f3460",
  "#e94560", "#ff6b6b", "#feca57", "#48dbfb",
  "#ff9ff3", "#54a0ff", "#5f27cd", "#00d2d3",
  "#1dd1a1", "#2ecc71", "#e67e22", "#ffffff",
];

export default function TextToolbar({
  rect,
  text,
  onTextChange,
  style,
  onStyleChange,
  onConfirm,
  onCancel,
}: {
  rect: any;
  text: string;
  onTextChange: (v: string) => void;
  style: any;
  onStyleChange: (s: any) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const update = (key: string, val: any) =>
    onStyleChange((prev: any) => ({ ...prev, [key]: val }));

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); onConfirm(); }
    if (e.key === "Escape") onCancel();
  };

  // Posiciona a toolbar acima ou abaixo da área selecionada
  const top  = rect.y_pct > 60 ? undefined : `calc(${rect.y_pct}% + ${rect.h_pct}% + 8px)`;
  const bottom = rect.y_pct > 60 ? `calc(${100 - rect.y_pct}% + 8px)` : undefined;
  const left = `${Math.min(Math.max(rect.x_pct, 0), 60)}%`;

  return (
    <div
      style={{ position: "absolute", top, bottom, left, zIndex: 50, minWidth: 340, maxWidth: 420 }}
      className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
      onClick={e => e.stopPropagation()}
    >
      {/* Linha 1: fonte + tamanho + negrito + itálico + cor */}
      <div className="flex items-center gap-1.5 px-3 pt-3 pb-2 border-b border-gray-100 flex-wrap">
        {/* Fonte */}
        <select
          value={style.fontName}
          onChange={e => update("fontName", e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-orange-400 bg-white"
        >
          {FONTS.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        {/* Tamanho */}
        <select
          value={style.fontSize}
          onChange={e => update("fontSize", parseInt(e.target.value))}
          className="w-16 text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-orange-400 bg-white"
        >
          {SIZES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Negrito */}
        <button
          onClick={() => update("bold", !style.bold)}
          className={`p-1.5 rounded-lg border transition-all ${
            style.bold
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
          }`}
          title="Negrito (B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        {/* Itálico */}
        <button
          onClick={() => update("italic", !style.italic)}
          className={`p-1.5 rounded-lg border transition-all ${
            style.italic
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
          }`}
          title="Itálico (I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        {/* Cor */}
        <div className="relative">
          <div
            className="w-7 h-7 rounded-lg border-2 border-gray-200 cursor-pointer"
            style={{ backgroundColor: style.color }}
            title="Cor do texto"
            onClick={() => document.getElementById("color-picker-input")?.click()}
          />
          <input
            id="color-picker-input"
            type="color"
            value={style.color}
            onChange={e => update("color", e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
        </div>
      </div>

      {/* Paleta de cores rápidas */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 flex-wrap">
        {COLORS.map(c => (
          <button
            key={c}
            onClick={() => update("color", c)}
            style={{ backgroundColor: c }}
            className={`w-5 h-5 rounded-md border transition-transform hover:scale-110 ${
              style.color === c ? "border-orange-500 scale-110" : "border-gray-200"
            }`}
            title={c}
          />
        ))}
      </div>

      {/* Input de texto */}
      <div className="px-3 py-2">
        <input
          ref={inputRef}
          value={text}
          onChange={e => onTextChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Digite o texto aqui..."
          className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-orange-400 transition-colors"
          style={{
            fontFamily: style.fontName === "times" ? "serif" : style.fontName === "courier" ? "monospace" : "sans-serif",
            fontWeight: style.bold   ? "bold"   : "normal",
            fontStyle:  style.italic ? "italic" : "normal",
            color:      style.color,
            fontSize:   Math.min(style.fontSize, 18) + "px",
          }}
        />
        <p className="text-[10px] text-gray-400 mt-1 ml-1">Enter para confirmar · Esc para cancelar</p>
      </div>

      {/* Botões */}
      <div className="flex gap-2 px-3 pb-3">
        <button
          onClick={onCancel}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-all"
        >
          <X className="w-3.5 h-3.5" /> Cancelar
        </button>
        <button
          onClick={onConfirm}
          disabled={!text.trim()}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-40 text-white text-sm font-semibold transition-all"
        >
          <Check className="w-3.5 h-3.5" /> Adicionar
        </button>
      </div>
    </div>
  );
}
