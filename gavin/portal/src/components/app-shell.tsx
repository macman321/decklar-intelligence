"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  Menu,
  MessageSquare,
  Bot,
  PlusCircle,
  Crown,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GavinChat } from "./gavin-chat";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "customers", label: "Customers", icon: Users, href: "/customers" },
  { id: "onboard", label: "Onboard", icon: PlusCircle, href: "/onboard" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0F]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 transform border-r border-[rgba(96,56,251,0.15)] bg-[rgba(13,17,23,0.85)] backdrop-blur-xl transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b border-[rgba(96,56,251,0.15)] px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6038FB] to-[#7B5CFF] shadow-[0_0_20px_rgba(96,56,251,0.5)]">
            <span className="text-sm font-bold text-white">D</span>
          </div>
          <span className="ml-2 text-lg font-semibold text-white">Decklar</span>
        </div>
        <nav className="space-y-1 p-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[rgba(96,56,251,0.15)] text-[#7B5CFF]"
                    : "text-[rgba(255,255,255,0.7)] hover:bg-[rgba(96,56,251,0.08)] hover:text-white"
                }`}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center border-b border-[rgba(96,56,251,0.15)] bg-[rgba(13,17,23,0.85)] backdrop-blur-xl px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white/70 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-auto flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex border-[rgba(96,56,251,0.3)] bg-[rgba(96,56,251,0.1)] text-white hover:bg-[rgba(96,56,251,0.2)] hover:border-[rgba(96,56,251,0.5)]"
              onClick={() => setChatOpen(true)}
            >
              <Bot className="mr-1.5 h-4 w-4 text-[#7B5CFF]" />
              Ask Gavin
            </Button>
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium text-white">Jeffrey Calabro</p>
              <p className="text-xs text-[rgba(255,255,255,0.5)]">Account Manager</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#6038FB] to-[#7B5CFF] shadow-[0_0_15px_rgba(96,56,251,0.4)]">
              <Crown className="h-4 w-4 text-white" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>

      {/* Gavin Chat */}
      <GavinChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Mobile chat FAB */}
      <Button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-gradient-to-br from-[#6038FB] to-[#7B5CFF] shadow-[0_0_30px_rgba(96,56,251,0.5)] hover:shadow-[0_0_40px_rgba(96,56,251,0.7)] sm:hidden"
        size="icon"
      >
        <MessageSquare className="h-5 w-5 text-white" />
      </Button>
    </div>
  );
}
