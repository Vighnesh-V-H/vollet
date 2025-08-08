"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function ConfirmTransaction() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const index = searchParams.get("index");
  const amt = searchParams.get("amount");

  const handleCancel = () => {
    router.push("/send");
  };

  const handleSend = () => {
    // Add your send logic here
    console.log("Transaction sent");
  };

  return (
    <Card className=' max-w-lg mx-auto bg-white dark:bg-[#181818] border-gray-200 dark:border-gray-800 p-4 sm:p-6 md:p-8'>
      <CardHeader>
        <CardTitle className='text-center text-gray-900 dark:text-white text-lg sm:text-xl md:text-2xl'>
          Confirm Transaction
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-4 max-w-md'>
        <div className='space-y-3'>
          {/* If you want to show 'From', just uncomment */}
          {/* <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 rounded-lg bg-gray-50 dark:bg-[#171717]">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">From:</span>
            <span className="text-sm text-gray-900 dark:text-white font-mono break-all">{from}</span>
          </div> */}

          <div className='flex flex-col justify-between sm:flex-row sm:justify-between sm:items-center p-3 rounded-lg bg-gray-50 dark:bg-[#171717]'>
            <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>
              To:
            </span>
            <span className='text-sm  sm:ml-2 text-gray-900 dark:text-white font-mono break-all'>
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

        <div className='flex flex-col sm:flex-row gap-3 pt-4 w-full mx-auto sm:w-full'>
          <Button
            onClick={handleCancel}
            variant='outline'
            className='sm:w-1/2 w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#171717]'>
            Cancel
          </Button>

          <Button
            onClick={handleSend}
            className='sm:w-1/2 w-full bg-emerald-600 hover:bg-emerald-700 text-white'>
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ConfirmTransaction;
