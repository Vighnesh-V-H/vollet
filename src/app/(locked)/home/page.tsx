"use client";

import { useAuth } from "@/context/auth-context";
import { generateMnemonic } from "bip39";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Home() {
  const { isNewUser, isUnlocked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isUnlocked) {
      router.push("/home");
      return;
    }
    if (!isNewUser()) {
      router.push("/");
    } else {
      router.push("/unlock");
    }
  }, [isNewUser]);

  return <div>home</div>;
}

export default Home;
