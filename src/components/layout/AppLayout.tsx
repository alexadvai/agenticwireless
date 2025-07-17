'use client';
import React from 'react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Wifi, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <h2 className="text-xl font-bold text-foreground">AgenticWireless</h2>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/wireless-scanner">
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/wireless-scanner')}
                  tooltip="Wireless Scanner"
                >
                  <div>
                    <Wifi />
                    <span>Wireless Scanner</span>
                  </div>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          {user && (
            <div className="flex items-center gap-3 p-3 border-t">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint="profile picture" />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm">
                <span className="font-semibold">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full">
            <header className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <SidebarTrigger className="md:hidden" />
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Wireless Scanner</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="outline">v1.0.0</Badge>
                </div>
            </header>
            <main className="flex-grow">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
