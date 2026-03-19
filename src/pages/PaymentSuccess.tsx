import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  useEffect(() => {
    // Atualiza o perfil para pegar o novo plano
    refreshProfile();
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="w-5 h-5 text-orange-500" />
          <span className="text-sm font-bold uppercase tracking-wider text-orange-500">
            Plano Profissional Ativo
          </span>
        </div>

        <h1 className="text-3xl font-black text-foreground mb-4">
          Bem-vindo ao Pro! 🎉
        </h1>

        <p className="text-muted-foreground mb-8">
          Seu pagamento foi confirmado. Você agora tem acesso ilimitado a todas
          as funcionalidades do Quillr Pro.
        </p>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8 text-left space-y-2">
          {[
            "Uploads ilimitados por mês",
            "Upload até 100MB por arquivo",
            "Sem marca d'água",
            "Suporte prioritário",
          ].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-orange-800">
              <CheckCircle className="w-4 h-4 text-orange-500 shrink-0" />
              {f}
            </div>
          ))}
        </div>

        <Button
          size="lg"
          className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold"
          onClick={() => navigate("/dashboard")}
        >
          Ir para o painel
        </Button>

        <p className="text-xs text-muted-foreground mt-4">
          Você receberá um e-mail de confirmação em breve.
        </p>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
