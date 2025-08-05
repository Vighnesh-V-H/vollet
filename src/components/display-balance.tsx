"use client";

import { convertSOLtoUSD, getBalance } from "@/lib/wallet";
import type { Wallet } from "@/types/wallet";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  ArrowDown,
  ArrowUp,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

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

  if (isLoading) {
    return (
      <div className='w-full max-w-sm mx-auto bg-gradient-to-b from-slate-900 to-slate-800 text-white h-[500px] overflow-hidden'>
        <div className='p-3'>
          <Skeleton className='h-12 w-28 mx-auto mb-1 bg-[#171717]' />
          <Skeleton className='h-4 w-20 mx-auto mb-4 bg-slate-700' />
          <div className='grid grid-cols-4 gap-2 mb-4'>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className='h-14 bg-slate-700 rounded-xl' />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full max-w-lg mx-auto bg-gradient-to-b from-[#171717]  to-[#202020] text-white h-[500px] overflow-hidden flex flex-col'>
      {/* Main Content */}
      <div className='flex-1 p-3 space-y-4'>
        <div className='text-center relative'>
          <div className='flex items-center justify-center gap-1 mb-1'>
            <span className='text-3xl font-light'>{formatUSD(usdValue)}</span>
            <span className='text-sm text-gray-400 mt-1'>C</span>
          </div>
          <div className='text-gray-400 text-xs'>
            {formatUSD(usdValue)} <span className='text-gray-500'>0%</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className='absolute top-0 right-0 p-1 rounded-full hover:bg-slate-800/50 transition-colors disabled:opacity-50'
            title='Refresh balance'>
            <RefreshCw
              className={`h-4 w-4 text-gray-400 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>

        {/* Action Buttons */}
        <div className='grid grid-cols-4 gap-2'>
          <button className='flex flex-col items-center gap-1 p-2 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors'>
            <Building2 className='h-4 w-4 text-blue-400' />
            <span className='text-xs text-gray-300'>Cash</span>
          </button>
          <button className='flex flex-col items-center gap-1 p-2 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors'>
            <ArrowDown className='h-4 w-4 text-blue-400' />
            <span className='text-xs text-gray-300'>Receive</span>
          </button>
          <button className='flex flex-col items-center gap-1 p-2 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors'>
            <ArrowUp className='h-4 w-4 text-blue-400' />
            <span className='text-xs text-gray-300'>Send</span>
          </button>
          <button className='flex flex-col items-center gap-1 p-2 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors'>
            <RefreshCw className='h-4 w-4 text-blue-400' />
            <span className='text-xs text-gray-300'>Swap</span>
          </button>
        </div>

        {/* <div className='bg-slate-800/30 rounded-xl p-3 relative'>
          <div className='flex items-start gap-2'>
            <div className='flex-1'>
              <h3 className='text-white font-medium text-sm mb-1'>
                Secure your wallet
              </h3>
              <p className='text-gray-400 text-xs leading-relaxed'>
                Back up your recovery phrase to avoid losing access to your
                funds.
              </p>
            </div>
            <AlertTriangle className='h-5 w-5 text-yellow-500 flex-shrink-0' />
          </div>
        </div> */}

        {/* Token List */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between p-3 bg-slate-800/30 rounded-xl'>
            <div className='flex items-center gap-2'>
              <div className='w-7 h-7 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center'>
                <span className='text-white text-xs font-bold'>S</span>
              </div>
              <div>
                <div className='text-white font-medium text-sm'>Solana</div>
                <div className='text-gray-400 text-xs'>
                  {formatBalance(balance)} SOL
                </div>
              </div>
            </div>
            <div className='text-right'>
              <div className='text-white font-medium text-sm'>
                {formatUSD(usdValue)}
              </div>
              <div className='text-gray-400 text-xs'>{formatUSD(usdValue)}</div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className='bg-red-900/30 border border-red-500/30 rounded-xl p-3'>
            <div className='flex items-center gap-2'>
              <AlertTriangle className='h-4 w-4 text-red-400' />
              <span className='text-red-300 text-sm'>{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DisplayBalance;