import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Eraser, PenTool, Sparkles, ChevronDown, Shield, Zap, Globe, CheckCircle } from "lucide-react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@700;800&display=swap');

  .q { font-family: 'Inter', system-ui, sans-serif; color: #111; background: #fff; -webkit-font-smoothing: antialiased; }
  .q-sora { font-family: 'Sora', system-ui, sans-serif; }

  .q-nav { max-width: 1100px; margin: 0 auto; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f0f0f0; position: sticky; top: 0; background: #fff; z-index: 50; }
  .q-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
  .q-logo-text { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 800; color: #111; }
  .q-nav-links { display: flex; align-items: center; gap: 28px; }
  .q-nav-link { font-size: 14px; color: #666; text-decoration: none; transition: color .2s; }
  .q-nav-link:hover { color: #111; }
  .q-btn-enter { background: #111; color: #fff; font-size: 14px; font-weight: 600; padding: 9px 22px; border-radius: 999px; text-decoration: none; transition: background .2s; }
  .q-btn-enter:hover { background: #333; }

  .q-hero { max-width: 900px; margin: 0 auto; padding: 80px 24px 72px; text-align: center; }
  .q-badge { display: inline-block; background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 999px; margin-bottom: 28px; }
  .q-h1 { font-family: 'Sora', sans-serif; font-size: clamp(38px, 6vw, 68px); font-weight: 800; line-height: 1.08; color: #111; margin: 0 0 24px; }
  .q-h1 span { color: #f97316; }
  .q-hero-p { font-size: clamp(16px, 2vw, 20px); color: #555; line-height: 1.75; max-width: 620px; margin: 0 auto 40px; }
  .q-btn-main { display: inline-block; background: #f97316; color: #fff; font-size: 18px; font-weight: 700; padding: 18px 48px; border-radius: 999px; text-decoration: none; transition: all .2s; box-shadow: 0 8px 32px rgba(249,115,22,.3); }
  .q-btn-main:hover { background: #ea580c; transform: translateY(-2px); box-shadow: 0 12px 40px rgba(249,115,22,.35); }
  .q-hero-sub { margin-top: 18px; font-size: 13px; color: #aaa; }

  .q-stats { background: #fff7ed; padding: 44px 24px; }
  .q-stats-inner { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 24px; text-align: center; }
  .q-stat-num { font-family: 'Sora', sans-serif; font-size: 38px; font-weight: 800; color: #f97316; line-height: 1; }
  .q-stat-label { font-size: 13px; color: #888; margin-top: 6px; }

  .q-section { padding: 80px 24px; }
  .q-section-alt { background: #fafafa; }
  .q-container { max-width: 1060px; margin: 0 auto; }
  .q-section-title { font-family: 'Sora', sans-serif; font-size: clamp(26px, 4vw, 38px); font-weight: 800; color: #111; text-align: center; margin: 0 0 12px; }
  .q-section-sub { font-size: 16px; color: #888; text-align: center; margin: 0 0 56px; line-height: 1.6; }

  .q-features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
  .q-feature-card { background: #fff; border: 1px solid #f0f0f0; border-radius: 20px; padding: 28px; transition: all .2s; }
  .q-feature-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,.07); border-color: #fed7aa; transform: translateY(-2px); }
  .q-feature-icon { width: 48px; height: 48px; background: #fff7ed; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; color: #f97316; }
  .q-feature-title { font-size: 15px; font-weight: 700; color: #111; margin: 0 0 10px; }
  .q-feature-desc { font-size: 13px; color: #777; line-height: 1.65; margin: 0; }

  /* Blog posts */
  .q-blog-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 28px; }
  .q-blog-card { background: #fff; border: 1px solid #f0f0f0; border-radius: 20px; overflow: hidden; transition: all .2s; cursor: pointer; }
  .q-blog-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,.09); transform: translateY(-3px); }
  .q-blog-img { width: 100%; height: 200px; object-fit: cover; display: block; }
  .q-blog-body { padding: 24px; }
  .q-blog-tag { display: inline-block; background: #fff7ed; color: #c2410c; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: .05em; }
  .q-blog-title { font-size: 16px; font-weight: 700; color: #111; margin: 0 0 10px; line-height: 1.4; }
  .q-blog-desc { font-size: 13px; color: #777; line-height: 1.65; margin: 0 0 16px; }
  .q-blog-meta { font-size: 12px; color: #bbb; }
  .q-blog-read { font-size: 13px; color: #f97316; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; margin-top: 12px; }

  /* Como funciona */
  .q-how-box { background: #0f172a; border-radius: 28px; padding: 60px 52px; display: flex; flex-wrap: wrap; gap: 56px; justify-content: space-between; align-items: flex-start; }
  .q-how-left { max-width: 340px; }
  .q-how-tag { font-size: 11px; font-weight: 700; color: #fb923c; text-transform: uppercase; letter-spacing: .12em; margin-bottom: 16px; }
  .q-how-title { font-family: 'Sora', sans-serif; font-size: 32px; font-weight: 800; color: #fff; line-height: 1.2; margin: 0 0 16px; }
  .q-how-desc { font-size: 14px; color: #94a3b8; line-height: 1.75; margin: 0 0 32px; }
  .q-btn-how { display: inline-block; background: #f97316; color: #fff; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 999px; text-decoration: none; transition: background .2s; }
  .q-btn-how:hover { background: #ea580c; }
  .q-how-steps { display: flex; flex-direction: column; gap: 32px; max-width: 360px; }
  .q-step { display: flex; gap: 18px; align-items: flex-start; }
  .q-step-num { font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 800; color: #f97316; width: 28px; flex-shrink: 0; padding-top: 2px; }
  .q-step-title { font-size: 15px; font-weight: 700; color: #fff; margin: 0 0 6px; }
  .q-step-desc { font-size: 13px; color: #64748b; line-height: 1.65; margin: 0; }

  /* Imagem + texto */
  .q-imgtext { display: flex; flex-wrap: wrap; gap: 56px; align-items: center; }
  .q-imgtext-img { flex: 1 1 340px; border-radius: 20px; overflow: hidden; box-shadow: 0 16px 48px rgba(0,0,0,.1); }
  .q-imgtext-img img { width: 100%; height: 320px; object-fit: cover; display: block; }
  .q-imgtext-content { flex: 1 1 300px; }
  .q-imgtext-tag { font-size: 12px; font-weight: 700; color: #f97316; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 12px; }
  .q-imgtext-title { font-family: 'Sora', sans-serif; font-size: clamp(22px, 3vw, 30px); font-weight: 800; color: #111; margin: 0 0 16px; line-height: 1.25; }
  .q-imgtext-desc { font-size: 15px; color: #666; line-height: 1.75; margin: 0 0 24px; }
  .q-check-list { list-style: none; padding: 0; margin: 0 0 28px; display: flex; flex-direction: column; gap: 10px; }
  .q-check-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #444; line-height: 1.5; }
  .q-btn-secondary { display: inline-block; background: #111; color: #fff; font-size: 14px; font-weight: 600; padding: 12px 28px; border-radius: 999px; text-decoration: none; transition: background .2s; }
  .q-btn-secondary:hover { background: #333; }

  /* Trust */
  .q-trust { background: #f0fdf4; padding: 64px 24px; }
  .q-trust-inner { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 28px; }
  .q-trust-item { display: flex; align-items: flex-start; gap: 16px; }
  .q-trust-icon { width: 44px; height: 44px; background: #dcfce7; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #16a34a; }
  .q-trust-title { font-size: 14px; font-weight: 700; color: #111; margin: 0 0 5px; }
  .q-trust-desc { font-size: 13px; color: #666; line-height: 1.55; margin: 0; }

  /* FAQ */
  .q-faq-wrap { max-width: 760px; margin: 0 auto; }
  .q-faq details { border: 1px solid #efefef; border-radius: 16px; background: #fff; overflow: hidden; margin-bottom: 10px; }
  .q-faq summary { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; font-size: 15px; font-weight: 600; color: #111; cursor: pointer; list-style: none; gap: 16px; }
  .q-faq summary::-webkit-details-marker { display: none; }
  .q-faq-answer { padding: 0 24px 20px; font-size: 14px; color: #666; line-height: 1.75; }
  .q-chevron { flex-shrink: 0; transition: transform .25s; color: #bbb; }
  .q-faq details[open] .q-chevron { transform: rotate(180deg); }

  /* CTA */
  .q-cta { background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 96px 24px; text-align: center; }
  .q-cta-title { font-family: 'Sora', sans-serif; font-size: clamp(30px, 5vw, 52px); font-weight: 800; color: #fff; margin: 0 0 18px; }
  .q-cta-sub { font-size: 18px; color: rgba(255,255,255,.82); margin: 0 0 40px; }
  .q-btn-cta { display: inline-block; background: #fff; color: #f97316; font-size: 18px; font-weight: 700; padding: 18px 48px; border-radius: 999px; text-decoration: none; transition: all .2s; box-shadow: 0 8px 32px rgba(0,0,0,.18); }
  .q-btn-cta:hover { background: #fff7ed; transform: translateY(-2px); }

  .q-footer { border-top: 1px solid #f0f0f0; padding: 44px 24px; }
  .q-footer-inner { max-width: 1000px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; }
  .q-footer-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
  .q-footer-logo-text { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 800; color: #111; }
  .q-footer-copy { font-size: 12px; color: #bbb; }
  .q-footer-links { display: flex; gap: 20px; }
  .q-footer-link { font-size: 12px; color: #bbb; text-decoration: none; }
  .q-footer-link:hover { color: #666; }

  @media (max-width: 640px) {
    .q-nav-links a:not(.q-btn-enter) { display: none; }
    .q-how-box { padding: 36px 24px; }
    .q-how-left { max-width: 100%; }
    .q-imgtext { gap: 32px; }
  }
`;

function QuillrLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="fg2" x1="60" y1="5" x2="25" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24"/>
          <stop offset="50%" stopColor="#f97316"/>
          <stop offset="100%" stopColor="#ea580c"/>
        </linearGradient>
      </defs>
      <path d="M62 8 C72 15, 75 30, 68 45 C62 58, 48 68, 35 78 C40 60, 45 42, 42 28 C50 35, 55 50, 48 65" fill="url(#fg2)"/>
      <path d="M35 78 C38 70, 42 58, 42 28 C38 35, 35 52, 32 72 Z" fill="#ea580c" opacity="0.4"/>
      <path d="M35 78 L30 88 L38 82 Z" fill="#ea580c"/>
      <ellipse cx="34" cy="90" rx="12" ry="5" fill="#1c1c1c"/>
      <ellipse cx="34" cy="88" rx="9" ry="3.5" fill="#333"/>
    </svg>
  );
}

const FEATURES = [
  { icon: FileText, title: "Editar texto em PDF", desc: "Clique em qualquer texto do PDF e edite na hora, mantendo fonte, tamanho e cor originais do documento." },
  { icon: Eraser,   title: "Apagar conteudo",    desc: "Remove textos, imagens, carimbos e assinaturas de qualquer area sem deixar rastro visivel." },
  { icon: PenTool,  title: "Assinatura digital", desc: "Insira sua assinatura em contratos e formularios arrastando para qualquer posicao da pagina." },
  { icon: Sparkles, title: "IA integrada",       desc: "Inteligencia artificial identifica fontes, cores e posicionamento para manter o layout original." },
];

const BLOG_POSTS = [
  {
    img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
    tag: "Tutorial",
    title: "Como editar um PDF online sem instalar nenhum programa",
    desc: "Guia completo e atualizado para editar qualquer tipo de PDF diretamente no navegador, sem precisar baixar o Adobe Acrobat ou qualquer outro software pago.",
    time: "4 min de leitura",
  },
  {
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    tag: "Assinatura",
    title: "Como assinar documentos PDF digitalmente de forma gratuita",
    desc: "Aprenda a inserir assinaturas digitais validas em contratos, propostas comerciais e documentos oficiais sem precisar imprimir nem escanear nada.",
    time: "5 min de leitura",
  },
  {
    img: "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&q=80",
    tag: "Dica",
    title: "Como remover texto ou imagem de um PDF sem deixar rastro",
    desc: "Passo a passo detalhado para apagar palavras, frases, carimbos e imagens de qualquer PDF, mantendo o layout e a formatacao original do documento.",
    time: "3 min de leitura",
  },
];

const STEPS = [
  { n: "01", t: "Faca upload do PDF",   d: "Arraste ou selecione o arquivo no seu computador ou celular. Suporta qualquer tipo de PDF." },
  { n: "02", t: "Edite o que precisar", d: "Altere textos, apague areas, adicione assinaturas ou insira novos conteudos com facilidade." },
  { n: "03", t: "Baixe o resultado",    d: "Clique em baixar e receba seu PDF editado imediatamente, pronto para enviar ou imprimir." },
];

const FAQS = [
  { q: "Como editar um PDF online de graca?",        a: "Abra o Quillr no navegador, faca o upload do seu PDF e clique no texto que deseja editar. Nao precisa criar conta nem instalar nada. O processo leva menos de 30 segundos." },
  { q: "E seguro editar PDF online no Quillr?",      a: "Sim. O Quillr processa os arquivos diretamente no servidor de forma segura e nao armazena seus documentos apos o download. Seus arquivos sao deletados automaticamente." },
  { q: "Posso assinar um PDF gratuitamente?",        a: "Sim. Insira sua assinatura em qualquer posicao do documento arrastando uma imagem PNG com fundo transparente ou posicionando manualmente onde quiser." },
  { q: "O Quillr funciona no celular?",              a: "Sim, funciona em qualquer navegador moderno incluindo Chrome e Safari no Android e iOS, sem instalar aplicativo nenhum." },
  { q: "Como apagar conteudo de um PDF?",            a: "Use a ferramenta de borracha, selecione a area que deseja remover e o conteudo e apagado sem deixar marcas ou residuos visiveis no documento final." },
  { q: "Preciso criar conta para usar o Quillr?",   a: "Nao. O Quillr e completamente gratuito e nao exige nenhum cadastro. Abra o site, edite seu PDF e baixe. Simples assim." },
  { q: "Qual o tamanho maximo de PDF aceito?",       a: "O Quillr aceita arquivos PDF de ate 100MB, o que cobre a grande maioria dos documentos do dia a dia, incluindo contratos longos e relatorios com imagens." },
  { q: "Posso editar um PDF escaneado?",             a: "Sim. O Quillr possui tecnologia OCR que reconhece textos em PDFs escaneados e permite editar o conteudo identificado pela inteligencia artificial." },
];

export default function Index() {
  return (
    <div className="q">
      <style>{CSS}</style>

      {/* Nav */}
      <nav className="q-nav">
        <a href="/" className="q-logo">
          <QuillrLogo size={28} />
          <span className="q-logo-text q-sora">Quillr</span>
        </a>
        <div className="q-nav-links">
          <a href="#como-funciona" className="q-nav-link">Como funciona</a>
          <a href="#blog" className="q-nav-link">Guias</a>
          <a href="#faq" className="q-nav-link">Duvidas</a>
          <Link to="/dashboard" className="q-btn-enter">Editar PDF</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="q-hero">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <span className="q-badge">Ferramenta gratuita — sem cadastro necessario</span>
          <h1 className="q-h1 q-sora">
            Editar PDF Online<br />
            <span>Gratis e Sem Cadastro</span>
          </h1>
          <p className="q-hero-p">
            Edite textos, remova conteudo, adicione assinaturas e salve qualquer PDF
            direto no navegador. Sem instalar software. Sem criar conta. 100% gratuito.
          </p>
          <Link to="/dashboard" className="q-btn-main">Editar meu PDF agora</Link>
          <p className="q-hero-sub">Mais de 10.000 documentos editados. Sem cartao de credito.</p>
        </motion.div>
      </section>

      {/* Stats */}
      <div className="q-stats">
        <div className="q-stats-inner">
          {[
            { num: "10.000+", label: "PDFs editados" },
            { num: "100%",    label: "Gratuito" },
            { num: "0",       label: "Cadastros necessarios" },
            { num: "30s",     label: "Para comecar a editar" },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }}>
              <div className="q-stat-num q-sora">{s.num}</div>
              <div className="q-stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="q-section q-section-alt">
        <div className="q-container">
          <h2 className="q-section-title q-sora">Tudo que voce precisa para editar PDF</h2>
          <p className="q-section-sub">Ferramentas profissionais com interface simples. Resultado imediato.</p>
          <div className="q-features-grid">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} className="q-feature-card"
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }}>
                <div className="q-feature-icon"><f.icon size={22} /></div>
                <p className="q-feature-title">{f.title}</p>
                <p className="q-feature-desc">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Imagem + texto — bloco 1 */}
      <section className="q-section">
        <div className="q-container">
          <div className="q-imgtext">
            <motion.div className="q-imgtext-img"
              initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55 }}>
              <img
                src="https://i0.wp.com/cursapt.wpcomstaging.com/wp-content/uploads/2025/05/pessoa-utilizando-o-libreoffice-impress-em-um-computador-criando-slides-modernos-em-um-ambiente-de-estudo-ou-escritorio-estilo-realista-e-profissional.jpg?fit=1536%2C1024&ssl=1"
                alt="Pessoa editando PDF online no computador"
              />
            </motion.div>
            <motion.div className="q-imgtext-content"
              initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55 }}>
              <p className="q-imgtext-tag">Edicao de texto</p>
              <h2 className="q-imgtext-title q-sora">Edite qualquer texto do PDF sem perder a formatacao</h2>
              <p className="q-imgtext-desc">
                Ao contrario de outras ferramentas que destroem o layout ao editar, o Quillr utiliza
                inteligencia artificial para identificar a fonte, tamanho e cor exatos de cada trecho de
                texto — garantindo que o documento editado fique identico ao original.
              </p>
              <ul className="q-check-list">
                {["Detecta a fonte automaticamente", "Preserva cor e tamanho do texto", "Funciona em PDFs complexos com colunas", "Resultado profissional em segundos"].map(item => (
                  <li key={item}><CheckCircle size={16} color="#f97316" style={{flexShrink:0, marginTop:2}} />{item}</li>
                ))}
              </ul>
              <Link to="/dashboard" className="q-btn-secondary">Testar agora</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Imagem + texto — bloco 2 (invertido) */}
      <section className="q-section q-section-alt">
        <div className="q-container">
          <div className="q-imgtext" style={{ flexDirection: "row-reverse" }}>
            <motion.div className="q-imgtext-img"
              initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55 }}>
              <img
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80"
                alt="Assinatura digital em contrato PDF online"
              />
            </motion.div>
            <motion.div className="q-imgtext-content"
              initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55 }}>
              <p className="q-imgtext-tag">Assinatura digital</p>
              <h2 className="q-imgtext-title q-sora">Assine contratos e documentos sem imprimir nada</h2>
              <p className="q-imgtext-desc">
                Chega de imprimir, assinar a mao e escanear. Com o Quillr voce insere sua assinatura
                digital em qualquer contrato, proposta ou documento oficial diretamente no navegador,
                em qualquer dispositivo.
              </p>
              <ul className="q-check-list">
                {["Arraste sua assinatura para qualquer posicao", "Suporta imagens PNG com fundo transparente", "Funciona em contratos, boletos e formularios", "Sem instalar app no celular"].map(item => (
                  <li key={item}><CheckCircle size={16} color="#f97316" style={{flexShrink:0, marginTop:2}} />{item}</li>
                ))}
              </ul>
              <Link to="/dashboard" className="q-btn-secondary">Assinar PDF agora</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="q-section">
        <div className="q-container">
          <div className="q-how-box">
            <div className="q-how-left">
              <p className="q-how-tag">Como funciona</p>
              <h2 className="q-how-title q-sora">Edite seu PDF em 3 passos simples</h2>
              <p className="q-how-desc">Nao precisa criar conta, nao precisa instalar nada. So abrir o navegador e comecar a editar.</p>
              <Link to="/dashboard" className="q-btn-how">Comecar agora</Link>
            </div>
            <div className="q-how-steps">
              {STEPS.map(s => (
                <div key={s.n} className="q-step">
                  <span className="q-step-num q-sora">{s.n}</span>
                  <div>
                    <p className="q-step-title">{s.t}</p>
                    <p className="q-step-desc">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="q-section q-section-alt">
        <div className="q-container">
          <h2 className="q-section-title q-sora">Guias e tutoriais sobre PDF</h2>
          <p className="q-section-sub">Aprenda a editar, assinar e gerenciar documentos PDF com facilidade</p>
          <div className="q-blog-grid">
            {BLOG_POSTS.map((post, i) => (
              <motion.div key={post.title} className="q-blog-card"
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.45 }}>
                <img src={post.img} alt={post.title} className="q-blog-img" />
                <div className="q-blog-body">
                  <span className="q-blog-tag">{post.tag}</span>
                  <p className="q-blog-title">{post.title}</p>
                  <p className="q-blog-desc">{post.desc}</p>
                  <p className="q-blog-meta">{post.time}</p>
                  <Link to="/dashboard" className="q-blog-read">Ler artigo completo →</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <div className="q-trust">
        <div className="q-trust-inner">
          {[
            { icon: Shield, title: "100% privado",      desc: "Seus arquivos nao sao armazenados permanentemente. Deletados automaticamente apos o download." },
            { icon: Zap,    title: "Rapido e gratuito", desc: "Sem cadastro, sem espera. Abra o site e comece a editar em menos de 30 segundos." },
            { icon: Globe,  title: "Funciona em tudo",  desc: "Windows, Mac, Linux, Android e iOS. Qualquer navegador moderno sem instalar nada." },
            { icon: FileText, title: "Qualquer PDF",    desc: "PDFs de texto, formularios, contratos, escaneados e com senha. Todos suportados." },
          ].map((t, i) => (
            <motion.div key={t.title} className="q-trust-item"
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }}>
              <div className="q-trust-icon"><t.icon size={20} /></div>
              <div>
                <p className="q-trust-title">{t.title}</p>
                <p className="q-trust-desc">{t.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <section id="faq" className="q-section">
        <div className="q-faq-wrap">
          <h2 className="q-section-title q-sora">Perguntas frequentes</h2>
          <p className="q-section-sub">Tudo que voce precisa saber sobre edicao de PDF online gratuita</p>
          <div className="q-faq" style={{ marginTop: 40 }}>
            {FAQS.map((f, i) => (
              <motion.details key={i}
                initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.4 }}>
                <summary>
                  {f.q}
                  <ChevronDown size={16} className="q-chevron" />
                </summary>
                <p className="q-faq-answer">{f.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="q-cta">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="q-cta-title q-sora">Pronto para editar seu PDF?</h2>
          <p className="q-cta-sub">Gratuito, sem cadastro, sem limite. Acesse agora e edite em segundos.</p>
          <Link to="/dashboard" className="q-btn-cta">Editar PDF gratis agora</Link>
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer className="q-footer">
        <div className="q-footer-inner">
          <a href="/" className="q-footer-logo">
            <QuillrLogo size={20} />
            <span className="q-footer-logo-text q-sora">Quillr</span>
          </a>
          <p className="q-footer-copy">© 2026 Quillr. Ferramenta gratuita de edicao de PDF online.</p>
          <div className="q-footer-links">
            <a href="#" className="q-footer-link">Privacidade</a>
            <a href="#" className="q-footer-link">Termos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
