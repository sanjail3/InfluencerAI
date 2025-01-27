"use client"

import React, { useEffect, useState } from 'react';
import { createContext, useContext } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { 
  FolderKanban,
  Calendar,
  HelpCircle,
  Settings,
  Crown,
  Zap
} from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface ProgressIndicatorProps {
  remaining: number;
  max: number;
  collapsed: boolean;
}

const ProgressIndicator = ({ remaining, max, collapsed }: ProgressIndicatorProps) => {
  const percentage = (remaining / max) * 100;
  
  return (
    <div className={cn(
      "w-full px-4 mb-4",
      collapsed ? "px-2" : "px-4"
    )}>
      <div className="space-y-2">
        {!collapsed && (
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-white">Credits Remaining</span>
            <span className="text-base font-bold text-white">
              {remaining}/{max}
            </span>
          </div>
        )}
        <div className="relative">
          <div className="h-3 bg-pink-950/30 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-pink-400 to-pink-300 rounded-full transition-all duration-300 ease-in-out shadow-lg shadow-pink-500/20"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="absolute -top-1.5 left-0 w-full">
            <div 
              className="h-6 flex items-center"
              style={{ marginLeft: `${percentage}%` }}
            >
              <div className="relative">
                <Zap 
                  className="h-5 w-5 text-pink-300 -ml-2.5 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" 
                  fill="#ec4899"
                />
                <div className="absolute inset-0 animate-ping">
                  <Zap 
                    className="h-5 w-5 text-pink-400 opacity-40" 
                    fill="#ec4899"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {collapsed && (
          <Tooltip>
            <TooltipTrigger>
              <div className="w-full h-1" />
            </TooltipTrigger>
            <TooltipContent side="right" className="flex flex-col gap-1">
              <p className="text-xl text-pink font-bold">Credits Remaining</p>
              <p className="text-xl text-pink font-bold">{remaining}/{max} Credits</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

const sidebarItems = [
  {
    title: "Projects",
    icon: FolderKanban,
    href: "/dashboard/projects",
  },
  {
    title: "Social Schedule",
    icon: Calendar,
    href: "/schedule",
  },
  {
    title: "Help",
    icon: HelpCircle,
    href: "/help",
  },
  {
    title: "Billing",
    icon: Settings,
    href: "/dashboard/myaccount",
  },
];

export const SidebarContext = createContext({
  collapsed: false,
  setCollapsed: (collapsed: boolean) => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function Sidebar() {
  const { collapsed } = useSidebar();
  const [userData, setUserData] = useState<{
    current: number;
    max: number;
    hasSubscription: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/credits');
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const currentCredits = userData?.current ?? 0;
  const maxCredits = userData?.max ?? 10;
  const creditsRemaining= maxCredits - currentCredits;
  const hasSubscription = userData?.hasSubscription ?? false;

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex flex-col h-[calc(100vh-4rem)] fixed left-0 top-16 bottom-0 bg-gradient-to-b from-purple-950/50 via-black/50 to-black/50 border-r border-purple-800/20 backdrop-blur-xl transition-all duration-300 z-40",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex-1 py-8">
          {sidebarItems.map((item) => (
            <Link key={item.title} href={item.href} passHref>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-4 p-4 mb-3 text-white hover:text-white hover:bg-purple-900/50 relative group",
                  collapsed ? "justify-center" : "text-base font-semibold"
                )}
              >
                <item.icon className="h-6 w-6" />
                {!collapsed && <span className="text-base font-semibold tracking-wide">{item.title}</span>}
                {collapsed && (
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="absolute left-full ml-2 px-3 py-2 bg-purple-900 rounded-md text-white text-base font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        {item.title}
                      </div>
                    </TooltipTrigger>
                  </Tooltip>
                )}
              </Button>
            </Link>
          ))}
        </div>

        <div className="border-t border-purple-800/20">
        <ProgressIndicator 
            remaining={currentCredits} 
            max={maxCredits} 
            collapsed={collapsed} 
          />
          <div className="p-4">
            <SidebarItem
              icon={<Crown className="text-yellow-500 h-6 w-6" />}
              text="Upgrade Plan"
              expanded={!collapsed}
              isPro={!hasSubscription}
              href="/dashboard/myaccount"
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  expanded: boolean;
  isPro?: boolean;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}

function SidebarItem({
  icon,
  text,
  expanded,
  isPro = false,
  active = false,
  href,
  onClick,
}: SidebarItemProps) {
  const buttonContent = (
    <Button
      variant="ghost"
      className={`w-full relative group ${
        expanded ? 'justify-start' : 'justify-center'
      } ${
        active
          ? 'bg-purple-500/10 text-white'
          : 'hover:bg-purple-900/50 hover:text-white'
      } text-white transition-colors p-4`}
      onClick={onClick}
    >
      <span className="h-6 w-6">{icon}</span>
      {expanded && <span className="ml-3 text-base font-semibold tracking-wide">{text}</span>}
      {isPro && expanded && (
        <span className="absolute right-2 px-2 py-1 rounded-md bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-500 text-sm font-bold">
          PRO
        </span>
      )}
    </Button>
  );

  const content = href ? (
    <Link href={href} passHref>
      {buttonContent}
    </Link>
  ) : (
    buttonContent
  );

  if (!expanded) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">
          <p className="text-base font-semibold">{text}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

export default Sidebar;