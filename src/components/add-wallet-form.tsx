"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addWallet, generateWallet } from "@/lib/wallet";
import { Plus, KeyRound, ChevronRight } from "lucide-react";

function AddWalletForm() {
  return (
    <Card className='w-full max-w-md mx-auto border-none bg-[#efefef]  dark:bg-[#060606] p-6 rounded-2xl dark:text-white text-black space-y-4'>
      <CardHeader className='pb-2'>
        <CardTitle className='dark:text-white text-2xl text-center font-semibold'>
          Select an Option
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-4'>
        <Button
          variant='ghost'
          onClick={async () => {
            await addWallet("501", "123456789", 1);
          }}
          className='w-full flex justify-between items-center bg-[#1a1a1a] px-6 py-4 rounded-xl hover:bg-[#2a2a2a] transition text-white'>
          <div className='flex items-center gap-3'>
            <Plus className='w-5 h-5 text-gray-400' />
            <span className='text-base font-medium'>Create New Wallet</span>
          </div>
          <ChevronRight className='w-5 h-5 text-gray-400' />
        </Button>

        <Button
          variant='ghost'
          className='w-full flex justify-between items-center bg-[#1a1a1a] px-6 py-4 rounded-xl hover:bg-[#2a2a2a] transition text-white'>
          <div className='flex items-center gap-3'>
            <KeyRound className='w-5 h-5 text-gray-400' />
            <span className='text-base font-medium'>
              Import from Private Key
            </span>
          </div>
          <ChevronRight className='w-5 h-5 text-gray-400' />
        </Button>
      </CardContent>
    </Card>
  );
}

export default AddWalletForm;
