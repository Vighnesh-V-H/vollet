"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { getBalance, getWallets } from "@/lib/wallet";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronDown, QrCode, AtSign, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { retrieveActiveWallet } from "@/lib/store/indexdb";
import { Wallet } from "@/types/wallet";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isNewUser } from "@/lib/user";
import { useAuth } from "@/context/auth-context";

function SendForm() {
  const [wallets, setWallets] = useState<
    { walletName: string; publicKey: string }[]
  >([]);
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [reciever, setReciever] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const [isWalletSelected, setIsWalletSelected] = useState<boolean>(false);
  const [sender, setSender] = useState<Wallet>();
  const [balance, setBalance] = useState<number>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isNewUser, isUnlocked } = useAuth();

  useEffect(() => {
    if (!isUnlocked) {
      router.push("/unlock");
    } else if (!isNewUser()) {
      router.push("/");
    }
  }, [isNewUser, isUnlocked, router]);

  useEffect(() => {
    const saved = sessionStorage.getItem("sendFormData");
    if (saved) {
      const { reciever, amount, selectedWallet } = JSON.parse(saved);
      setReciever(reciever);
      setAmount(amount);
      setSelectedWallet(selectedWallet);
      setIsWalletSelected(!!selectedWallet);
    }

    async function getWallet() {
      const result = await getWallets();
      setWallets(result);

      const sender = await retrieveActiveWallet();

      if (!sender) {
        router.push("/wallets");
        toast("Select a wallet to send from");
      } else {
        setSender(sender);
        const balance = await getBalance(sender.publicKey);
        setBalance(balance?.balance);
      }
    }
    getWallet();
  }, [router]);

  const handleWalletSelect = (wallet: {
    walletName: string;
    publicKey: string;
  }) => {
    setSelectedWallet(wallet.publicKey);
    setReciever(wallet.publicKey);
    setIsWalletSelected(true);
    setShowDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setReciever(value);
    setSelectedWallet(value);
  };

  const handleClearSelection = () => {
    setSelectedWallet("");
    setReciever("");
    setIsWalletSelected(false);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const isValidAmount = () => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Number(amount) > balance!) {
      toast.error("Insufficient balance", {
        position: "top-right",

        classNames: {
          content: "text-red-600",
        },
      });
    } else {
      sessionStorage.setItem(
        "sendFormData",
        JSON.stringify({
          reciever,
          amount,
          selectedWallet,
        })
      );

      router.push(
        `/confirm-transaction/?from=${sender?.publicKey}&to=${reciever}&amount=${amount}&index=${sender?.index}`
      );
    }
  };

  return (
    <div className='mx-auto max-w-[550px] bg-white dark:bg-[#060606] text-black dark:text-white'>
      <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800'>
        <Link href='/wallets' className='p-2'>
          <ChevronLeft className='w-6 h-6' />
        </Link>
        <h1 className='text-xl font-semibold'>Send SOL</h1>
        <div className='w-10' />
      </div>

      <div className='p-6 space-y-8'>
        <Image
          alt='solana logo'
          src='/solana-logo.png'
          width={100}
          height={100}
          className='mx-auto'
        />
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex flex-col'>
            sender
            <div className='w-full flex rounded-sm p-2 flex-col gap-1 dark:bg-[#181818] dark:text-gray-400'>
              <div className='flex gap-3'>
                <h3>{sender?.walletName}</h3>
                <h3 className='text-gray-600'>(balance:{balance} SOL)</h3>
              </div>
              <h3>{sender?.publicKey.substring(0, 14)}...</h3>
            </div>
          </div>
          <div className='space-y-2'>
            <label className='text-sm text-gray-600 dark:text-gray-400'>
              Recipient&apos;s Solana address
            </label>
            <div className='relative' ref={dropdownRef}>
              <Input
                value={reciever}
                onChange={handleInputChange}
                disabled={isWalletSelected}
                placeholder='Enter wallet address'
                className={`bg-gray-100 dark:bg-[#0c0c0c] border-gray-300 dark:border-gray-700 pr-24 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 ${
                  isWalletSelected ? "opacity-75 cursor-not-allowed" : ""
                }`}
              />
              <div className='absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2'>
                {isWalletSelected ? (
                  <Button
                    type='button'
                    onClick={handleClearSelection}
                    className='w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors'>
                    <X className='w-4 h-4' />
                  </Button>
                ) : (
                  <Popover open={showDropdown} onOpenChange={setShowDropdown}>
                    <PopoverTrigger asChild>
                      <Button
                        type='button'
                        onClick={() => setShowDropdown(!showDropdown)}
                        className='w-6 h-6 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition-colors'>
                        <AtSign className='w-4 h-4' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className='w-full p-0 max-h-60 overflow-y-auto'
                      align='end'
                      // side='top'
                      sideOffset={5}>
                      <div className='bg-white dark:bg-[#181818] border border-gray-300 dark:border-gray-700 rounded-md shadow-lg'>
                        {wallets.length > 0 ? (
                          wallets.map((wallet, index) => (
                            <div
                              key={index}
                              onClick={() => handleWalletSelect(wallet)}
                              className='p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0'>
                              <p className='font-medium text-black dark:text-white'>
                                {wallet.walletName}
                              </p>
                              <p className='text-sm text-gray-600 dark:text-gray-400'>
                                {wallet.publicKey.substring(0, 12)}...
                                {wallet.publicKey.substring(
                                  wallet.publicKey.length - 4
                                )}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className='p-3 text-center text-gray-500 dark:text-gray-400'>
                            No wallets available
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-sm text-gray-600 dark:text-gray-400'>
              Amount
            </label>
            <div className='relative'>
              <Input
                value={amount}
                onChange={handleAmountChange}
                placeholder='0.00'
                className='bg-gray-100 dark:bg-[#0c0c0c] border-gray-300 dark:border-gray-700 pr-20 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400'
              />
              <div className='absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2'>
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  SOL
                </span>
              </div>
            </div>
          </div>

          <Button
            type='submit'
            className='w-full bg-emerald-800 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium'
            disabled={!selectedWallet || !isValidAmount()}>
            Send SOL
          </Button>
        </form>
      </div>
    </div>
  );
}

export default SendForm;
