import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, PenTool, FilePlus, Check, Crown } from "lucide-react";
import { toast } from "sonner";

const objectives = [
  { id: "edit", label: "Editar um PDF", description: "Modificar textos, imagens e conteudo existente", icon: FileText },
  { id: "sign", label: "Assinar um documento", description: "Adicionar assinatura digital a documentos", icon: PenTool },
  { id: "create", label: "Criar novo documento", description: "Criar um PDF do zero com novos conteudos", icon: FilePlus },
];

const plans = [
  {
    id: "free",
    name: "Gratuito",
    price: "R$ 0",
    period: "/mes",
    features: ["5 edicoes por mes", "Upload ate 10MB", "Funcionalidades basicas", "Marca d'agua nos documentos"],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Profissional",
    price: "R$ 29",
    period: "/mes",
    features: ["Edicoes ilimitadas", "Upload ate 100MB", "Todas as funcionalidades", "Sem marca d'agua", "Suporte prioritario"],
    highlighted: true,
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedObjective, setSelectedObjective] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [saving, setSaving] = useState(false);

  // If already onboarded, redirect
  if (profile?.onboarding_completed) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        objective: selectedObjective,
        plan: selectedPlan,
        onboarding_completed: true,
      })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Erro ao salvar. Tente novamente.");
    } else {
      await refreshProfile();
      navigate("/dashboard");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s <= step ? "bg-primary w-16" : "bg-muted w-8"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h1 className="font-display text-3xl font-bold text-foreground">
                  O que voce quer fazer agora?
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Escolha seu objetivo para personalizarmos sua experiencia
                </p>
              </div>

              <div className="grid gap-3">
                {objectives.map((obj) => {
                  const Icon = obj.icon;
                  const isSelected = selectedObjective === obj.id;
                  return (
                    <button
                      key={obj.id}
                      onClick={() => setSelectedObjective(obj.id)}
                      className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? "border-primary bg-accent shadow-sm"
                          : "border-border bg-card hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className={`p-3 rounded-lg ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{obj.label}</p>
                        <p className="text-sm text-muted-foreground">{obj.description}</p>
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5 text-primary ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>

              <Button
                size="xl"
                className="w-full"
                onClick={() => setStep(2)}
                disabled={!selectedObjective}
              >
                Continuar
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h1 className="font-display text-3xl font-bold text-foreground">
                  Escolha seu plano
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Comece gratis ou desbloqueie todo o potencial
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {plans.map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative p-6 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-accent shadow-sm"
                          : "border-border bg-card hover:border-muted-foreground/30"
                      }`}
                    >
                      {plan.highlighted && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <Crown className="w-3 h-3" /> Recomendado
                          </span>
                        </div>
                      )}
                      <div className="mb-4">
                        <p className="font-semibold text-foreground">{plan.name}</p>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                          <span className="text-muted-foreground text-sm">{plan.period}</span>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-primary shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button
                  size="lg"
                  onClick={handleFinish}
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? "Salvando..." : "Comecar a usar"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Onboarding;
