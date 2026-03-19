import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, Check, ArrowLeft, Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ─── TROQUE PELA SUA PUBLIC KEY DO MERCADO PAGO ───────────────
const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY || "TEST-sua-public-key-aqui";
// ──────────────────────────────────────────────────────────────

const features = [
  "Uploads ilimitados por mês",
  "Upload até 100MB por arquivo",
  "Todas as ferramentas de edição",
  "Sem marca d'água",
  "Suporte prioritário",
  "OCR com IA para PDFs escaneados",
];

const Checkout = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mpLoaded, setMpLoaded] = useState(false);

  // Redireciona se já é Pro
  useEffect(() => {
    if (profile?.plan === "pro") {
      navigate("/dashboard");
    }
  }, [profile]);

  // Carrega SDK do Mercado Pago
  useEffect(() => {
    if (document.getElementById("mp-sdk")) {
      setMpLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "mp-sdk";
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.onload = () => setMpLoaded(true);
    document.head.appendChild(script);
  }, []);

  const handleSubscribe = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Cria preferência de assinatura no backend
      const { data: sbSession } = await supabase.auth.getSession();
      const token = sbSession.session?.access_token;

      const res = await fetch("/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          email: profile?.email || user.email,
          plan: "pro",
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar assinatura.");

      const data = await res.json();

      // Redireciona para o checkout do Mercado Pago
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error("Link de pagamento não gerado.");
      }
    } catch (e: any) {
      toast.error(e.message || "Erro ao processar pagamento.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <span className="font-display text-lg font-bold text-foreground">
            Quill<span className="text-orange-500">r</span>
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Lado esquerdo — detalhes do plano */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-6 h-6 text-orange-500" />
              <span className="text-sm font-bold uppercase tracking-wider text-orange-500">
                Plano Profissional
              </span>
            </div>

            <h1 className="text-3xl font-black text-foreground mb-2">
              Edite PDFs sem limites
            </h1>
            <p className="text-muted-foreground mb-8">
              Cancele quando quiser. Sem multas ou fidelidade.
            </p>

            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-5xl font-black text-foreground">R$29</span>
              <span className="text-muted-foreground">/mês</span>
            </div>

            <ul className="space-y-3 mb-8">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                  <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-orange-600" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            {/* Garantias */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-4 h-4 text-green-500" />
                Pagamento 100% seguro via Mercado Pago
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <RefreshCw className="w-4 h-4 text-blue-500" />
                Cancele a qualquer momento pelo painel
              </div>
            </div>
          </motion.div>

          {/* Lado direito — botão de pagamento */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              <h2 className="font-bold text-foreground text-lg mb-6">
                Resumo do pedido
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quillr Pro</span>
                  <span className="font-medium text-foreground">R$29,00/mês</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plano atual</span>
                  <span className="font-medium text-foreground capitalize">{profile?.plan || "Free"}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-bold text-foreground">Total hoje</span>
                  <span className="font-black text-foreground text-lg">R$29,00</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold gap-2 h-14 text-base"
                onClick={handleSubscribe}
                disabled={loading || !mpLoaded}
              >
                <Crown className="w-5 h-5" />
                {loading ? "Processando..." : "Assinar agora — R$29/mês"}
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Ao assinar você concorda com os{" "}
                <span className="underline cursor-pointer">Termos de Uso</span>
                {" "}e autoriza a cobrança mensal automática.
              </p>

              {/* Logo Mercado Pago */}
              <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-border">
                <span className="text-xs text-muted-foreground">Pagamento processado por</span>
                <span className="text-sm font-bold text-blue-600">Mercado Pago</span>
              </div>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
};

export default Checkout;
