"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, History, User, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Workout", href: "/workout", icon: Dumbbell },
  { name: "Profile", href: "/profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background/95 backdrop-blur border-t border-border md:hidden">
      <div className="grid h-full max-w-md grid-cols-3 mx-auto font-medium">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href ||
                (item.href === "/workout" && (pathname.startsWith("/workout") || pathname.startsWith("/routines"))) ||
                (item.href === "/profile" &&
                  (pathname.startsWith("/profile") ||
                    pathname.startsWith("/statistics") ||
                    pathname.startsWith("/measures") ||
                    pathname.startsWith("/calendar") ||
                    pathname.startsWith("/history") ||
                    pathname.startsWith("/progress")));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-4 transition-colors",
                isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-6 h-6 mb-1", isActive ? "stroke-[2.5px]" : "stroke-[1.75px]")} />
              <span className="text-[11px] tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
