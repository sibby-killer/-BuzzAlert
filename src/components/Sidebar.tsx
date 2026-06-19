"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Hash,
  Bell,
  CreditCard,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/dashboard/keywords", label: "Keywords", icon: Hash },
  { href: "/dashboard/mentions", label: "Mentions", icon: Bell },
  { href: "/dashboard/upgrade", label: "Upgrade", icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-56 flex-col border-r bg-card">
      <div className="p-4">
        <Link
          href="/dashboard/keywords"
          className="flex items-center gap-2 font-bold text-lg"
        >
          <LayoutDashboard className="h-5 w-5" />
          BuzzAlert
        </Link>
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Separator />
      <div className="p-3">
        <form action={signOut}>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sm font-medium text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}
