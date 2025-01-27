"use client";

import { useState } from "react";
import { ReactNode } from 'react';
import { Sidebar, SidebarContext } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Menu, Rocket } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="min-h-screen create-page-background text-white">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 border-b border-purple-800/20 bg-gradient-to-r from-purple-950/50 via-black/50 to-black/50 backdrop-blur-xl z-50">
          <div className="flex h-16 items-center px-4 justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(!collapsed)}
                className="text-purple-300 hover:text-white hover:bg-purple-900/50"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <Link href="/dashboard"> 
              <div className="flex items-center gap-2">
                {/* Wrap the div with Link */}
                  <Rocket className="h-6 w-6 text-purple-600" />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#d550ac] to-[#7773FA] bg-clip-text text-transparent hidden md:block">
                    Influencer AI
                  </h2>
                
              </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10"
                  }
                }}
              />
            </div>
          </div>
        </nav>

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div
          className={`transition-all duration-300 pt-16 ${
            collapsed ? "ml-20" : "ml-64"
          }`}
        >
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

export default DashboardLayout;