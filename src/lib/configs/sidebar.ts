import { LucideIcon, Wallet2, UserCircle, Lock } from "lucide-react";

export interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export const sidebarConfig: SidebarSection[] = [
  {
    title: "MENU",
    items: [
      {
        title: "wallets",
        url: "/wallets",
        icon: Wallet2,
      },
      {
        title: "Account",
        url: "/account",
        icon: UserCircle,
      },

      {
        title: "Lock",
        url: "/",
        icon: Lock,
      },
    ],
  },
];
