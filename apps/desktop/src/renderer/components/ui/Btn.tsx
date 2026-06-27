import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "success";
type Size = "sm" | "md" | "lg";

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
        "btn",
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth ? "btn-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading && <span className={variant === "secondary" || variant === "ghost" ? "spinner spinner-dark" : "spinner"} />}
      {label}
    </button>
  );
}
