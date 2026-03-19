import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-black text-foreground mb-4">
          Pagamento não concluído
        </h1>

        <p className="text-muted-foreground mb-8">
          Seu pagamento não foi processado. Nenhum valor foi cobrado.
          Tente novamente ou entre em contato com o suporte.
        </p>

        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold"
            onClick={() => navigate("/checkout")}
          >
            Tentar novamente
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={() => navigate("/dashboard")}
          >
            Voltar ao painel
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Se o problema persistir, entre em contato: suporte@quillr.com.br
        </p>
      </motion.div>
    </div>
  );
};

export default PaymentFailure;
