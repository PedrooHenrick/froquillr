import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Type, Eraser, PenLine, FileSignature, Globe } from "lucide-react";

// ─── TROQUE OS CAMINHOS DAS IMAGENS AQUI ──────────────────────────────────
// Coloque suas imagens em /public/images/ e atualize os caminhos abaixo
const EXAMPLES = [
  {
    label: "Substituição de texto",
    before: "/images/before-1.png",
    after:  "/images/after-1.png",
  },
  {
    label: "Remoção de elemento",
    before: "/images/before-2.png",
    after:  "/images/after-2.png",
  },
  {
    label: "Adição de carimbo",
    before: "/images/before-3.png",
    after:  "/images/after-3.png",
  },
];
// ──────────────────────────────────────────────────────────────────────────

const PLACEHOLDER_BEFORE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='460' viewBox='0 0 800 460'>
    <rect width='800' height='460' fill='%23f1f5f9'/>
    <rect x='60' y='50' width='680' height='36' rx='6' fill='%23cbd5e1'/>
    <rect x='60' y='106' width='560' height='18' rx='4' fill='%23e2e8f0'/>
    <rect x='60' y='134' width='620' height='18' rx='4' fill='%23e2e8f0'/>
    <rect x='60' y='162' width='480' height='18' rx='4' fill='%23e2e8f0'/>
    <rect x='60' y='210' width='680' height='110' rx='8' fill='%23e2e8f0'/>
    <rect x='60' y='340' width='300' height='18' rx='4' fill='%23e2e8f0'/>
    <rect x='60' y='368' width='420' height='18' rx='4' fill='%23e2e8f0'/>
    <text x='400' y='435' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%2394a3b8'>Coloque sua imagem em /public/images/before-1.png</text>
  </svg>`);

const PLACEHOLDER_AFTER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='460' viewBox='0 0 800 460'>
    <rect width='800' height='460' fill='%23eff6ff'/>
    <rect x='60' y='50' width='680' height='36' rx='6' fill='%2393c5fd'/>
    <rect x='60' y='106' width='560' height='18' rx='4' fill='%23bfdbfe'/>
    <rect x='60' y='134' width='620' height='18' rx='4' fill='%23bfdbfe'/>
    <rect x='60' y='162' width='480' height='18' rx='4' fill='%23bfdbfe'/>
    <rect x='60' y='210' width='680' height='110' rx='8' fill='%233b82f6' opacity='0.12'/>
    <rect x='80' y='228' width='320' height='14' rx='3' fill='%232563eb' opacity='0.35'/>
    <rect x='80' y='252' width='440' height='14' rx='3' fill='%232563eb' opacity='0.35'/>
    <rect x='60' y='340' width='300' height='18' rx='4' fill='%23bfdbfe'/>
    <rect x='60' y='368' width='420' height='18' rx='4' fill='%23bfdbfe'/>
    <text x='400' y='435' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%2393c5fd'>Coloque sua imagem em /public/images/after-1.png</text>
  </svg>`);

function Slider({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [beforeSrc, setBeforeSrc] = useState(before);
  const [afterSrc, setAfterSrc]   = useState(after);

  // reset srcs when example changes
  useEffect(() => { setBeforeSrc(before); }, [before]);
  useEffect(() => { setAfterSrc(after); },  [after]);

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging) updatePos(e.clientX); };
    const onUp   = () => setDragging(false);
    const onTouch = (e: TouchEvent) => updatePos(e.touches[0].clientX);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    window.addEventListener("touchmove", onTouch);
    window.addEventListener("touchend",  onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend",  onUp);
    };
  }, [dragging, updatePos]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl border border-border shadow-lg select-none cursor-col-resize"
      style={{ aspectRatio: "16/9" }}
    >
      {/* DEPOIS — fundo */}
      <img
        src={afterSrc}
        onError={() => setAfterSrc(PLACEHOLDER_AFTER)}
        alt="Depois"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* ANTES — recortado */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={beforeSrc}
          onError={() => setBeforeSrc(PLACEHOLDER_BEFORE)}
          alt="Antes"
          className="absolute inset-0 h-full object-cover"
          style={{ width: containerRef.current?.offsetWidth ?? "100%" }}
          draggable={false}
        />
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full pointer-events-none">
        Original
      </span>
      <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full pointer-events-none">
        Editado
      </span>

      {/* Linha */}
      <div
        className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.5)] pointer-events-none"
        style={{ left: `${pos}%` }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg border-2 border-primary flex items-center justify-center z-10 cursor-col-resize"
        style={{ left: `${pos}%` }}
        onMouseDown={() => setDragging(true)}
        onTouchStart={() => setDragging(true)}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M5 4L2 8L5 12M11 4L14 8L11 12" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

// ─── Benefits cards ────────────────────────────────────────────────────────

const benefits = [
  { icon: Type,          title: "Edicao direta de texto",      description: "Altere qualquer texto do PDF com controle total sobre fonte, tamanho e posicionamento." },
  { icon: Eraser,        title: "Remocao com precisao",        description: "Apague qualquer elemento do documento preservando o layout original." },
  { icon: PenLine,       title: "Insercao de conteudo",        description: "Adicione novos textos, imagens e blocos de conteudo onde precisar." },
  { icon: FileSignature, title: "Assinatura digital integrada",description: "Assine documentos eletronicamente com validade juridica e seguranca." },
  { icon: Globe,         title: "100% online",                 description: "Funciona diretamente no navegador. Sem downloads, sem instalacoes." },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const Benefits = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="benefits" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tighter-custom">
            Edite seus documentos sem limitacoes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Todas as ferramentas que voce precisa para ter controle total sobre seus PDFs, em um unico lugar.
          </p>
        </motion.div>

        {/* Slider antes/depois */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-5 flex-wrap">
            {EXAMPLES.map((ex, i) => (
              <button
                key={ex.label}
                onClick={() => setActive(i)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  active === i
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {ex.label}
              </button>
            ))}
          </div>

          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <Slider before={EXAMPLES[active].before} after={EXAMPLES[active].after} />
          </motion.div>

          <p className="text-center text-xs text-muted-foreground mt-3">
            ← Arraste o controle para comparar →
          </p>
        </motion.div>

        {/* Cards de features */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16"
        >
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.title}
              variants={itemAnim}
              whileHover={{ y: -5 }}
              className="p-8 bg-card rounded-2xl shadow-card"
            >
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-6">
                <benefit.icon className="text-primary" size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Benefits;
