"use client";

import { useTransition, useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "@base-ui/react/menu";
import {
  ChevronDown,
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
  UserCircle,
} from "lucide-react";
import { signOut } from "@/app/actions/auth";

type UserMenuProps = {
  displayName: string;
  email: string | null;
};

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark =
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function UserMenu({ displayName, email }: UserMenuProps) {
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(() => {
      signOut();
    });
  }

  return (
    <div className="flex items-center gap-3">
      {/* Account dropdown */}
      <Menu.Root>
        <Menu.Trigger
          className="group flex items-center gap-2 rounded-full border border-transparent bg-transparent px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-[#8A1538]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A1538]/40 data-[popup-open]:bg-[#8A1538]/10"
          aria-label="Open account menu"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8A1538]/10 text-[#8A1538]">
            <UserCircle className="h-5 w-5" />
          </span>
          <span className="hidden text-left md:flex md:flex-col md:leading-tight">
            <span className="text-[11px] font-normal text-muted-foreground">
              Welcome,
            </span>
            <span className="text-sm font-semibold text-foreground">
              {displayName}
            </span>
          </span>
          <ChevronDown className="hidden h-4 w-4 text-muted-foreground transition-transform group-data-[popup-open]:rotate-180 md:block" />
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Positioner sideOffset={8} align="end" className="z-[100]">
            <Menu.Popup className="min-w-[240px] origin-[var(--transform-origin)] rounded-xl border border-border bg-card p-1.5 text-card-foreground shadow-xl shadow-black/5 outline-none data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 transition-[transform,opacity] duration-150">
              <div className="px-3 py-2.5 border-b border-border mb-1">
                <p className="text-sm font-semibold text-foreground truncate">
                  {displayName}
                </p>
                {email && (
                  <p className="text-xs text-muted-foreground truncate">
                    {email}
                  </p>
                )}
              </div>

              <Menu.Item
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground outline-none transition-colors data-[highlighted]:bg-[#8A1538]/10 data-[highlighted]:text-[#8A1538]"
                render={<Link href="/profile" />}
              >
                <User className="h-4 w-4" />
                My Profile
              </Menu.Item>

              <Menu.Item
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground outline-none transition-colors data-[highlighted]:bg-[#8A1538]/10 data-[highlighted]:text-[#8A1538]"
                render={<Link href="/account" />}
              >
                <Settings className="h-4 w-4" />
                Account Settings
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>

      {/* Visible Sign Out button */}
      <button
        onClick={handleSignOut}
        disabled={isPending}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden md:inline">
          {isPending ? "Signing out..." : "Sign Out"}
        </span>
      </button>

      {/* Dark mode toggle — far right */}
      <ThemeToggle />
    </div>
  );
}
