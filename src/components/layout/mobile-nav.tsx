"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, History, User, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Routines", href: "/routines", icon: Dumbbell },
  { name: "History", href: "/history", icon: History },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Profile", href: "/profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border md:hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 transition-colors hover:bg-muted/50",
                isActive ? "text-primary [filter:drop-shadow(0_0_8px_var(--color-primary))]" : "text-muted-foreground"
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] uppercase tracking-wider">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
