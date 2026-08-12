import * as React from "react";
import { MobileNav } from "./mobile-nav";
import { Sidebar } from "./sidebar";
import { GlobalWorkoutBanner } from "@/components/workout/GlobalWorkoutBanner";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Sidebar />
      <div className="flex flex-col md:pl-64 flex-1">
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
      </div>
      <MobileNav />
      <GlobalWorkoutBanner />
    </div>
  );
}
