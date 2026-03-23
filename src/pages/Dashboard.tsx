import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Edit, Download, PenTool, LogOut, Crown, X, AlertTriangle, Zap, Scissors } from "lucide-react";
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

// ── Modal de upgrade com 3 planos ─────────────────────────────────────────
const UpgradeModal = ({ onClose, resetsAt }: { onClose: () => void; resetsAt?: string }) => (
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
      className="bg-card border border-border rounded-2xl p-8 max-w-lg w-full shadow-2xl relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
        <X className="w-5 h-5" />
      </button>

      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Limite semanal atingido
        </h2>
        <p className="text-muted-foreground text-sm">
          Voce usou suas <strong>{FREE_LIMIT} edicoes gratuitas</strong> desta semana.
          {resetsAt && <> Renova em <strong>{resetsAt}</strong>.</>}
        </p>
      </div>

      {/* Cards dos planos */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Basico */}
        <Link to="/checkout?plan=basic" className="block">
          <div className="border border-blue-200 rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer">
            <Zap className="w-5 h-5 text-blue-500 mb-2" />
            <p className="font-bold text-foreground text-sm">Basico</p>
            <p className="text-2xl font-black text-foreground mt-1">R$5</p>
            <p className="text-xs text-muted-foreground mt-1">5 edicoes avulsas</p>
            <ul className="mt-3 space-y-1">
              {["5 edicoes", "Sem expiracao", "Todas as ferramentas"].map(f => (
                <li key={f} className="text-xs text-gray-600 flex items-center gap-1">
                  <span className="text-blue-500">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        </Link>

        {/* Pro */}
        <Link to="/checkout?plan=pro" className="block">
          <div className="border-2 border-orange-400 rounded-xl p-4 bg-orange-50/50 hover:bg-orange-50 transition-all cursor-pointer relative">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              POPULAR
            </span>
            <Crown className="w-5 h-5 text-orange-500 mb-2" />
            <p className="font-bold text-foreground text-sm">Pro</p>
            <p className="text-2xl font-black text-foreground mt-1">R$12,80</p>
            <p className="text-xs text-muted-foreground mt-1">por mes</p>
            <ul className="mt-3 space-y-1">
              {["Ilimitado/mes", "Upload 100MB", "Sem marca dagua"].map(f => (
                <li key={f} className="text-xs text-gray-600 flex items-center gap-1">
                  <span className="text-orange-500">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        </Link>
      </div>

      <button onClick={onClose} className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
        Continuar no plano gratuito
      </button>
    </motion.div>
  </motion.div>
);


// ── Dashboard principal ────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [documents, setDocuments]   = useState<Document[]>([]);
  const [loading, setLoading]       = useState(true);
  const [uploading, setUploading]   = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [resetsAt, setResetsAt]     = useState<string | undefined>();

  const isFree    = profile?.plan === "free" || !profile?.plan;
  const isBasic   = profile?.plan === "basic";
  const isPro     = profile?.plan === "pro";
  const editCount = (profile as any)?.edit_count_week ?? 0;
  const credits   = (profile as any)?.edit_credits ?? 0;
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

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("documents-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "documents", filter: `user_id=eq.${user.id}` },
        () => { fetchDocuments(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, fetchDocuments]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.type !== "application/pdf") {
      toast.error("Apenas arquivos PDF sao aceitos.");
      return;
    }

    // Verifica limite para free e basic
    if (isFree || isBasic) {
      const { data, error } = await supabase.rpc("check_and_increment_edit", { p_user_id: user.id });
      if (error) { toast.error("Erro ao verificar limite."); return; }
      if (!data.allowed) {
        if (data.resets_at) {
          const d = new Date(data.resets_at);
          setResetsAt(d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" }));
        }
        setShowUpgrade(true);
        e.target.value = "";
        return;
      }
      await refreshProfile();
    }

    setUploading(true);
    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from("pdfs").upload(filePath, file);
    if (uploadError) { toast.error("Erro ao enviar arquivo."); setUploading(false); return; }

    const { error: dbError } = await supabase.from("documents").insert({
      user_id: user.id, name: file.name, file_path: filePath, status: "uploaded",
    });
    if (dbError) { toast.error("Erro ao registrar documento."); }
    else { toast.success("PDF enviado com sucesso!"); fetchDocuments(); }
    setUploading(false);
    e.target.value = "";
  };

  const handleEdit   = (docId: string) => navigate(`/editor/${docId}`);
  const handleSignOut = async () => { await signOut(); navigate("/"); };

  // Label do plano no header
  const planBadge = () => {
    if (isPro)    return <span className="text-xs font-medium bg-orange-100 text-orange-600 px-2 py-1 rounded-md">Pro ∞</span>;
    if (isBasic)  return <span className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded-md">Basico · {credits} creditos</span>;
    return (
      <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">
        Free · {editsLeft}/{FREE_LIMIT} esta semana
      </span>
    );
  };

  const isBlocked = isFree && editsLeft === 0;

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} resetsAt={resetsAt} />}
      </AnimatePresence>

      {/* Header */}
      <header className="border-b border-border bg-surface sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="font-display text-xl font-extrabold tracking-tight text-foreground">Quillr</a>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{profile?.full_name || profile?.email}</span>
            {planBadge()}
            {(isFree || isBasic) && (
              <Link to="/checkout?plan=pro">
                <Button size="sm" variant="outline" className="gap-1 text-amber-600 border-amber-300 hover:bg-amber-50">
                  <Crown className="w-3 h-3" /> Upgrade
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Warning bar */}
      {isFree && editsLeft !== null && editsLeft <= 1 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border-b border-amber-200 px-6 py-2">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <p className="text-sm text-amber-800">
              {editsLeft === 0 ? "Limite semanal atingido. Renova toda segunda-feira." : "Ultima edicao gratuita desta semana!"}
            </p>
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white gap-1 shrink-0" onClick={() => setShowUpgrade(true)}>
              <Crown className="w-3 h-3" /> Ver planos
            </Button>
          </div>
        </motion.div>
      )}

      {isBasic && credits <= 1 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border-b border-blue-200 px-6 py-2">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <p className="text-sm text-blue-800">
              {credits === 0 ? "Seus creditos acabaram." : "Ultimo credito disponivel!"}
            </p>
            <Link to="/checkout?plan=basic">
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white gap-1 shrink-0">
                <Zap className="w-3 h-3" /> Comprar mais
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Before/After — aparece só quando não tem documentos */}
        {!loading && documents.length === 0 && <BeforeAfterSection />}

        {/* Upload */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="border-2 border-dashed border-border rounded-2xl p-12 text-center mb-10 hover:border-primary/40 transition-colors">
          <input type="file" accept=".pdf" id="pdf-upload" className="hidden" onChange={handleUpload} disabled={uploading || isBlocked} />
          <Upload className={`w-10 h-10 mx-auto mb-4 ${isBlocked ? "text-muted-foreground/30" : "text-muted-foreground"}`} />
          <h3 className="font-display text-xl font-bold text-foreground mb-2">Enviar PDF</h3>
          <p className="text-sm text-muted-foreground mb-6">
            {isBlocked ? "Limite semanal atingido. Renova toda segunda-feira." : "Arraste seu arquivo aqui ou clique para selecionar"}
          </p>
          <label htmlFor="pdf-upload">
            {isBlocked ? (
              <Button variant="outline" size="lg" onClick={() => setShowUpgrade(true)} className="gap-2 text-amber-600 border-amber-300">
                <Crown className="w-4 h-4" /> Fazer upgrade para continuar
              </Button>
            ) : (
              <Button asChild variant="default" size="lg" disabled={uploading}>
                <span className="cursor-pointer">{uploading ? "Enviando..." : "Selecionar arquivo"}</span>
              </Button>
            )}
          </label>
        </motion.div>

        {/* Before/After — aparece acima da lista quando já tem documentos */}
        {!loading && documents.length > 0 && <BeforeAfterSection />}

        {/* Documents list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-foreground">Seus documentos</h2>
            <span className="text-sm text-muted-foreground">
              {documents.length} {documents.length === 1 ? "documento" : "documentos"}
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-muted-foreground">Carregando...</div>
          ) : documents.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
              <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum documento ainda. Envie seu primeiro PDF.</p>
            </motion.div>
          ) : (
            <div className="grid gap-3">
              {documents.map((doc, i) => {
                const status = statusLabels[doc.status] || statusLabels.uploaded;
                return (
                  <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-sm transition-shadow">
                    <div className="p-2 rounded-lg bg-muted">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(doc.updated_at).toLocaleDateString("pt-BR")}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${status.color}`}>{status.label}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(doc.id)} title="Editar">
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