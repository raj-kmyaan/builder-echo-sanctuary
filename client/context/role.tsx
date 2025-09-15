import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type UserRole = "student" | "faculty" | "admin";

export type User = {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
};

type RoleContextType = {
  user: User;
  setRole: (role: UserRole) => void;
};

const defaultUser: User = {
  id: "u_001",
  name: "Alex Johnson",
  role: "student",
  avatarUrl: "/default-avatar.png",
};

const RoleContext = createContext<RoleContextType | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser);

  useEffect(() => {
    const saved = localStorage.getItem("compass:user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as User;
        setUser(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("compass:user", JSON.stringify(user));
  }, [user]);

  const setRole = (role: UserRole) => setUser((u) => ({ ...u, role }));

  const value = useMemo(() => ({ user, setRole }), [user]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
