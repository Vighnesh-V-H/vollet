"use client";

import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

function Blockchains() {
  const router = useRouter();

  function handleClick(e: React.MouseEvent<HTMLButtonElement>): void {
    const id = (e.target as HTMLButtonElement).id;
    router.push(`/onboard?id=${id}`);
  }

  return (
    <>
      <div className='w-full h-full flex items-center justify-center'>
        <Card className='w-[400px] '>
          <CardHeader className='dark:text-white text-black'>
            Select a blockchain , you can always add or change later
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleClick}
              id='501'
              variant={"outline"}
              className='w-full'>
              Solana
            </Button>
          </CardContent>
          {/* <CardContent className='w-full'>
            <Button
              onClick={handleClick}
              id='60'
              variant={"outline"}
              className='w-full'>
              Etherium
            </Button>
          </CardContent> */}
        </Card>
      </div>
    </>
  );
}

export default Blockchains;
