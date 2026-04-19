import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Eraser, PenTool, Sparkles, ChevronDown } from "lucide-react";

import ft1 from "/ft1.png";
import ft2 from "/ft2.png";

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

const FAQS = [
  { q: "Como editar um PDF online gratuitamente?", a: "Com o Quillr você abre seu PDF no navegador, clica no texto que deseja alterar e edita na hora. Sem instalar nenhum software. Totalmente gratuito." },
  { q: "É possível assinar um PDF online?", a: "Sim. O Quillr permite inserir sua assinatura digital em qualquer posição do documento, seja arrastando uma imagem ou desenhando diretamente na página." },
  { q: "Como remover texto ou imagem de um PDF?", a: "Use a ferramenta de apagar do Quillr. Selecione a área que deseja remover e o conteúdo é eliminado sem deixar rastro, mantendo o layout original." },
  { q: "O Quillr funciona no celular?", a: "Sim, o Quillr funciona em qualquer navegador moderno, incluindo Chrome e Safari no celular, sem precisar instalar aplicativo." },
  { q: "Meus documentos ficam salvos na nuvem?", a: "Não. O Quillr processa tudo localmente no seu navegador. Seus arquivos não são armazenados em nenhum servidor, garantindo total privacidade." },
  { q: "Como converter PDF para Word?", a: "No Quillr você edita o PDF diretamente, sem precisar converter para Word. Mais rápido e sem perder a formatação original do documento." },
];

const FEATURES = [
  { icon: FileText, title: "Edição de texto em PDF", desc: "Clique em qualquer parágrafo, título ou campo e edite o conteúdo mantendo a fonte, tamanho e cor originais do documento." },
  { icon: Eraser,   title: "Apagar conteúdo",        desc: "Remove textos, imagens, assinaturas e carimbos de qualquer área do PDF sem deixar marcas ou resíduos visíveis." },
  { icon: PenTool,  title: "Assinatura digital",      desc: "Insira sua assinatura em contratos, formulários e documentos oficiais arrastando uma imagem ou posicionando onde quiser." },
  { icon: Sparkles, title: "Inteligencia Artificial", desc: "A IA do Quillr identifica automaticamente fontes, cores e posicionamento de texto para manter o visual original do PDF." },
];

