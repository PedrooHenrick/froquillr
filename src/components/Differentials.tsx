import { motion } from "framer-motion";
import { Shield, Zap, Lock } from "lucide-react";

const Differentials = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tighter-custom">
            Controle total sobre seus PDFs
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Voce nao precisa recriar documentos do zero. Com o Quillr, qualquer
            parte do seu PDF pode ser editada com a mesma naturalidade de um
            documento de texto. Textos, assinaturas, imagens — tudo acessivel em
            poucos cliques.
          </p>
          <div className="mt-10 space-y-6">
            {[
              { icon: Zap, text: "Processamento em tempo real, sem esperas" },
              { icon: Shield, text: "Seus dados sao deletados apos 2 horas" },
              { icon: Lock, text: "Criptografia ponta a ponta em todos os arquivos" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center shrink-0">
                  <item.icon className="text-primary" size={20} strokeWidth={1.5} />
                </div>
                <span className="text-foreground font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full" />
          <div className="relative bg-card rounded-2xl shadow-elevated p-8 space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary/10 rounded-lg" />
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="ml-auto h-4 w-16 bg-accent rounded" />
            </div>
            {[1, 2, 3, 4].map((line) => (
              <div key={line} className="flex gap-3">
                <div className={`h-4 rounded ${line === 2 ? 'w-full bg-accent border-l-2 border-primary' : line === 3 ? 'w-4/5 bg-muted' : line === 1 ? 'w-3/4 bg-muted' : 'w-2/3 bg-muted'}`} />
              </div>
            ))}
            <div className="pt-4 flex items-center gap-4">
              <div className="h-10 flex-1 bg-primary/10 rounded-lg" />
              <div className="h-10 w-10 bg-muted rounded-lg" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Differentials;
