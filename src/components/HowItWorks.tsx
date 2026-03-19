import { motion } from "framer-motion";
import { Upload, Edit, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Faca o upload",
    description: "Arraste seu PDF ou selecione o arquivo do seu computador. O processamento e instantaneo.",
  },
  {
    icon: Edit,
    step: "02",
    title: "Edite o documento",
    description: "Use nossas ferramentas para editar textos, remover elementos e inserir assinaturas.",
  },
  {
    icon: Download,
    step: "03",
    title: "Baixe ou envie",
    description: "Exporte o PDF editado ou envie diretamente para assinatura digital.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tighter-custom">
            Como funciona
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Tres passos simples para transformar seus documentos PDF.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-px border-t-2 border-dashed border-border" />

          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="w-16 h-16 bg-card rounded-2xl shadow-card flex items-center justify-center mx-auto mb-6 relative z-10">
                <s.icon className="text-primary" size={28} strokeWidth={1.5} />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-primary mb-2 block">
                Passo {s.step}
              </span>
              <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                {s.title}
              </h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
