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
import { usePathname } from "next/navigation";

export function SidebarOptions() {
  const pathname = usePathname();

  return (
    <>
      {sidebarConfig.map((section, index) => (
        <SidebarGroup
          key={section.title}
          className={cn("space-y-2", index > 0 && "mt-8")}>
          <SidebarGroupLabel className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3'>
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
                    <Link
                      href={item.url}
                      className='flex items-center gap-3 w-full'>
                      <item.icon className='h-5 w-5 shrink-0' />
                      <span className='group-data-[collapsible=icon]:hidden font-medium'>
                        {item.title}
                      </span>
                      {/* {item.badge && (
                        <SidebarMenuBadge className='ml-auto bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded-full text-xs'>
                          {item.badge}
                        </SidebarMenuBadge>
                      )} */}
                    </Link>
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
