"use client";

import { convertSOLtoUSD, getBalance } from "@/lib/wallet";
import type { Wallet } from "@/types/wallet";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletIcon, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DisplayBalanceProps {
  wallet: Wallet;
}

function DisplayBalance({ wallet }: DisplayBalanceProps) {
  const [balance, setBalance] = useState<number>(0);
  const [usdValue, setUsdValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);


  const fetchBalance = async () => {
    try {
      setError(null);
      const res = await getBalance(wallet.publicKey);
      if (res?.balance !== undefined) {
        setBalance(res.balance);
        const usd = await convertSOLtoUSD(balance);
        if (usd) setUsdValue(usd);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setError("Failed to fetch balance");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchBalance();
  };

  useEffect(() => {
    fetchBalance();
  }, [wallet.publicKey]);

  const formatBalance = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value);
  };

  const formatUSD = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <div className='w-full max-w-md mx-auto p-6 rounded-2xl bg-transparent'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <WalletIcon className='h-5 w-5 text-muted-foreground' />
            <div>
              <Skeleton className='h-5 w-24 mb-1' />
              <Skeleton className='h-4 w-20' />
            </div>
          </div>
          <Skeleton className='h-8 w-8 rounded-full' />
        </div>
        <div className='space-y-6'>
          <div>
            <Skeleton className='h-4 w-16 mb-2' />
            <Skeleton className='h-8 w-20' />
          </div>
          <div>
            <Skeleton className='h-4 w-20 mb-2' />
            <Skeleton className='h-7 w-24' />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full max-w-md mx-auto p-6 rounded-2xl bg-transparent'>
        <div className='flex items-center gap-2 text-destructive mb-4'>
          <AlertCircle className='h-5 w-5' />
          <span className='font-medium'>Error loading balance</span>
        </div>
        <p className='text-sm text-muted-foreground mb-4'>{error}</p>
        <Button
          onClick={handleRefresh}
          variant='outline'
          size='sm'
          disabled={isRefreshing}>
          {isRefreshing ? (
            <RefreshCw className='h-4 w-4 animate-spin mr-2' />
          ) : (
            <RefreshCw className='h-4 w-4 mr-2' />
          )}
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className='w-full max-w-md mx-auto p-6 rounded-2xl bg-transparent'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <WalletIcon className='h-5 w-5 text-foreground' />
          <div>
            <h3 className='text-base font-medium text-foreground'>
              Wallet Balance <span className=' opacity-20'>(devnet only)</span>
            </h3>
            <p className='text-sm text-muted-foreground'>
              {truncateAddress(wallet.publicKey)}
            </p>
          </div>
        </div>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleRefresh}
          disabled={isRefreshing}
          className='h-8 w-8 p-0 hover:bg-muted'>
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      <div className='space-y-6'>
        <div>
          <div className='text-sm text-muted-foreground mb-1'>SOL Solana</div>
          <div className='text-2xl font-medium text-foreground'>
            {formatBalance(balance)}
          </div>
        </div>

        <div>
          <div className='text-sm text-muted-foreground mb-1'>💲 USD Value</div>
          <div className='text-xl font-medium text-foreground'>
            {formatUSD(usdValue)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisplayBalance;
