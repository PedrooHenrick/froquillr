import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, FileText, Eraser, PenTool, Sparkles } from "lucide-react";

import ft1 from "/ft1.png";
import ft2 from "/ft2.png";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] },
});

const FEATURES = [
  { icon: FileText, title: "Edição de texto",   desc: "Clique em qualquer texto e edite na hora, com fonte e tamanho preservados." },
  { icon: Eraser,   title: "Apagar áreas",      desc: "Remove assinaturas, carimbos e conteúdo sem deixar rastro." },
  { icon: PenTool,  title: "Assinaturas",       desc: "Cole ou arraste sua assinatura para qualquer posição." },
  { icon: Sparkles, title: "IA integrada",      desc: "Identifica fontes, cores e posições automaticamente." },
];

const PLANS = [
  {
    name: "Grátis",
    price: "R$ 0",
    period: "para sempre",
    features: ["3 documentos por semana", "Edição básica de texto", "Download em PDF"],
    cta: "Começar grátis",
    highlight: false,
    link: "/dashboard",
  },
  {
    name: "Básico",
    price: "R$ 5",
    period: "/ 5 PDFs",
    features: ["5 documentos por compra", "Todas as ferramentas", "Assinatura digital", "Sem expiração"],
    cta: "Comprar agora",
    highlight: false,
    link: "/checkout?plan=basic",
  },
  {
    name: "Pro",
    price: "R$ 12,80",
    period: "/mês",
    features: ["Documentos ilimitados", "Todas as ferramentas", "Assinatura digital", "Suporte prioritário", "Upload até 100MB"],
    cta: "Assinar Pro",
    highlight: true,
    link: "/checkout?plan=pro",
  },
];

function QuillrLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="feather-grad" x1="60" y1="5" x2="25" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24"/>
          <stop offset="50%" stopColor="#f97316"/>
          <stop offset="100%" stopColor="#ea580c"/>
        </linearGradient>
      </defs>
      <path d="M62 8 C72 15, 75 30, 68 45 C62 58, 48 68, 35 78 C40 60, 45 42, 42 28 C50 35, 55 50, 48 65"
        fill="url(#feather-grad)" stroke="none"/>
      <path d="M35 78 C38 70, 42 58, 42 28 C38 35, 35 52, 32 72 Z"
        fill="#ea580c" opacity="0.4"/>
      <path d="M35 78 L30 88 L38 82 Z" fill="#ea580c"/>
      <ellipse cx="34" cy="90" rx="12" ry="5" fill="#1c1c1c"/>
      <ellipse cx="34" cy="88" rx="9" ry="3.5" fill="#333"/>
    </svg>
  );
}

