import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

// ─── TROQUE OS CAMINHOS DAS IMAGENS AQUI ───────────────────────────────────
// Coloque suas imagens na pasta /public/images/ e atualize os caminhos abaixo
const EXAMPLES = [
  {
    label: "Substituição de texto",
    before: "/images/before-1.png",   // ← troque pela sua imagem
    after:  "/images/after-1.png",    // ← troque pela sua imagem
    beforeLabel: "Original",
    afterLabel:  "Editado",
  },
  {
    label: "Remoção de assinatura",
    before: "/images/before-2.png",   // ← troque pela sua imagem
    after:  "/images/after-2.png",    // ← troque pela sua imagem
    beforeLabel: "Original",
    afterLabel:  "Editado",
  },
  {
    label: "Adição de carimbo",
    before: "/images/before-3.png",   // ← troque pela sua imagem
    after:  "/images/after-3.png",    // ← troque pela sua imagem
    beforeLabel: "Original",
    afterLabel:  "Editado",
  },
];
// ───────────────────────────────────────────────────────────────────────────

const PLACEHOLDER_BEFORE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'>
    <rect width='800' height='500' fill='%23f1f5f9'/>
    <rect x='60' y='60' width='680' height='40' rx='6' fill='%23cbd5e1'/>
    <rect x='60' y='120' width='560' height='20' rx='4' fill='%23e2e8f0'/>
    <rect x='60' y='152' width='620' height='20' rx='4' fill='%23e2e8f0'/>
    <rect x='60' y='184' width='480' height='20' rx='4' fill='%23e2e8f0'/>
    <rect x='60' y='240' width='680' height='120' rx='8' fill='%23e2e8f0'/>
    <rect x='60' y='380' width='300' height='20' rx='4' fill='%23e2e8f0'/>
    <rect x='60' y='412' width='420' height='20' rx='4' fill='%23e2e8f0'/>
    <text x='400' y='470' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2394a3b8'>Imagem ANTES — substitua em /public/images/</text>
  </svg>`);

const PLACEHOLDER_AFTER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'>
    <rect width='800' height='500' fill='%23eff6ff'/>
    <rect x='60' y='60' width='680' height='40' rx='6' fill='%2393c5fd'/>
    <rect x='60' y='120' width='560' height='20' rx='4' fill='%23bfdbfe'/>
    <rect x='60' y='152' width='620' height='20' rx='4' fill='%23bfdbfe'/>
    <rect x='60' y='184' width='480' height='20' rx='4' fill='%23bfdbfe'/>
    <rect x='60' y='240' width='680' height='120' rx='8' fill='%233b82f6' opacity='0.15'/>
    <rect x='80' y='255' width='300' height='16' rx='3' fill='%232563eb' opacity='0.4'/>
    <rect x='80' y='279' width='420' height='16' rx='3' fill='%232563eb' opacity='0.4'/>
    <rect x='60' y='380' width='300' height='20' rx='4' fill='%23bfdbfe'/>
    <rect x='60' y='412' width='420' height='20' rx='4' fill='%23bfdbfe'/>
    <text x='400' y='470' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2393c5fd'>Imagem DEPOIS — substitua em /public/images/</text>
  </svg>`);

function Slider({ before, after, beforeLabel, afterLabel }: {
  before: string; after: string; beforeLabel: string; afterLabel: string;
}) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  }, []);

  const onMouseDown = () => setDragging(true);
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (dragging) updatePos(e.clientX);
  }, [dragging, updatePos]);
  const onMouseUp = () => setDragging(false);

  const onTouchMove = useCallback((e: TouchEvent) => {
    updatePos(e.touches[0].clientX);
  }, [updatePos]);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);
    };
  }, [onMouseMove, onTouchMove]);

  // Usa placeholder se a imagem não for encontrada
  const [beforeSrc, setBeforeSrc] = useState(before);
  const [afterSrc, setAfterSrc]   = useState(after);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl border border-border shadow-lg select-none cursor-col-resize"
      style={{ aspectRatio: "16/10" }}
    >
      {/* Imagem DEPOIS (fundo completo) */}
      <img
        src={afterSrc}
        onError={() => setAfterSrc(PLACEHOLDER_AFTER)}
        alt="Depois"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Imagem ANTES (recortada pela esquerda) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <img
          src={beforeSrc}
          onError={() => setBeforeSrc(PLACEHOLDER_BEFORE)}
          alt="Antes"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: containerRef.current?.offsetWidth ?? "100%" }}
          draggable={false}
        />
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full pointer-events-none">
        {beforeLabel}
      </div>
      <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full pointer-events-none">
        {afterLabel}
      </div>

      {/* Linha divisória */}
      <div
        className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.4)] pointer-events-none"
        style={{ left: `${pos}%` }}
      />

      {/* Handle arrastável */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg border-2 border-primary flex items-center justify-center cursor-col-resize z-10"
        style={{ left: `${pos}%` }}
        onMouseDown={onMouseDown}
        onTouchStart={() => setDragging(true)}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M5 4L2 8L5 12M11 4L14 8L11 12" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

const BeforeAfter = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="before-after" className="py-24 px-6 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-primary">
            Resultados reais
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Veja a diferença na prática
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Arraste o slider para comparar o documento original com o resultado após edição.
          </p>
        </motion.div>

        {/* Tabs de exemplo */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {EXAMPLES.map((ex, i) => (
            <button
              key={ex.label}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                active === i
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {ex.label}
            </button>
          ))}
        </div>

        {/* Slider */}
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Slider
            before={EXAMPLES[active].before}
            after={EXAMPLES[active].after}
            beforeLabel={EXAMPLES[active].beforeLabel}
            afterLabel={EXAMPLES[active].afterLabel}
          />
        </motion.div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          ← Arraste para comparar →
        </p>
      </div>
    </section>
  );
};

export default BeforeAfter;
