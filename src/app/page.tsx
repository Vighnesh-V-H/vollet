"use client";

import Blockchains from "@/components/blockchains";
import Header from "@/components/header";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isNewUser, isUnlocked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isUnlocked) {
      router.push("/wallets");
      return;
    }

    if (!isNewUser()) {
      router.push("/");
    } else {
      router.push("/unlock");
    }
  }, [isNewUser, isUnlocked, router]);

  return (
    <div className='flex flex-col gap-8 dark:bg-black bg-white h-screen  items-center w-screen '>
      <Header />

      <Blockchains />
    </div>
  );
}
