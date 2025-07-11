"use client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { SiSolana } from "react-icons/si";
import { FaEthereum } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import WalletSheet from "./wallet-sheet";

import { Sheet, SheetTrigger } from "./ui/sheet";
import { useState } from "react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import CopyButton from "./copy-button";

interface Wallet {
  index?: number;
  walletName: string;
  publicKey: string;
}

interface WalletProp {
  allWallets: Wallet[];
}

function WalletButton({ allWallets }: WalletProp) {
  const [activeWallet, setActiveWallet] = useState<Wallet>({
    walletName: "",
    publicKey: "",
  });

  const [selectedWallet, setSelectedWallet] = useState<Wallet>({
    walletName: "",
    publicKey: "",
  });

  function handleSetActiveWallet(wallet: Wallet) {
    console.log(wallet);
    setActiveWallet({ ...wallet });
  }

  function handleSelectedWallet(wallet: Wallet, index: number) {
    setSelectedWallet({ ...wallet, index });
  }

  return (
    <>
      <div className='space-y-2'>
        <Drawer>
          <div className=' mt-3 w-full flex justify-center'>
            <div className='flex gap-4 items-center'>
              <SiSolana className='text-emerald-600 ' />
              <div className='h-8'>
                <Separator orientation='vertical' className='dark:bg-white  ' />
              </div>
              <DrawerTrigger className='text-xl cursor-pointer'>
                {activeWallet.walletName || "wallet 1"}
              </DrawerTrigger>
              <div className='h-8'>
                <Separator orientation='vertical' className='dark:bg-white  ' />
              </div>
              <span className='flex flex-col '>
                <CopyButton text={activeWallet.publicKey} />
                <span className=' opacity-30'>
                  {activeWallet.publicKey.substring(0, 8)}...{" "}
                </span>
              </span>
            </div>
          </div>
          <DrawerContent className='h-full'>
            <div className='bg-[#66666661] h-3  mx-auto w-[150px] rounded-2xl'></div>
            <DrawerHeader>
              <DrawerTitle>Wallets</DrawerTitle>
            </DrawerHeader>
            <Sheet>
              <div className='flex flex-col gap-5 w-full items-center overflow-auto'>
                <Link href={"/add-wallet"}>
                  <Button
                    variant='default'
                    className='flex  mb-2 items-center w-[300px] mx-auto  bg-[#171717] px-6 py-4 h-auto rounded-xl  hover:bg-muted/50'>
                    <Plus className='size-6  text-emerald-400' />
                    <span className='text-base font-medium'>Add Wallet</span>
                  </Button>
                </Link>
                {allWallets.map((wallet, index) => (
                  <div
                    key={index}
                    onClick={() => handleSetActiveWallet(wallet)}
                    className='dark:bg-[#1b1b1b] cursor-pointer dark:text-[#d4d2d2] pl-5 pr-5 text-black bg-[#fff] flex items-center justify-between w-[300px] mx-auto p-4 rounded-md shadow-md'>
                    <SiSolana />
                    <div>
                      <p className='text-xl '>{wallet.walletName} </p>
                      <p>{wallet.publicKey.substring(0, 12)}...</p>
                    </div>
                    <SheetTrigger
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectedWallet(wallet, index);
                      }}>
                      <HiOutlineDotsVertical className='size-6 cursor-pointer' />
                    </SheetTrigger>
                  </div>
                ))}
              </div>

              <WalletSheet wallet={selectedWallet} />
            </Sheet>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}

export default WalletButton;
