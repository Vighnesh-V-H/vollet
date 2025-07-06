"use client";

import { useState } from "react";
import { ArrowLeft, ChevronRight, Copy, Check } from "lucide-react";
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import CopyButton from "./copy-button";

interface Wallet {
  blockChainName: string;
  publicKey: string;
}

interface WalletSheetProps {
  walletData: Wallet;
}

function WalletSheet({ walletData }: WalletSheetProps) {
  const truncateAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <SheetContent className='w-full sm:max-w-md p-0 bg-background'>
      <SheetHeader className='px-6 py-4 border-b border-border'>
        <div className='flex items-center gap-3'>
          <SheetClose asChild>
            <Button variant='ghost' size='icon' className='h-8 w-8'>
              <ArrowLeft className='h-4 w-4' />
            </Button>
          </SheetClose>
          <SheetTitle className='text-lg font-semibold'>Wallet 1</SheetTitle>
        </div>
      </SheetHeader>

      <div className='flex flex-col'>
        <div className='px-6 py-4 '>
          <div
            className='flex items-center w-full mx-auto justify-between
          bg-[#171717] px-6 py-4 h-auto rounded-xl hover:bg-muted/50'>
            <div>
              <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                Wallet Address
              </h3>
              <p className='text-base font-medium'>
                {truncateAddress(walletData.publicKey)}
              </p>
            </div>
            <CopyButton text={walletData.publicKey} />
          </div>
        </div>

        {/* Menu Items */}
        <div className='flex px-6 mt-5 flex-col gap-5'>
          <Button
            variant='default'
            className='flex items-center w-full mx-auto justify-between bg-[#171717] px-6 py-4 h-auto rounded-xl  hover:bg-muted/50'>
            <span className='text-base font-medium'>Show Private Key</span>
            <ChevronRight className='h-4 w-4 text-muted-foreground' />
          </Button>

          <Button
            variant='ghost'
            className='flex items-center  w-full mx-auto justify-between bg-[#171717] px-6 py-4 h-auto rounded-xl  hover:bg-muted/50'>
            <span className='text-base font-medium text-destructive'>
              Remove Wallet
            </span>
            <ChevronRight className='h-4 w-4 text-muted-foreground' />
          </Button>

          <Button
            variant='ghost'
            className='flex items-center  w-full mx-auto justify-between bg-[#171717] px-6 py-4 h-auto rounded-xl  hover:bg-muted/50'>
            <span className='text-base font-medium'>View Wallet</span>
            <ChevronRight className='h-4 w-4 text-muted-foreground' />
          </Button>
        </div>
      </div>
    </SheetContent>
  );
}

export default WalletSheet;
