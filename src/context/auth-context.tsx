"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { hashPassword } from "@/lib/crypto";
import { isNewUser } from "@/lib/user";

interface AuthContextType {
  isUnlocked: boolean;
  unlock: (password: string) => Promise<boolean>;
  lock: () => void;
  isNewUser: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const alreadyUnlocked = sessionStorage.getItem("isUnlocked");
    if (alreadyUnlocked === "true") {
      setIsUnlocked(true);
    }
  }, []);

  const isNewUser = () => {
    const walletMeta = localStorage.getItem("lockMeta");
    if (walletMeta) {
      return true;
    } else {
      return false;
    }
  };

  const unlock = async (password: string) => {
    const stored = localStorage.getItem("lockMeta");
    if (!stored) return false;

    const { salt, passwordVerifier } = JSON.parse(stored);
    const actualVerifier = await hashPassword(password, salt);

    if (actualVerifier === passwordVerifier) {
      setIsUnlocked(true);
      sessionStorage.setItem("isUnlocked", "true"); // persist for tab reloads
      return true;
    } else {
      return false;
    }
  };

  const lock = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem("isUnlocked");
    router.push("/unlock");
  };

  return (
    <AuthContext.Provider value={{ isUnlocked, unlock, lock, isNewUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
