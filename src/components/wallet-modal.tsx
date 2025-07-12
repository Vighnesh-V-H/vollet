"use client";


import { useState, useEffect } from "react";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";
import { showPrivateKey } from "@/lib/wallet";
import CopyButton from "./copy-button";

type ShowPrivateKeyResult =
  | { success: true; privateKey: string }
  | { success: false; error: unknown };

interface WalletModal {
  option: "show-key" | string;
  walletIndex: number;
  isOpen?: boolean;
}

function WalletModal({ option, walletIndex, isOpen }: WalletModal) {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<ShowPrivateKeyResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const response = await showPrivateKey(walletIndex, password);
    setResult(response);
  }
  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setResult(null);
    }
  }, [isOpen]);

  return (
    <DialogContent>
      {option === "show-key" && (
        <>
          <DialogHeader>
            <DialogTitle>
              {result?.success
                ? "Private Key \n (Do not show to anyone!)"
                : "Enter Password"}
            </DialogTitle>
          </DialogHeader>

          {result?.success ? (
            <div className='flex flex-col gap-4'>
              <div className='break-words text-sm bg-muted p-4 rounded-lg max-w-md'>
                <div className='font-mono text-sm bg-gray-700/40 rounded-lg p-3 leading-relaxed break-all'>
                  {result.privateKey}
                </div>
              </div>
              <CopyButton text={result.privateKey} type='button' />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className='flex flex-col gap-5'>
                <div>
                  <Input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter your password'
                  />
                  {result && !result.success && (
                    <div className='text-red-700 text-sm mt-2'>
                      Error:{" "}
                      {result.error instanceof Error
                        ? result.error.message
                        : String(result.error)}
                    </div>
                  )}
                </div>
                <Button
                  variant='default'
                  type='submit'
                  autoFocus
                  className='text-center flex items-center w-full dark:text-[#212121] mx-auto justify-between bg-[#fff] h-auto rounded-xl hover:bg-muted/50'>
                  <span className='text-base font-medium'>
                    Show Private Key
                  </span>
                </Button>
              </div>
            </form>
          )}

          <DialogFooter className='text-red-700 mt-4'>
            Do not share this with anyone{" "}
            <AlertTriangleIcon className='text-red-700 ml-2' />
          </DialogFooter>
        </>
      )}
    </DialogContent>
  );
}

export default WalletModal;
