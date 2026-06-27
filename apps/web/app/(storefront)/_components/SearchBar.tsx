"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

/** شريط بحث المتجر — ينقل إلى /products?q=... (يستهلك معامل q المدعوم في الخادم). */
export function SearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [value, setValue] = useState(sp.get("q") ?? "");

  // مزامنة الحقل مع الـ URL عند التنقّل
  useEffect(() => {
    setValue(sp.get("q") ?? "");
  }, [sp]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }

  return (
    <form onSubmit={submit} role="search" className={`relative flex items-center ${className}`}>
      <Search className="pointer-events-none absolute right-3.5 h-[18px] w-[18px]" style={{ color: "#94A3B8" }} />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="ابحث عن منتج..."
        className="w-full py-2.5 pr-10 pl-24 text-sm outline-none transition-all"
        style={{
          borderRadius: "var(--radius)",
          border: "1.5px solid #E2E8F0",
          background: "#fff",
          color: "#0F172A",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-primary)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; }}
      />
      <button
        type="submit"
        className="absolute left-1 px-4 py-1.5 text-xs font-bold text-white transition-all"
        style={{ borderRadius: "var(--radius)", background: "linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary) 100%)" }}
      >
        بحث
      </button>
    </form>
  );
}
