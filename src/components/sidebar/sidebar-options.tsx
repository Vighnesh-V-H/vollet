"use client";

import { cn } from "@/lib/utils";
import { sidebarConfig } from "@/lib/configs/sidebar";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { lockUser } from "@/lib/store/indexdb";

export function SidebarOptions() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLock() {
    await lockUser();
    window.location.reload();
  }

  return (
    <>
      {sidebarConfig.map((section, index) => (
        <SidebarGroup
          key={section.title}
          className={cn("space-y-2", index > 0 && "mt-8")}>
          <SidebarGroupLabel className='text-lg font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3'>
            {section.title}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className='space-y-1'>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={cn(
                      "h-11 px-4 rounded-xl transition-all duration-200 group relative",
                      "hover:bg-accent/60 hover:text-accent-foreground hover:shadow-sm",
                      "data-[active=true]:bg-gradient-to-r data-[active=true]:from-indigo-500 data-[active=true]:to-violet-600",
                      "data-[active=true]:text-white data-[active=true]:shadow-md data-[active=true]:shadow-indigo-500/15",
                      "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                    )}
                    isActive={item.url === pathname}>
                    {item.title === "Lock" ? (
                      <span onClick={handleLock} className='cursor-pointer'>
                        <item.icon className='h-5 w-5 shrink-0' /> Lock
                      </span>
                    ) : (
                      <Link
                        href={item.url}
                        className='flex items-center gap-3 w-full'>
                        <item.icon className='h-5 w-5 shrink-0' />

                        <span className='group-data-[collapsible=icon]:hidden font-sans text-sm'>
                          {item.title}
                        </span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
