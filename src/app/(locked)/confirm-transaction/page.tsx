"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sendSOL } from "@/lib/transactions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function ConfirmTransactionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const index = searchParams.get("index");
  const amt = searchParams.get("amount");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  if (
    !from ||
    !to ||
    !index ||
    !amt ||
    isNaN(Number(index)) ||
    isNaN(Number(amt))
  ) {
    window.location.replace("/send");
    return (
      <div className='text-red-800'>
        Invalid transaction ...
        <div> redirecting to send</div>
      </div>
    );
  }

  const handleCancel = () => {
    router.push("/send");
  };

  const handleSend = async () => {
    setLoading(true);
    setStatusMessage("Sending transaction...");

    try {
      const res = await sendSOL(Number(index), to, Number(amt));
      if (res.startsWith("failed") || res.includes("went wrong")) {
        setStatusMessage("❌ Transaction failed.");
        toast.error("Transaction failed. Please try again.");
      } else {
        setStatusMessage("✅ Transaction confirmed!");
        toast.success(`Transaction successful: ${res}`);
        setTimeout(() => {
          router.push("/wallets");
        }, 1500);
      }
    } catch (err) {
      setStatusMessage("❌ Something went wrong.");
      toast.error("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='max-w-lg mx-auto bg-white dark:bg-[#181818] border-gray-200 dark:border-gray-800 p-4 sm:p-6 md:p-8'>
      <CardHeader>
        <CardTitle className='text-center text-gray-900 dark:text-white text-lg sm:text-xl md:text-2xl'>
          Confirm Transaction
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4 max-w-md'>
        <div className='space-y-3'>
          <div className='flex flex-col justify-between sm:flex-row sm:justify-between sm:items-center p-3 rounded-lg bg-gray-50 dark:bg-[#171717]'>
            <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>
              To:
            </span>
            <span className='text-sm sm:ml-2 text-gray-900 dark:text-white font-mono break-all'>
              {to}
            </span>
          </div>
          <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 rounded-lg bg-gray-50 dark:bg-[#171717]'>
            <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>
              Amount:
            </span>
            <span className='text-lg font-semibold text-gray-900 dark:text-white'>
              {amt} SOL
            </span>
          </div>
        </div>

        {loading && (
          <div className='flex flex-col items-center justify-center py-8 space-y-4'>
            <div className='relative'>
              <Loader2 className='h-12 w-12 animate-spin text-emerald-600' />
              <div className='absolute inset-0 rounded-full border-4 border-emerald-100 dark:border-emerald-900'></div>
            </div>
            <div className='text-sm text-center text-gray-700 dark:text-gray-300'>
              {statusMessage}
            </div>
          </div>
        )}

        {/* Status Message (when not loading) */}
        {statusMessage && !loading && (
          <div className='text-sm text-center py-2 text-gray-700 dark:text-gray-300'>
            {statusMessage}
          </div>
        )}

        <div className='flex flex-col sm:flex-row gap-3 pt-4 w-full mx-auto sm:w-full'>
          <Button
            onClick={handleCancel}
            variant='outline'
            disabled={loading}
            className='sm:w-1/2 w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#171717]'>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={loading}
            className='sm:w-1/2 w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50'>
            {loading ? (
              <div className='flex items-center space-x-2'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <span>Sending...</span>
              </div>
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ConfirmTransaction() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmTransactionContent />
    </Suspense>
  );
}

export default ConfirmTransaction;
