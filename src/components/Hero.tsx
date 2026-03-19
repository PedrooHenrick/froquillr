import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-36 pb-24 px-6"
      style={{
        background: "radial-gradient(ellipse 90% 90% at 65% 45%, #c2410c 0%, #9a3412 40%, #14532d 75%, #052e16 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="inline-block text-xs font-bold tracking-[0.18em] uppercase text-orange-200/70 border border-orange-300/20 px-3 py-1 rounded-full mb-6">
            Versão 2.0 disponível
          </span>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] tracking-tight">
            Edite PDFs{" "}
            <span className="text-orange-300">gratuitamente</span>{" "}online.
          </h1>

          <p className="mt-8 text-lg text-white/60 max-w-lg leading-relaxed">
            Edite textos, imagens e assinaturas com a mesma facilidade de um
            editor de texto moderno. Sem instalações, sem complicações.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button
              size="xl"
              className="bg-orange-500 hover:bg-orange-400 text-white font-bold shadow-lg"
              asChild
            >
              <Link to="/auth">Login</Link>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              asChild
            >
              <Link to="/auth">Criar conta grátis</Link>
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-6 text-sm text-white/35">
            <span>Não requer cartão de crédito</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Processamento seguro SSL</span>
          </div>
        </motion.div>

        {/* Card com imagem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          {/* Glow atrás do card */}
          <div className="absolute -inset-4 bg-orange-500/20 rounded-3xl blur-2xl" />

          {/* Card */}
          <div
            className="relative rounded-2xl overflow-hidden border border-orange-400/20 shadow-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(194,65,12,0.25) 0%, rgba(20,83,45,0.35) 100%)",
              backdropFilter: "blur(2px)",
            }}
          >
            {/* Barra de título do card */}
            <div
              className="flex items-center gap-2 px-4 py-3 border-b border-white/10"
              style={{ background: "rgba(0,0,0,0.2)" }}
            >
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-orange-300/80" />
              <div className="w-3 h-3 rounded-full bg-green-400/60" />
              <span className="ml-3 text-xs text-white/40 font-medium">Quillr</span>
            </div>

            {/* Imagem dentro do card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="p-6"
            >
              <img
                src="/hero-image.png"
                alt="Quillr"
                className="w-full rounded-xl"
                draggable={false}
              />
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
