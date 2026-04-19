import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AuthContextType = {
  user: { id: string } | null;
  profile: { plan: string; edit_count_week: number; edit_credits: number } | null;
  loading: boolean;
  profileLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  profileLoading: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

function getOrCreateUserId(): string {
  let id = localStorage.getItem("quillr_uid");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("quillr_uid", id);
  }
  return id;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = getOrCreateUserId();
    setUser({ id });
    setLoading(false);
  }, []);

  const profile = { plan: "pro", edit_count_week: 0, edit_credits: 999 };

  const signOut = async () => {
    localStorage.removeItem("quillr_uid");
    setUser(null);
  };

  const refreshProfile = async () => {};

  return (
    <AuthContext.Provider value={{ user, profile, loading, profileLoading: false, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
