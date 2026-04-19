import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Upload, FileText, Edit, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

type Document = {
  id: string;
  name: string;
  session_id: string;
  page_count: number;
  created_at: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);

  const loadDocs = useCallback(() => {
    const raw = localStorage.getItem("quillr_docs");
    setDocuments(raw ? JSON.parse(raw) : []);
  }, []);

  useEffect(() => { loadDocs(); }, [loadDocs]);

  const saveDocs = (docs: Document[]) => {
    localStorage.setItem("quillr_docs", JSON.stringify(docs));
    setDocuments(docs);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Apenas arquivos PDF são aceitos.");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res  = await fetch(`${API_BASE}/upload`, { method: "POST", body: form });
      const data = await res.json();
      if (!data.session_id) throw new Error("Falha no upload.");

      // Salva sessão no sessionStorage para o Editor encontrar
      sessionStorage.setItem(`session_${data.session_id}`, JSON.stringify(data));

      const newDoc: Document = {
        id:         data.session_id,
        name:       file.name,
        session_id: data.session_id,
        page_count: data.page_count || 1,
        created_at: new Date().toISOString(),
      };

      const updated = [newDoc, ...documents];
      saveDocs(updated);
      toast.success("PDF enviado com sucesso!");
      navigate(`/editor/${newDoc.id}`);
    } catch (err: any) {
      toast.error(err.message || "Erro ao enviar arquivo.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = (id: string) => {
    const updated = documents.filter(d => d.id !== id);
    saveDocs(updated);
    toast.success("Documento removido.");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-30 bg-white">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="font-display text-xl font-extrabold tracking-tight text-foreground">Quillr</a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Upload */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="border-2 border-dashed border-border rounded-2xl p-12 text-center mb-10 hover:border-primary/40 transition-colors">
          <input type="file" accept=".pdf" id="pdf-upload" className="hidden" onChange={handleUpload} disabled={uploading} />
          <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-display text-xl font-bold text-foreground mb-2">Enviar PDF</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Arraste seu arquivo aqui ou clique para selecionar
          </p>
          <label htmlFor="pdf-upload">
            <Button asChild variant="default" size="lg" disabled={uploading}>
              <span className="cursor-pointer">{uploading ? "Enviando..." : "Selecionar arquivo"}</span>
            </Button>
          </label>
        </motion.div>

        {/* Lista de documentos */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-foreground">Seus documentos</h2>

          {documents.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
              <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum documento ainda. Envie seu primeiro PDF.</p>
            </motion.div>
          ) : (
            <div className="grid gap-3">
              {documents.map((doc, i) => (
                <motion.div key={doc.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-sm transition-shadow">
                  <div className="p-2 rounded-lg bg-muted">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(doc.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8"
                      onClick={() => navigate(`/editor/${doc.id}`)} title="Editar">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"
                      onClick={() => window.open(`${API_BASE}/download/${doc.session_id}`)} title="Baixar">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600"
                      onClick={() => handleDelete(doc.id)} title="Remover">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
