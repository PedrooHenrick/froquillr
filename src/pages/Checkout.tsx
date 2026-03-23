import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, Check, ArrowLeft, Shield, RefreshCw, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PLANS_CONFIG = {
  pro: {
    label: "Plano Pro",
    price: "R$12,80",
    priceShort: "R$12,80/mês",
    description: "Cancele quando quiser. Sem multas ou fidelidade.",
    features: [
      "Edicoes ilimitadas por mes",
      "Upload ate 100MB por arquivo",
      "Todas as ferramentas de edicao",
      "Sem marca dagua",
      "Suporte prioritario",
      "Acesso a todas as novas funcionalidades",
    ],
    icon: Crown,
    color: "text-orange-500",
    bg: "bg-orange-500 hover:bg-orange-400",
    badge: "Mais popular",
  },
  basic: {
    label: "Basico",
    price: "R$5,00",
    priceShort: "R$5 / 5 PDFs",
    description: "Pague uma vez, use quando quiser. Sem assinatura.",
    features: [
      "5 edicoes por compra",
      "Todas as ferramentas de edicao",
      "Assinatura digital",
      "Creditos sem expiracao",
    ],
    icon: Zap,
    color: "text-blue-500",
    bg: "bg-blue-500 hover:bg-blue-400",
    badge: null,
  },
};

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planKey = (searchParams.get("plan") || "pro") as "pro" | "basic";
  const plan = PLANS_CONFIG[planKey] || PLANS_CONFIG.pro;

  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.plan === "pro" && planKey === "pro") {
      navigate("/dashboard");
    }
  }, [profile]);

  const handleSubscribe = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-subscription", {
        body: {
          user_id: user.id,
          email: profile?.email || user.email,
          plan: planKey,
        },
      });

      if (error) throw new Error("Erro ao criar assinatura.");

      if (data?.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error("Link de pagamento nao gerado.");
      }
    } catch (e: any) {
      toast.error(e.message || "Erro ao processar pagamento.");
      setLoading(false);
    }
  };

  const Icon = plan.icon;

  return (
    <div className="min-h-screen bg-background">
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

      {/* Seletor de planos no topo */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex gap-3">
          {(["basic", "pro"] as const).map((key) => {
            const p = PLANS_CONFIG[key];
            const PIcon = p.icon;
            const isActive = planKey === key;
            return (
              <button
                key={key}
                onClick={() => navigate(`/checkout?plan=${key}`)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  isActive
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                }`}
              >
                <PIcon className="w-4 h-4" />
                {p.label} — {p.priceShort}
                {p.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? "bg-white/20 text-white" : "bg-orange-100 text-orange-600"}`}>
                    {p.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            key={planKey}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className={`flex items-center gap-2 mb-4 ${plan.color}`}>
              <Icon className="w-6 h-6" />
              <span className="text-sm font-bold uppercase tracking-wider">{plan.label}</span>
            </div>

            <h1 className="text-3xl font-black text-foreground mb-2">
              {planKey === "pro"
                ? "Edite PDFs sem limites"
                : "5 creditos, use quando quiser"}
            </h1>
            <p className="text-muted-foreground mb-8">{plan.description}</p>

            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-5xl font-black text-foreground">{plan.price}</span>
              {planKey === "pro" && (
                <span className="text-muted-foreground">/mes</span>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                  <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-orange-600" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            {/* Comparativo com Free */}
            <div className="bg-muted/50 rounded-xl p-4 border border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Comparado ao plano Free
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Free</span>
                  <span className="text-foreground font-medium">3 edicoes/semana</span>
                </div>
                <div className="flex justify-between">
                  <span className={plan.color + " font-medium"}>{plan.label}</span>
                  <span className="text-foreground font-medium">
                    {planKey === "pro" ? "Ilimitado/mes" : "5 edicoes (sem expiracao)"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-4 h-4 text-green-500" />
                Pagamento 100% seguro via Mercado Pago
              </div>
              {planKey === "pro" && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <RefreshCw className="w-4 h-4 text-blue-500" />
                  Cancele a qualquer momento pelo painel
                </div>
              )}
              {planKey === "basic" && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  Creditos nao expiram — use no seu ritmo
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            key={planKey + "_card"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              <h2 className="font-bold text-foreground text-lg mb-6">Resumo do pedido</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quillr {plan.label}</span>
                  <span className="font-medium text-foreground">{plan.priceShort}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plano atual</span>
                  <span className="font-medium text-foreground capitalize">
                    {profile?.plan || "Free"}
                  </span>
                </div>
                {planKey === "basic" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Creditos atuais</span>
                    <span className="font-medium text-foreground">
                      {(profile as any)?.edit_credits ?? 0}
                    </span>
                  </div>
                )}
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-bold text-foreground">Total hoje</span>
                  <span className="font-black text-foreground text-lg">{plan.price}</span>
                </div>
              </div>

              <Button
                size="lg"
                className={`w-full text-white font-bold gap-2 h-14 text-base ${plan.bg}`}
                onClick={handleSubscribe}
                disabled={loading}
              >
                <Icon className="w-5 h-5" />
                {loading
                  ? "Processando..."
                  : `${planKey === "pro" ? "Assinar agora" : "Comprar agora"} — ${plan.priceShort}`}
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Ao prosseguir voce concorda com os{" "}
                <span className="underline cursor-pointer">Termos de Uso</span>.
              </p>

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
