"use client";

import { DialogTitle } from "@radix-ui/react-dialog";
import { DialogContent, DialogFooter, DialogHeader } from "./ui/dialog";
import { AlertTriangleIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { showPrivateKey } from "@/lib/wallet";

interface WalletModal {
  option: "show-key" | "remove";
  walletIndex: number;
}

function WalleetModal({ option, walletIndex }: WalletModal) {
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await showPrivateKey(walletIndex, password);
  }

  return (
    <DialogContent>
      {option === "show-key" && (
        <>
          <DialogHeader>
            <DialogTitle>Enter Password</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className='flex flex-col gap-5'>
              <Input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant='default'
                type='submit'
                autoFocus
                className=' text-center flex items-center w-full dark:text-[#212121] mx-auto justify-between bg-[#fff] h-auto rounded-xl hover:bg-muted/50'>
                <span className='text-base font-medium'>Show Private Key</span>
              </Button>
            </div>
          </form>

          <DialogFooter className='text-red-700'>
            Do not share this with anyone{" "}
            <AlertTriangleIcon className='text-red-700' />
          </DialogFooter>
        </>
      )}
    </DialogContent>
  );
}

export default WalleetModal;
