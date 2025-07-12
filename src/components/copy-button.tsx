"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  text: string;
  type?: "icon" | "button";
}

function CopyButton({ text, type = "icon" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log(err);
    }
  };

  if (type === "button") {
    return (
      <Button
        variant='default'
        onClick={copyToClipboard}
        className='text-center flex items-center w-full dark:text-[#212121] mx-auto justify-center bg-[#fff] h-auto rounded-xl hover:bg-muted/50'>
        {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
        {copied ? "Copied!" : "Copy"}
      </Button>
    );
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={copyToClipboard}
      className='h-8 w-8 text-muted-foreground hover:text-foreground'>
      {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
    </Button>
  );
}

export default CopyButton;
