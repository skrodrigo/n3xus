"use client";

import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { NavChatHistory } from "../chat/nav-chat-history";
import { Button } from "../ui/button";
import { SidebarSearch } from "./sidebar-search";
import Link from "next/link";
import { useEffect, useState } from "react";
import { chatsService } from "@/server/chats";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  chats: { id: string; title: string }[];
}

export default function AppSidebar({ chats: initialChats, ...props }: AppSidebarProps) {
  const [chats, setChats] = useState(initialChats);

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (!token) return;
    chatsService.list(token).then((res) => {
      const data = res?.data;
      if (Array.isArray(data)) setChats(data);
    }).catch(() => { });
  }, []);

  return (
    <div className="border border-border rounded-2xl">
      <Sidebar variant="floating" {...props}>
        < SidebarHeader >
          <div className="flex items-center gap-2">
            <Image src="/logos/nexus.svg" alt="Logo" width={24} height={24} priority quality={100} className="m-2" />
            <h1 className="font-medium">Nexus</h1>
          </div>
          <Link href="/chat" className="mt-6">
            <Button size="icon" className="w-full font-medium bg-accent border hover:bg-accent/80 border-[#3f3f3f] text-foreground">Novo Chat</Button>
          </Link>
        </SidebarHeader >
        <SidebarContent>
          <SidebarSearch chats={chats} />
          <NavChatHistory chats={chats} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={{ name: 'User', email: '', avatar: '' }} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar >
    </div>
  )
}
