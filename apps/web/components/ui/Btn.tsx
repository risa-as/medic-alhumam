"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "success";
type Size = "sm" | "md" | "lg";

const variantCls: Record<Variant, string> = {
  primary:   "bg-primary text-white hover:bg-primary-hover",
  secondary: "bg-surface text-txt border border-border hover:bg-app-bg",
  danger:    "bg-state-danger text-white hover:bg-red-800",
  ghost:     "bg-transparent text-txt-secondary hover:bg-app-bg hover:text-txt",
  success:   "bg-state-success text-white hover:bg-green-800",
};

const sizeCls: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-sm",
};

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Btn({
  variant = "primary",
  size = "md",
  loading = false,
  loadingText,
  fullWidth = false,
  disabled,
  children,
  className = "",
  ...rest
}: BtnProps) {
  const isDisabled = disabled || loading;
  const label = loading && loadingText ? loadingText : children;

  return (
    <button
      {...rest}
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center gap-1.5 rounded font-medium",
        "transition-all duration-150 ease-out whitespace-nowrap leading-none",
        "disabled:opacity-65 disabled:cursor-not-allowed",
        variantCls[variant],
        sizeCls[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading && <span className="spinner" />}
      {label}
    </button>
  );
}
