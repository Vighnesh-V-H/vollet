"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Check, Copy } from "lucide-react";

function CopyButton({ text }: { text: string }) {
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
