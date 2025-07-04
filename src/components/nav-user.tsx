"use client";

import {
  Check,
  ChevronsUpDown,
  Lock,
  Plus,
  Search,
  Settings,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { fetchUsers } from "@/lib/user";
import { useEffect, useState } from "react";

interface User {
  hasMnemonic: boolean;
  mnemonicCreatedAt: number;
  username: string;
  uuid: string;
}

interface UserData {
  activeUser: User;
  users: User[];
}

export function NavUser() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { isMobile } = useSidebar();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const result = await fetchUsers();
        if (result) {
          setUserData(result);
          console.log(result);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers =
    userData?.users.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (username: string) => {
    // Use emerald colors for avatars
    const colors = [
      "bg-emerald-500 dark:bg-emerald-600",
      "bg-emerald-400 dark:bg-emerald-700",
      "bg-emerald-600 dark:bg-emerald-500",
      "bg-emerald-700 dark:bg-emerald-400",
      "bg-emerald-800 dark:bg-emerald-300",
    ];
    const index = username.length % colors.length;
    return colors[index];
  };

  if (!userData) {
    return (
      <SidebarMenu className='bg-white dark:bg-black rounded-lg'>
        <SidebarMenuItem className='bg-white dark:bg-black text-black dark:text-white rounded-lg'>
          <SidebarMenuButton
            size='lg'
            className='bg-white dark:bg-black text-black dark:text-white rounded-lg'>
            <Avatar className='h-8 w-8 rounded-lg'>
              <AvatarFallback className='rounded-lg'>...</AvatarFallback>
            </Avatar>
            <div className='hidden md:grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>Loading...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu className='bg-transparent rounded-lg'>
      <SidebarMenuItem className='bg-transparent   text-black dark:text-white rounded-lg'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='bg-transparent cursor-pointer  text-black dark:text-white rounded-lg'>
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarFallback
                  className={`rounded-lg text-white ${getAvatarColor(
                    userData.activeUser.username
                  )}`}>
                  {getInitials(userData.activeUser.username)}
                </AvatarFallback>
              </Avatar>
              <div className='hidden md:grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {userData.activeUser.username}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[280px] bg-white dark:bg-black text-black dark:text-white min-w-56 p-2 border border-gray-200 dark:border-gray-800'
            side={isMobile ? "bottom" : "right"}
            align='end'
            sideOffset={4}>
            {/* Search Input */}
            <div className='relative mb-2'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400' />
              <Input
                placeholder='Search addresses'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-8 bg-white dark:bg-black border-gray-300 dark:border-gray-600 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400'
              />
            </div>

            <div className='space-y-1 mb-2'>
              {filteredUsers.map((user) => (
                <DropdownMenuItem
                  key={user.uuid}
                  className='flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md'>
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarFallback
                      className={`rounded-lg text-white text-sm ${getAvatarColor(
                        user.username
                      )}`}>
                      {getInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <span className='flex-1 font-medium'>{user.username}</span>
                  {user.uuid === userData.activeUser.uuid && (
                    <Check className='h-4 w-4 text-emerald-500 dark:text-emerald-400' />
                  )}
                </DropdownMenuItem>
              ))}
            </div>

            {/* Add Account */}
            <DropdownMenuItem className='flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md mb-2'>
              <div className='h-8 w-8 rounded-lg bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center'>
                <Plus className='h-4 w-4 text-white' />
              </div>
              <span className='font-medium'>Add Account</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className='bg-gray-200 dark:bg-gray-700' />

            <DropdownMenuItem className='flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md'>
              <Settings className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
              <span>Settings</span>
            </DropdownMenuItem>

            {/* Lock */}
            <DropdownMenuItem className='flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md'>
              <Lock className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
              <span>Lock</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
