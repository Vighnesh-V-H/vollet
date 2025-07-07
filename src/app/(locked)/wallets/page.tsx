"use client";

import WalletButton from "@/components/wallets";
import { useAuth } from "@/context/auth-context";
import { getWallets } from "@/lib/wallet";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Wallets() {
  const { isNewUser, isUnlocked } = useAuth();
  const router = useRouter();

  const [wallets, setWallets] = useState<
    { walletName: string; publicKey: string }[]
  >([]);

  useEffect(() => {
    async function getWallet() {
      const result = await getWallets();
      setWallets(result);
      return result;
    }
    const wallet = getWallet();
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      router.push("/wallets");
    } else if (!isNewUser()) {
      router.push("/");
    } else {
      router.push("/unlock");
    }
  }, [isNewUser, isUnlocked, router]);

  return (
    <div>
      <WalletButton allWallets={wallets} />
    </div>
  );
}

export default Wallets;
