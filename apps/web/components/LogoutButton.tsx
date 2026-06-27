"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <button
      className="sidebar-logout-btn"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <LogOut className="h-4 w-4 shrink-0" />
      <span>تسجيل الخروج</span>
    </button>
  );
}
