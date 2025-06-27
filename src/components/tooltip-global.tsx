import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";

export function TooltipGlobal({
  content,
  children,
}: {
  content: string;
  children: ReactNode;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p> {content} </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
