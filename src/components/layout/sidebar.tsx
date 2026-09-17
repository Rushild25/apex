"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, History, User, Settings, Calendar, LineChart, Activity, Scale, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Workout", href: "/workout", icon: Dumbbell },
  { name: "Exercises", href: "/exercises", icon: Activity },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Measures", href: "/measures", icon: Scale },
  { name: "Statistics", href: "/statistics", icon: LineChart },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 border-r border-border bg-sidebar text-sidebar-foreground z-40">
      <div className="flex items-center h-16 px-6 border-b border-border">
        <Dumbbell className="w-6 h-6 mr-2 text-primary" />
        <span className="text-xl font-black tracking-wider uppercase">APEX</span>
      </div>

      <div className="flex-1 py-6 px-4 overflow-y-auto">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 rounded-md transition-colors font-medium",
                  isActive
                    ? "bg-sidebar-primary/10 text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-sidebar-primary" : "text-muted-foreground")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        <nav className="space-y-1">
          <Link
            href="/settings"
            className="flex items-center px-4 py-2 text-sm rounded-md transition-colors text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </Link>
          <button
            className="flex items-center w-full px-4 py-2 text-sm rounded-md transition-colors text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </nav>
      </div>
    </aside>
  );
}
