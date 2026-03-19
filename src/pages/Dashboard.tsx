import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Edit, Download, PenTool, LogOut, Crown, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

type Document = {
  id: string;
  name: string;
  status: string;
  file_path: string;
  created_at: string;
  updated_at: string;
};

const FREE_LIMIT = 3;

const statusLabels: Record<string, { label: string; color: string }> = {
  uploaded: { label: "Enviado", color: "bg-muted text-muted-foreground" },
  editing: { label: "Editando", color: "bg-accent text-accent-foreground" },
  completed: { label: "Concluido", color: "bg-primary/10 text-primary" },
  signed: { label: "Assinado", color: "bg-primary/10 text-primary" },
};

const UpgradeModal = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-card border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>

        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Limite do plano Free atingido
        </h2>
        <p className="text-muted-foreground mb-6">
          Você usou suas <strong>{FREE_LIMIT} edições gratuitas</strong> deste mês. O contador reseta todo dia <strong>1º do mês</strong> — ou faça upgrade para editar sem limite agora.
        </p>

        <div className="w-full bg-muted/50 rounded-xl p-5 mb-6 text-left space-y-2">
          {[
            "Edições ilimitadas",
            "Upload até 100MB",
            "Todas as funcionalidades",
            "Sem marca d'água",
            "Suporte prioritário",
          ].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-foreground">
              <Crown className="w-4 h-4 text-amber-500 shrink-0" />
              {f}
            </div>
          ))}
        </div>

        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-4xl font-black text-foreground">R$ 29</span>
          <span className="text-muted-foreground">/mês</span>
        </div>

        <Link to="/checkout" className="w-full">
          <Button size="lg" className="w-full gap-2 bg-amber-500 hover:bg-amber-600 text-white">
            <Crown className="w-4 h-4" />
            Fazer upgrade agora
          </Button>
        </Link>
        <button
          onClick={onClose}
          className="mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Continuar no plano gratuito
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const editCount = (profile as any)?.edit_count_month ?? 0;
  const isFree = profile?.plan === "free" || !profile?.plan;
  const editsLeft = isFree ? Math.max(0, FREE_LIMIT - editCount) : null;

  const fetchDocuments = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    setDocuments(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Realtime — atualiza lista automaticamente quando documento é inserido/atualizado
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("documents-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "documents",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchDocuments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchDocuments]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.type !== "application/pdf") {
      toast.error("Apenas arquivos PDF são aceitos.");
      return;
    }

    // Verifica limite de uploads do plano Free
    if (isFree) {
      const { data, error } = await supabase.rpc("check_and_increment_edit", {
        p_user_id: user.id,
      });
      if (error) {
        toast.error("Erro ao verificar limite.");
        return;
      }
      if (!data.allowed) {
        setShowUpgrade(true);
        e.target.value = "";
        return;
      }
      await refreshProfile();
    }

    setUploading(true);
    const filePath = `${user.id}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Erro ao enviar arquivo.");
      setUploading(false);
      return;
    }

    const { error: dbError } = await supabase.from("documents").insert({
      user_id: user.id,
      name: file.name,
      file_path: filePath,
      status: "uploaded",
    });

    if (dbError) {
      toast.error("Erro ao registrar documento.");
    } else {
      toast.success("PDF enviado com sucesso!");
      fetchDocuments();
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleEdit = (docId: string) => {
    if (!user) return;
    // Upload já verifica e incrementa o limite — editar é livre após upload aprovado
    navigate(`/editor/${docId}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      </AnimatePresence>

      {/* Top bar */}
      <header className="border-b border-border bg-surface sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="font-display text-xl font-extrabold tracking-tight text-foreground">
            Quillr
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {profile?.full_name || profile?.email}
            </span>

            {isFree ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">
                  Free · {editsLeft}/{FREE_LIMIT} este mês
                </span>
                <Link to="/checkout">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-amber-600 border-amber-300 hover:bg-amber-50"
                  >
                    <Crown className="w-3 h-3" /> Upgrade
                  </Button>
                </Link>
              </div>
            ) : (
              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-md capitalize">
                {profile?.plan}
              </span>
            )}

            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Free plan warning bar */}
      {isFree && editsLeft !== null && editsLeft <= 1 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border-b border-amber-200 px-6 py-2"
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <p className="text-sm text-amber-800">
              {editsLeft === 0
                ? "⚠️ Você atingiu o limite de edições do plano Free."
                : "⚠️ Última edição gratuita disponível!"}
            </p>
            <Button
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-white gap-1 shrink-0"
              onClick={() => setShowUpgrade(true)}
            >
              <Crown className="w-3 h-3" /> Ver planos
            </Button>
          </div>
        </motion.div>
      )}

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Upload area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-dashed border-border rounded-2xl p-12 text-center mb-10 hover:border-primary/40 transition-colors"
        >
          <input
            type="file"
            accept=".pdf"
            id="pdf-upload"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading || (isFree && editsLeft === 0)}
          />
          <Upload className={`w-10 h-10 mx-auto mb-4 ${isFree && editsLeft === 0 ? "text-muted-foreground/30" : "text-muted-foreground"}`} />
          <h3 className="font-display text-xl font-bold text-foreground mb-2">
            Enviar PDF
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {isFree && editsLeft === 0
              ? "Você atingiu o limite do plano Free. Resetа no dia 1º do mês."
              : "Arraste seu arquivo aqui ou clique para selecionar"}
          </p>
          <label htmlFor="pdf-upload">
            {isFree && editsLeft === 0 ? (
              <Button variant="outline" size="lg" onClick={() => setShowUpgrade(true)} className="gap-2 text-amber-600 border-amber-300">
                <Crown className="w-4 h-4" /> Fazer upgrade para continuar
              </Button>
            ) : (
              <Button asChild variant="default" size="lg" disabled={uploading}>
                <span className="cursor-pointer">
                  {uploading ? "Enviando..." : "Selecionar arquivo"}
                </span>
              </Button>
            )}
          </label>
        </motion.div>

        {/* Documents list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-foreground">
              Seus documentos
            </h2>
            <span className="text-sm text-muted-foreground">
              {documents.length} {documents.length === 1 ? "documento" : "documentos"}
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-muted-foreground">Carregando...</div>
          ) : documents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhum documento ainda. Envie seu primeiro PDF.
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-3">
              {documents.map((doc, i) => {
                const status = statusLabels[doc.status] || statusLabels.uploaded;
                return (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-sm transition-shadow"
                  >
                    <div className="p-2 rounded-lg bg-muted">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(doc.updated_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${status.color}`}>
                      {status.label}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(doc.id)}
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Assinar">
                        <PenTool className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Baixar">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
