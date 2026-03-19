import { motion } from "framer-motion";

const metrics = [
  { value: "2.5M+", label: "Documentos editados este mês" },
  { value: "99.9%", label: "Precisão na conversão de fontes" },
  { value: "150K+", label: "Usuários ativos" },
];

const SocialProof = () => {
  return (
    <section className="py-20 px-6 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Confiança de milhares de profissionais
          </h2>
        </motion.div>

        <div className="grid grid-cols-3 gap-6">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-black text-primary tracking-tight">
                {m.value}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
