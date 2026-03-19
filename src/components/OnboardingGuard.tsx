import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const OnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const { profile, loading, profileLoading, user } = useAuth();

  // Espera auth ou perfil carregar
  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  // Só redireciona se perfil carregou E onboarding não foi feito
  if (profile && !profile.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default OnboardingGuard;