const ARTICLES = [
  {
    title: "Como editar PDF sem instalar software",
    desc: "Guia completo para editar qualquer tipo de PDF direto no navegador, sem baixar programas pagos como Adobe Acrobat.",
    time: "3 min de leitura",
  },
  {
    title: "Como assinar documentos PDF digitalmente",
    desc: "Aprenda a inserir assinaturas digitais validas em contratos, propostas e documentos oficiais de forma simples e gratuita.",
    time: "4 min de leitura",
  },
  {
    title: "Como remover texto de um PDF",
    desc: "Passo a passo para apagar palavras, frases ou blocos inteiros de texto de qualquer PDF sem deixar rastros.",
    time: "2 min de leitura",
  },
  {
    title: "Diferenca entre PDF editavel e PDF escaneado",
    desc: "Entenda os tipos de PDF existentes e como editar cada um deles com as ferramentas certas.",
    time: "5 min de leitura",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Sora:wght@700;800&display=swap');
        .sora { font-family: 'Sora', system-ui, sans-serif; }
        * { -webkit-font-smoothing: antialiased; }
        .ad-slot { background: #f9f9f9; border: 1px dashed #e5e7eb; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 12px; }
      `}</style>

      {/* SEO - Meta via helmet ou head direto */}
      {/* Title: Editar PDF Online Gratis | Quillr */}
      {/* Description: Edite, assine e apague conteudo de qualquer PDF direto no navegador. Sem instalar nada. 100% gratuito. */}

      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <QuillrLogo size={28} />
          <span className="sora text-lg font-bold tracking-tight text-gray-900">Quillr</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#como-funciona" className="text-sm text-gray-500 hover:text-gray-800 transition-colors hidden sm:block">Como funciona</a>
          <a href="#faq" className="text-sm text-gray-500 hover:text-gray-800 transition-colors hidden sm:block">Duvidas</a>
          <Link to="/dashboard"
            className="text-sm font-semibold bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-gray-700 transition-all">
            Entrar
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="sora text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
          Editar PDF Online<br />
          <span className="text-orange-500">Gratis e Sem Cadastro</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
          Edite textos, remova conteudo, adicione assinaturas e salve qualquer PDF diretamente no navegador.
          Sem instalar software. Sem criar conta. Completamente gratuito.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10">
          <Link to="/dashboard"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-full text-lg transition-all shadow-lg shadow-orange-100">
            Editar PDF agora — e gratis
          </Link>
          <p className="mt-4 text-sm text-gray-400">Mais de 10.000 documentos editados. Sem cartao de credito.</p>
        </motion.div>
      </section>

      {/* Anuncio topo — Google AdSense */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <div className="ad-slot h-24 w-full">
          {/* <ins class="adsbygoogle" data-ad-slot="SEU_AD_SLOT" data-ad-format="horizontal" /> */}
          Espaco para anuncio — Google AdSense
        </div>
      </div>

      {/* Antes e Depois */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <h2 className="sora text-3xl font-bold text-gray-900">Veja o resultado antes e depois</h2>
          <p className="mt-2 text-gray-400">Edicao de texto, remocao de conteudo e assinatura em segundos</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-end">
            <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-2 py-1 rounded-md">Antes e Depois</span>
          </div>
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="p-8">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Antes</p>
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <img src={ft1} alt="PDF original antes da edicao online" className="w-full object-cover" />
              </div>
            </div>
            <div className="p-8">
              <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-4">Depois</p>
              <div className="rounded-2xl overflow-hidden border border-orange-200 shadow-sm">
                <img src={ft2} alt="PDF editado online com Quillr" className="w-full object-cover" />
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-green-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Editado em segundos com Quillr
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="sora text-3xl font-bold text-gray-900">Tudo que voce precisa para editar PDF</h2>
            <p className="mt-3 text-gray-400">Ferramentas profissionais, interface simples, resultado imediato</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.4 }}
                className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-sm transition-all">
                <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-4">
                  <f.icon size={17} className="text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Anuncio meio */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="ad-slot h-28 w-full">
          {/* <ins class="adsbygoogle" data-ad-slot="SEU_AD_SLOT" data-ad-format="rectangle" /> */}
          Espaco para anuncio — Google AdSense
        </div>
      </div>

      {/* Como funciona */}
      <section id="como-funciona" className="max-w-5xl mx-auto px-6 pb-20">
        <div className="rounded-3xl bg-gray-950 px-10 py-16 flex flex-col md:flex-row items-start justify-between gap-12">
          <div className="md:max-w-xs">
            <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-4">Como funciona</p>
            <h2 className="sora text-3xl font-bold text-white leading-snug">
              Edite seu PDF<br />em 3 passos simples
            </h2>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">
              Nao precisa criar conta, nao precisa instalar nada. So abrir o navegador e comecar.
            </p>
            <Link to="/dashboard"
              className="mt-8 inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all">
              Comecar agora
            </Link>
          </div>
          <div className="flex flex-col gap-8 md:max-w-sm w-full">
            {[
              { n: "01", t: "Faca upload do PDF", d: "Arraste ou selecione o arquivo no seu computador ou celular. Suporta qualquer tipo de PDF." },
              { n: "02", t: "Edite o que precisar", d: "Altere textos, apague areas, adicione assinaturas ou insira novos conteudos com facilidade." },
              { n: "03", t: "Baixe o PDF editado", d: "Clique em baixar e receba seu PDF editado imediatamente, pronto para enviar ou imprimir." },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-4">
                <span className="sora text-sm font-bold text-orange-500 mt-0.5 w-7 flex-shrink-0">{s.n}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{s.t}</p>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Artigos SEO */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="sora text-3xl font-bold text-gray-900">Guias e tutoriais sobre PDF</h2>
            <p className="mt-3 text-gray-400">Aprenda a editar, assinar e gerenciar documentos PDF com facilidade</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {ARTICLES.map((a, i) => (
              <motion.div key={a.title}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.4 }}
                className="p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-sm transition-all cursor-pointer group">
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={14} className="text-orange-400" />
                  <span className="text-xs text-gray-400">{a.time}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-orange-500 transition-colors">{a.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Anuncio antes do FAQ */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="ad-slot h-28 w-full">
          {/* <ins class="adsbygoogle" data-ad-slot="SEU_AD_SLOT" data-ad-format="rectangle" /> */}
          Espaco para anuncio — Google AdSense
        </div>
      </div>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="sora text-3xl font-bold text-gray-900">Perguntas frequentes</h2>
          <p className="mt-3 text-gray-400">Tudo que voce precisa saber sobre edicao de PDF online</p>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.details key={i}
              initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.4 }}
              className="group border border-gray-200 rounded-2xl bg-white overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">
                {faq.q}
                <ChevronDown size={16} className="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" />
              </summary>
              <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
            </motion.details>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-orange-500 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="sora text-4xl font-extrabold text-white mb-4">
            Pronto para editar seu PDF?
          </h2>
          <p className="text-orange-100 mb-8 text-lg">
            Gratis, sem cadastro, sem limite. Acesse agora e edite em segundos.
          </p>
          <Link to="/dashboard"
            className="inline-block bg-white text-orange-500 font-bold px-10 py-4 rounded-full text-lg hover:bg-orange-50 transition-all shadow-lg">
            Editar PDF gratis agora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <QuillrLogo size={22} />
            <span className="sora text-sm font-bold text-gray-900">Quillr</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 Quillr. Ferramenta gratuita de edicao de PDF online.</p>
          <div className="flex gap-5">
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Privacidade</a>
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Termos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
