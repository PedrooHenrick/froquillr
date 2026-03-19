import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FinalCTA = () => {
  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tighter-custom">
          Comece a editar seus PDFs agora
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
          A ferramenta definitiva para quem nao tem tempo a perder com burocracia.
          Junte-se a mais de 150 mil profissionais.
        </p>
        <div className="mt-10">
          <Button variant="hero" size="xl" asChild>
            <Link to="/auth">Login</Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Nao requer cartao de credito
        </p>
      </motion.div>
    </section>
  );
};

export default FinalCTA;
