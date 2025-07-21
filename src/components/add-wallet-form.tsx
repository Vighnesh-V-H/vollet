"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { decryptStoredPassword } from "@/lib/password";
import { addWallet } from "@/lib/wallet";
import { Plus, KeyRound, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function AddWalletForm() {
  const router = useRouter();
  async function handleAddWallet() {
    try {
      const derivedPassword = await decryptStoredPassword(process.env.SECRET!);

      if (derivedPassword) {
        console.log(derivedPassword);
        const result = await addWallet("501", derivedPassword);

        toast(result, {
          style: { backgroundColor: "black" },
          classNames: {
            content: " text-emerald-200",
          },
        });
        router.push("/wallets");
      } else {
        router.push("unlock");
      }
    } catch (error) {
      toast("Error while creating a new wallet , try again", {
        style: { backgroundColor: "black" },
        classNames: { content: "text-red-500" },
      });
    }
  }

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
          onClick={handleAddWallet}
          className='w-full flex justify-between items-center bg-[#1a1a1a] px-6 py-4 rounded-xl hover:bg-[#2a2a2a] transition text-white'>
          <div className='flex items-center gap-3'>
            <Plus className='w-5 h-5 text-gray-400' />
            <span className='text-base font-medium'>Create New Wallet</span>
          </div>
          <ChevronRight className='w-5 h-5 text-gray-400' />
        </Button>

        <Button
          variant='ghost'
          className='w-full flex opacity-15 cursor-not-allowed justify-between items-center bg-[#1a1a1a] px-6 py-4 rounded-xl hover:bg-[#2a2a2a] transition text-white'>
          <div className='flex items-center gap-3'>
            <KeyRound className='w-5 h-5 text-gray-400' />
            <span className='text-base font-medium '>
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