export default function Index() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Sora:wght@700;800&display=swap');
        .sora { font-family: 'Sora', system-ui, sans-serif; }
        * { -webkit-font-smoothing: antialiased; }
      `}</style>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <QuillrLogo size={30} />
          <span className="sora text-lg font-bold tracking-tight text-gray-900">Quillr</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="#como-funciona" className="text-sm text-gray-500 hover:text-gray-800 transition-colors hidden sm:block">
            Como funciona
          </a>
          <a href="#precos" className="text-sm text-gray-500 hover:text-gray-800 transition-colors hidden sm:block">
            Preços
          </a>
          <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
            Entrar
          </Link>
          <Link to="/dashboard"
            className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-all">
            Começar grátis
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-24 text-center">
        <motion.div {...fade(0)}>
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 px-3.5 py-1.5 rounded-full mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            Editor de PDF com Inteligência Artificial
          </span>
        </motion.div>

        <motion.h1 {...fade(0.07)}
          className="sora text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
          Edite qualquer PDF<br />
          <span className="text-orange-500">em segundos.</span>
        </motion.h1>

        <motion.p {...fade(0.14)}
          className="mt-6 text-lg text-gray-400 leading-relaxed max-w-lg mx-auto">
          Textos, assinaturas, apagar conteúdo — tudo direto no navegador,
          sem instalar nada. Simples assim.
        </motion.p>

        <motion.div {...fade(0.21)} className="mt-10 flex items-center justify-center gap-3 flex-wrap">
          <Link to="/dashboard"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold px-7 py-3.5 rounded-full transition-all shadow-sm hover:shadow-lg hover:shadow-orange-100">
            Criar conta grátis
            <ArrowRight size={15} />
          </Link>
          <Link to="/dashboard"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium px-6 py-3.5 rounded-full border border-gray-200 hover:border-gray-300 transition-all text-sm">
            Já tenho conta
          </Link>
        </motion.div>

        <motion.p {...fade(0.28)} className="mt-5 text-xs text-gray-400">
          Sem cartão de crédito · 3 documentos gratuitos por semana
        </motion.p>
      </section>

      {/* ── Before / After ──────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45 }}
            className="sora text-3xl font-bold text-gray-900">
            Veja o que você pode fazer
          </motion.h2>
          <p className="mt-2 text-gray-400 text-sm">Edite nomes, datas, assinaturas e muito mais</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm"
        >
          <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-end">
            <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-2 py-1 rounded-md">Antes & Depois</span>
          </div>

          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="p-8">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Antes</p>
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <img src={ft1} alt="PDF antes da edição" className="w-full object-cover" />
              </div>
            </div>
            <div className="p-8">
              <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-4">Depois ✨</p>
              <div className="rounded-2xl overflow-hidden border border-orange-200 shadow-sm">
                <img src={ft2} alt="PDF depois da edição" className="w-full object-cover" />
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-green-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Editado em segundos com Quillr
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="p-6 rounded-2xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all group cursor-default"
            >
              <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-4 group-hover:border-orange-100 group-hover:bg-orange-50 transition-colors">
                <f.icon size={17} className="text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{f.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Como funciona ───────────────────────────────────────────────── */}
      <section id="como-funciona" className="max-w-5xl mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-gray-950 px-10 py-14 flex flex-col md:flex-row items-start justify-between gap-10">
          <div className="md:max-w-xs">
            <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-4">
              Como funciona
            </p>
            <h2 className="sora text-3xl font-bold text-white leading-snug">
              Três passos.<br />Resultado<br />profissional.
            </h2>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">
              Sem curva de aprendizado. Se você sabe usar o computador, você sabe usar o Quillr.
            </p>
          </div>
          <div className="flex flex-col gap-6 md:max-w-xs w-full">
            {[
              { n: "01", t: "Faça upload do PDF",   d: "Arraste ou selecione seu arquivo." },
              { n: "02", t: "Edite o que precisar", d: "Textos, assinaturas ou apagar áreas." },
              { n: "03", t: "Baixe o resultado",    d: "PDF editado pronto em segundos." },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-4">
                <span className="sora text-xs font-bold text-orange-500 mt-0.5 w-6 flex-shrink-0">{s.n}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{s.t}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────── */}
      <section id="precos" className="max-w-5xl mx-auto px-6 pb-28">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45 }}
            className="sora text-4xl font-bold text-gray-900">
            Preço direto ao ponto
          </motion.h2>
          <p className="mt-3 text-gray-400 text-sm">Sem taxas escondidas. Cancele quando quiser.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={`relative p-8 rounded-2xl border transition-all flex flex-col ${
                plan.highlight
                  ? "border-orange-300 bg-orange-50 shadow-md shadow-orange-100"
                  : "border-gray-100 bg-gray-50/50"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                  Mais popular
                </span>
              )}
              <p className="text-sm font-semibold text-gray-500">{plan.name}</p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="sora text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-400 text-sm">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-2.5 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <Check size={13} className="text-orange-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to={plan.link}
                className={`mt-8 block text-center text-sm font-semibold py-3 rounded-full transition-all ${
                  plan.highlight
                    ? "bg-orange-500 text-white hover:bg-orange-600 shadow-sm"
                    : "bg-gray-900 text-white hover:bg-gray-700"
                }`}>
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <QuillrLogo size={22} />
            <span className="sora text-sm font-bold text-gray-900">Quillr</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 Quillr. Todos os direitos reservados.</p>
          <div className="flex gap-5">
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Privacidade</a>
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Termos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
