"use client";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import CopyButton from "./copy-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import WalleetModal from "./wallet-modal";
import { useState } from "react";

interface Wallet {
  index?: number;
  walletName: string;
  publicKey: string;
}

interface WalletSheetProps {
  wallet: Wallet;
}

function WalletSheet({ wallet }: WalletSheetProps) {
  const [option, setOption] = useState<"show-key" | "remove">("show-key");

  const truncateAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <SheetContent className='w-full overflow-auto sm:max-w-md p-0 bg-background'>
      <Dialog>
        <SheetHeader className='px-6 py-4 border-b border-border'>
          <div className='flex items-center gap-3'>
            <SheetClose asChild>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <ArrowLeft className='h-4 w-4' />
              </Button>
            </SheetClose>
            <SheetTitle className='text-lg font-semibold'>
              Wallets ({wallet.walletName})
            </SheetTitle>
          </div>
        </SheetHeader>
        <WalleetModal option={option} walletIndex={wallet.index!} />

        <div className='flex flex-col'>
          <div
            key={wallet.publicKey}
            className='border-b border-border last:border-b-0'>
            <div className='px-6 py-4'>
              <h2 className='text-base font-semibold mb-3'>
                {wallet.walletName}
              </h2>

              <div className='flex items-center w-full mx-auto justify-between bg-[#171717] px-6 py-4 h-auto rounded-xl hover:bg-muted/50'>
                <div>
                  <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                    Wallet Address
                  </h3>
                  <p className='text-base font-medium'>
                    {truncateAddress(wallet.publicKey)}
                  </p>
                </div>
                <CopyButton text={wallet.publicKey} />
              </div>
            </div>

            <div className='flex px-6 pb-4 flex-col gap-3'>
              <DialogTrigger>
                <span
                  onClick={() => setOption("show-key")}
                  className='flex cursor-pointer items-center w-full mx-auto justify-between bg-[#171717] px-6 py-4 h-auto rounded-xl hover:bg-muted/50'>
                  <span className='text-base font-medium'>
                    Show Private Key
                  </span>
                  <ChevronRight className='h-4 w-4 text-muted-foreground' />
                </span>
              </DialogTrigger>

              <Button
                variant='ghost'
                className='flex items-center w-full mx-auto justify-between bg-[#171717] px-6 py-4 h-auto rounded-xl hover:bg-muted/50'>
                <span className='text-base font-medium text-destructive'>
                  Remove Wallet
                </span>
                <ChevronRight className='h-4 w-4 text-muted-foreground' />
              </Button>

              <Button
                variant='ghost'
                className='flex items-center w-full mx-auto justify-between bg-[#171717] px-6 py-4 h-auto rounded-xl hover:bg-muted/50'>
                <span className='text-base font-medium'>View Wallet</span>
                <ChevronRight className='h-4 w-4 text-muted-foreground' />
              </Button>
            </div>
          </div>

          {/* {walletData.length === 0 && (
          <div className='px-6 py-8 text-center'>
            <p className='text-muted-foreground'>No wallets found</p>
          </div>
        )} */}
        </div>
      </Dialog>
    </SheetContent>
  );
}

export default WalletSheet;
