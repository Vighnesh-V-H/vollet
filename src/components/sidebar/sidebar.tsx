"use client";

import type * as React from "react";
import { ChevronLeft, WalletMinimal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarOptions } from "@/components/sidebar/sidebar-options";
import { TooltipGlobal } from "@/components/tooltip-global";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar, setOpen, open } = useSidebar();

  function handleSidebarClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    if (!open) {
      setOpen(true);
    }
  }

  return (
    <Sidebar
      collapsible='icon'
      variant='floating'
      onClick={handleSidebarClick}
      className={`${
        !open ? "cursor-e-resize" : ""
      } border border-border/40 dark:border-border/20 bg-background/95 dark:bg-background/90 backdrop-blur-sm rounded-2xl shadow-lg m-1  overflow-hidden`}
      {...props}>
      <SidebarHeader className=' pb-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center  gap-3'>
            <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-300 dark:from-emerald-800 dark:to-emerald-700 shadow-lg dark:shadow-emerald-500/20'>
              <WalletMinimal className='h-5 w-5' />
            </div>
            <span className='font-bold text-xl group-data-[collapsible=icon]:hidden bg-gradient-to-r from-emerald-400 to-emerald-800 dark:from-emerald-700 dark:to-emerald-400 bg-clip-text text-transparent'>
              Vollet
            </span>
          </div>
          <TooltipGlobal content='Toggle sidebar'>
            <Button
              variant='ghost'
              size='icon'
              onClick={toggleSidebar}
              className={cn(
                "h-8 w-8 rounded-lg transition-transform duration-300 hover:bg-accent/50",
                open ? "" : "rotate-180"
              )}>
              <ChevronLeft className='h-4 w-4' />
            </Button>
          </TooltipGlobal>
        </div>
      </SidebarHeader>

      <SidebarContent className='py-2 space-y-2'>
        <SidebarOptions />
      </SidebarContent>
    </Sidebar>
  );
}
