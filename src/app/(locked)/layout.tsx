import { AppSidebar } from "@/components/sidebar/sidebar";

import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipGlobal } from "@/components/tooltip-global";
import { NavUser } from "@/components/nav-user";
import { Toaster } from "sonner";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-screen dark:bg-[#191818] dark:text-white bg-[#ffffff] text-background flex overflow-hidden'>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset className='flex flex-col w-full'>
          <header className='flex h-16 dark:bg-[#191818] dark:text-white bg-[#ffffff] text-background shrink-0 border-b border-border/40 justify-between items-center gap-2 px-4'>
            <div className='flex items-center gap-2 px-4'>
              <TooltipGlobal content='Toggle sidebar'>
                <SidebarTrigger className='-ml-1 md:hidden ' />
              </TooltipGlobal>

              <Separator
                orientation='vertical'
                className='mr-2 bg-border h-4'
              />
            </div>
            <div className='flex  items-center gap-3 mr-4'>
              <ThemeToggle />
              <NavUser />
            </div>
          </header>
          <main className='flex-1 dark:bg-[#191818] dark:text-white bg-[#ffffff] text-background overflow-auto p-6 '>
            {children}
            <Toaster />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default Layout;
