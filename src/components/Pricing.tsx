import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "para sempre",
    description: "Para uso ocasional e testes rapidos.",
    features: [
      "3 documentos por mes",
      "Edicao basica de texto",
      "Download em PDF",
      "Suporte por email",
    ],
    cta: "Comecar gratis",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "R$ 29",
    period: "/mes",
    description: "Para profissionais que precisam de controle total.",
    features: [
      "Documentos ilimitados",
      "Todas as ferramentas de edicao",
      "Assinatura digital",
      "Processamento prioritario",
      "Suporte dedicado",
      "API de integracao",
    ],
    cta: "Assinar Pro",
    highlighted: true,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tighter-custom">
            Planos simples e transparentes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Sem taxas ocultas. Cancele quando quiser.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-card shadow-elevated ring-2 ring-primary/20"
                  : "bg-card shadow-card"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-8 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  Mais popular
                </span>
              )}
              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-foreground tracking-tighter-custom">
                  {plan.price}
                </span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-foreground">
                    <Check className="text-primary shrink-0" size={16} strokeWidth={2} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.highlighted ? "hero" : "hero-outline"}
                size="lg"
                className="w-full mt-8"
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
