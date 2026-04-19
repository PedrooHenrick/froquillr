import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Eraser, PenTool, Sparkles, ChevronDown, Shield, Zap, Globe } from "lucide-react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@700;800&display=swap');

  .q-wrap { font-family: 'Inter', system-ui, sans-serif; color: #111; background: #fff; -webkit-font-smoothing: antialiased; }
  .q-sora { font-family: 'Sora', system-ui, sans-serif; }

  /* Nav */
  .q-nav { max-width: 1100px; margin: 0 auto; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f0f0f0; }
  .q-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
  .q-logo-text { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 800; color: #111; }
  .q-nav-links { display: flex; align-items: center; gap: 28px; }
  .q-nav-link { font-size: 14px; color: #666; text-decoration: none; transition: color .2s; }
  .q-nav-link:hover { color: #111; }
  .q-btn-enter { background: #111; color: #fff; font-size: 14px; font-weight: 600; padding: 9px 22px; border-radius: 999px; text-decoration: none; transition: background .2s; }
  .q-btn-enter:hover { background: #333; }

  /* Hero */
  .q-hero { max-width: 860px; margin: 0 auto; padding: 80px 24px 64px; text-align: center; }
  .q-badge { display: inline-block; background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 999px; margin-bottom: 28px; }
  .q-h1 { font-family: 'Sora', sans-serif; font-size: clamp(36px, 6vw, 64px); font-weight: 800; line-height: 1.1; color: #111; margin: 0 0 20px; }
  .q-h1 span { color: #f97316; }
  .q-hero-p { font-size: clamp(16px, 2vw, 20px); color: #666; line-height: 1.7; max-width: 600px; margin: 0 auto 36px; }
  .q-btn-main { display: inline-block; background: #f97316; color: #fff; font-size: 17px; font-weight: 700; padding: 16px 40px; border-radius: 999px; text-decoration: none; transition: background .2s, box-shadow .2s; box-shadow: 0 8px 24px rgba(249,115,22,.25); }
  .q-btn-main:hover { background: #ea580c; box-shadow: 0 12px 32px rgba(249,115,22,.3); }
  .q-hero-sub { margin-top: 16px; font-size: 13px; color: #999; }

  /* Ad slot */
  .q-ad { max-width: 900px; margin: 0 auto; padding: 0 24px 48px; }
  .q-ad-slot { background: #fafafa; border: 1.5px dashed #e5e7eb; border-radius: 12px; height: 100px; display: flex; align-items: center; justify-content: center; color: #bbb; font-size: 12px; }

  /* Stats */
  .q-stats { background: #fff7ed; padding: 40px 24px; }
  .q-stats-inner { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 24px; text-align: center; }
  .q-stat-num { font-family: 'Sora', sans-serif; font-size: 36px; font-weight: 800; color: #f97316; }
  .q-stat-label { font-size: 13px; color: #888; margin-top: 4px; }

  /* Features */
  .q-features { background: #fafafa; padding: 72px 24px; }
  .q-section-title { font-family: 'Sora', sans-serif; font-size: clamp(24px, 4vw, 36px); font-weight: 800; color: #111; text-align: center; margin: 0 0 12px; }
  .q-section-sub { font-size: 15px; color: #888; text-align: center; margin: 0 0 48px; }
  .q-features-grid { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 20px; }
  .q-feature-card { background: #fff; border: 1px solid #f0f0f0; border-radius: 20px; padding: 28px; transition: box-shadow .2s, border-color .2s; }
  .q-feature-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,.07); border-color: #fed7aa; }
  .q-feature-icon { width: 44px; height: 44px; background: #fff7ed; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; color: #f97316; }
  .q-feature-title { font-size: 14px; font-weight: 700; color: #111; margin: 0 0 8px; }
  .q-feature-desc { font-size: 13px; color: #888; line-height: 1.6; margin: 0; }

  /* Como funciona */
  .q-how { max-width: 1000px; margin: 0 auto; padding: 72px 24px; }
  .q-how-box { background: #0f172a; border-radius: 28px; padding: 56px 48px; display: flex; flex-wrap: wrap; gap: 48px; justify-content: space-between; align-items: flex-start; }
  .q-how-left { max-width: 320px; }
  .q-how-tag { font-size: 11px; font-weight: 700; color: #fb923c; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 16px; }
  .q-how-title { font-family: 'Sora', sans-serif; font-size: 30px; font-weight: 800; color: #fff; line-height: 1.25; margin: 0 0 16px; }
  .q-how-desc { font-size: 14px; color: #94a3b8; line-height: 1.7; margin: 0 0 28px; }
  .q-btn-how { display: inline-block; background: #f97316; color: #fff; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 999px; text-decoration: none; transition: background .2s; }
  .q-btn-how:hover { background: #ea580c; }
  .q-how-steps { display: flex; flex-direction: column; gap: 28px; max-width: 340px; }
  .q-step { display: flex; gap: 16px; align-items: flex-start; }
  .q-step-num { font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 800; color: #f97316; width: 28px; flex-shrink: 0; padding-top: 2px; }
  .q-step-title { font-size: 14px; font-weight: 700; color: #fff; margin: 0 0 4px; }
  .q-step-desc { font-size: 13px; color: #64748b; line-height: 1.6; margin: 0; }

  /* Artigos */
  .q-articles { background: #fafafa; padding: 72px 24px; }
  .q-articles-grid { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
  .q-article-card { background: #fff; border: 1px solid #f0f0f0; border-radius: 20px; padding: 24px; cursor: pointer; transition: box-shadow .2s, border-color .2s; }
  .q-article-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,.07); border-color: #fed7aa; }
  .q-article-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .q-article-meta span { font-size: 12px; color: #bbb; }
  .q-article-title { font-size: 14px; font-weight: 700; color: #111; margin: 0 0 8px; line-height: 1.4; }
  .q-article-desc { font-size: 12px; color: #888; line-height: 1.6; margin: 0; }

  /* FAQ */
  .q-faq { max-width: 760px; margin: 0 auto; padding: 72px 24px; }
  .q-faq details { border: 1px solid #f0f0f0; border-radius: 16px; background: #fff; overflow: hidden; margin-bottom: 10px; }
  .q-faq summary { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; font-size: 14px; font-weight: 600; color: #111; cursor: pointer; list-style: none; gap: 16px; }
  .q-faq summary::-webkit-details-marker { display: none; }
  .q-faq-answer { padding: 0 24px 18px; font-size: 13px; color: #666; line-height: 1.7; }
  .q-chevron { flex-shrink: 0; transition: transform .2s; color: #bbb; }
  .q-faq details[open] .q-chevron { transform: rotate(180deg); }

  /* Confianca */
  .q-trust { background: #f0fdf4; padding: 56px 24px; }
  .q-trust-inner { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; }
  .q-trust-item { display: flex; align-items: flex-start; gap: 14px; }
  .q-trust-icon { width: 40px; height: 40px; background: #dcfce7; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #16a34a; }
  .q-trust-title { font-size: 14px; font-weight: 700; color: #111; margin: 0 0 4px; }
  .q-trust-desc { font-size: 12px; color: #666; line-height: 1.5; margin: 0; }

  /* CTA */
  .q-cta { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 80px 24px; text-align: center; }
  .q-cta-title { font-family: 'Sora', sans-serif; font-size: clamp(28px, 5vw, 48px); font-weight: 800; color: #fff; margin: 0 0 16px; }
  .q-cta-sub { font-size: 18px; color: rgba(255,255,255,.8); margin: 0 0 36px; }
  .q-btn-cta { display: inline-block; background: #fff; color: #f97316; font-size: 17px; font-weight: 700; padding: 16px 40px; border-radius: 999px; text-decoration: none; transition: background .2s, transform .2s; box-shadow: 0 8px 32px rgba(0,0,0,.15); }
  .q-btn-cta:hover { background: #fff7ed; transform: translateY(-2px); }

  /* Footer */
  .q-footer { border-top: 1px solid #f0f0f0; padding: 40px 24px; }
  .q-footer-inner { max-width: 1000px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; }
  .q-footer-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
  .q-footer-logo-text { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 800; color: #111; }
  .q-footer-copy { font-size: 12px; color: #bbb; }
  .q-footer-links { display: flex; gap: 20px; }
  .q-footer-link { font-size: 12px; color: #bbb; text-decoration: none; transition: color .2s; }
  .q-footer-link:hover { color: #666; }

  @media (max-width: 640px) {
    .q-nav-links a:not(.q-btn-enter) { display: none; }
    .q-how-box { padding: 36px 24px; }
    .q-how-left { max-width: 100%; }
  }
`;

function QuillrLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="fg" x1="60" y1="5" x2="25" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24"/>
          <stop offset="50%" stopColor="#f97316"/>
          <stop offset="100%" stopColor="#ea580c"/>
        </linearGradient>
      </defs>
      <path d="M62 8 C72 15, 75 30, 68 45 C62 58, 48 68, 35 78 C40 60, 45 42, 42 28 C50 35, 55 50, 48 65" fill="url(#fg)"/>
      <path d="M35 78 C38 70, 42 58, 42 28 C38 35, 35 52, 32 72 Z" fill="#ea580c" opacity="0.4"/>
      <path d="M35 78 L30 88 L38 82 Z" fill="#ea580c"/>
      <ellipse cx="34" cy="90" rx="12" ry="5" fill="#1c1c1c"/>
      <ellipse cx="34" cy="88" rx="9" ry="3.5" fill="#333"/>
    </svg>
  );
}

const FEATURES = [
  { icon: FileText, title: "Editar texto em PDF", desc: "Clique em qualquer texto do PDF e edite na hora, mantendo fonte, tamanho e cor originais." },
  { icon: Eraser,   title: "Apagar conteudo",    desc: "Remove textos, imagens e carimbos de qualquer area sem deixar rastro." },
  { icon: PenTool,  title: "Assinatura digital", desc: "Insira sua assinatura em contratos e formularios arrastando para qualquer posicao." },
  { icon: Sparkles, title: "IA integrada",       desc: "Inteligencia artificial identifica fontes e cores para manter o visual original." },
];

const STEPS = [
  { n: "01", t: "Faca upload do PDF",   d: "Arraste ou selecione o arquivo. Suporta qualquer tipo de PDF, de qualquer tamanho." },
  { n: "02", t: "Edite o que precisar", d: "Altere textos, apague areas, adicione assinaturas com poucos cliques." },
  { n: "03", t: "Baixe o PDF editado", d: "Clique em baixar e receba seu arquivo editado imediatamente." },
];

const ARTICLES = [
  { title: "Como editar PDF sem instalar software", desc: "Guia completo para editar qualquer PDF direto no navegador, sem baixar programas pagos.", time: "3 min" },
  { title: "Como assinar documentos PDF digitalmente", desc: "Aprenda a inserir assinaturas digitais validas em contratos e documentos oficiais.", time: "4 min" },
  { title: "Como remover texto de um PDF", desc: "Passo a passo para apagar palavras, frases ou blocos inteiros de qualquer PDF.", time: "2 min" },
  { title: "Diferenca entre PDF editavel e PDF escaneado", desc: "Entenda os tipos de PDF e como editar cada um com as ferramentas certas.", time: "5 min" },
];

const FAQS = [
  { q: "Como editar um PDF online de graca?",       a: "Abra o Quillr no navegador, faca o upload do seu PDF e clique no texto que deseja editar. Nao precisa criar conta nem instalar nada." },
  { q: "E seguro editar PDF online?",               a: "Sim. O Quillr processa tudo localmente no seu navegador. Seus arquivos nao ficam salvos em nenhum servidor." },
  { q: "Posso assinar um PDF online gratuitamente?", a: "Sim. Insira sua assinatura em qualquer posicao do documento arrastando uma imagem ou posicionando manualmente." },
  { q: "O Quillr funciona no celular?",             a: "Sim, funciona em qualquer navegador moderno incluindo Chrome e Safari no celular, sem instalar aplicativo." },
  { q: "Como remover conteudo de um PDF?",          a: "Use a ferramenta de apagar, selecione a area desejada e o conteudo e removido sem deixar marcas." },
  { q: "Preciso criar conta para usar?",            a: "Nao. O Quillr e totalmente gratuito e nao exige cadastro. Abra, edite e baixe sem criar conta." },
];

export default function Index() {
  return (
    <div className="q-wrap">
      <style>{CSS}</style>

      {/* Nav */}
      <nav className="q-nav">
        <a href="/" className="q-logo">
          <QuillrLogo size={28} />
          <span className="q-logo-text">Quillr</span>
        </a>
        <div className="q-nav-links">
          <a href="#como-funciona" className="q-nav-link">Como funciona</a>
          <a href="#faq" className="q-nav-link">Duvidas</a>
          <Link to="/dashboard" className="q-btn-enter">Entrar</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="q-hero">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="q-badge">Ferramenta gratuita de edicao de PDF online</span>
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

      {/* Ad topo */}
      <div className="q-ad">
        <div className="q-ad-slot">Espaco para anuncio — Google AdSense</div>
      </div>

      {/* Stats */}
      <div className="q-stats">
        <div className="q-stats-inner">
          {[
            { num: "10.000+", label: "PDFs editados" },
            { num: "100%",    label: "Gratuito" },
            { num: "0",       label: "Cadastros necessarios" },
            { num: "3s",      label: "Para comecar a editar" },
          ].map(s => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <div className="q-stat-num q-sora">{s.num}</div>
              <div className="q-stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="q-features">
        <h2 className="q-section-title q-sora">Tudo que voce precisa para editar PDF</h2>
        <p className="q-section-sub">Ferramentas profissionais, interface simples, resultado imediato</p>
        <div className="q-features-grid">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} className="q-feature-card"
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }}>
              <div className="q-feature-icon"><f.icon size={20} /></div>
              <p className="q-feature-title">{f.title}</p>
              <p className="q-feature-desc">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ad meio */}
      <div className="q-ad" style={{ paddingTop: 48 }}>
        <div className="q-ad-slot">Espaco para anuncio — Google AdSense</div>
      </div>

      {/* Como funciona */}
      <section id="como-funciona" className="q-how">
        <div className="q-how-box">
          <div className="q-how-left">
            <p className="q-how-tag">Como funciona</p>
            <h2 className="q-how-title q-sora">Edite seu PDF em 3 passos simples</h2>
            <p className="q-how-desc">Nao precisa criar conta, nao precisa instalar nada. So abrir o navegador e comecar.</p>
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
      </section>

      {/* Confianca */}
      <div className="q-trust">
        <div className="q-trust-inner">
          {[
            { icon: Shield, title: "100% privado",       desc: "Seus arquivos nao sao armazenados em nenhum servidor. Tudo fica no seu navegador." },
            { icon: Zap,    title: "Rapido e gratuito",  desc: "Sem cadastro, sem espera. Abra o site e comece a editar em segundos." },
            { icon: Globe,  title: "Funciona em tudo",   desc: "Windows, Mac, Linux, Android, iOS. Qualquer navegador moderno." },
            { icon: FileText, title: "Qualquer PDF",     desc: "PDFs de texto, formularios, contratos, escaneados. Todos funcionam." },
          ].map((t, i) => (
            <motion.div key={t.title} className="q-trust-item"
              initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.4 }}>
              <div className="q-trust-icon"><t.icon size={18} /></div>
              <div>
                <p className="q-trust-title">{t.title}</p>
                <p className="q-trust-desc">{t.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Artigos SEO */}
      <section className="q-articles">
        <h2 className="q-section-title q-sora">Guias sobre edicao de PDF</h2>
        <p className="q-section-sub">Tutoriais para voce editar qualquer tipo de documento</p>
        <div className="q-articles-grid">
          {ARTICLES.map((a, i) => (
            <motion.div key={a.title} className="q-article-card"
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.4 }}>
              <div className="q-article-meta">
                <FileText size={13} color="#f97316" />
                <span>{a.time} de leitura</span>
              </div>
              <p className="q-article-title">{a.title}</p>
              <p className="q-article-desc">{a.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ad antes FAQ */}
      <div className="q-ad" style={{ paddingTop: 48 }}>
        <div className="q-ad-slot">Espaco para anuncio — Google AdSense</div>
      </div>

      {/* FAQ */}
      <section id="faq" className="q-faq">
        <h2 className="q-section-title q-sora">Perguntas frequentes</h2>
        <p className="q-section-sub">Tudo que voce precisa saber sobre edicao de PDF online</p>
        <div style={{ marginTop: 40 }}>
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
      </section>

      {/* CTA final */}
      <section className="q-cta">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
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
            <span className="q-footer-logo-text">Quillr</span>
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
