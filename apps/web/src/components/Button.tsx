"use client";
import { ReactNode } from "react";

export function Button({
  children,
  onClick,
  disabled,
  variant = "primary",
  type = "button",
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit";
  className?: string;
}) {
  const base = "px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-black text-white hover:bg-zinc-900"
      : variant === "secondary"
      ? "border border-zinc-700 hover:bg-zinc-900"
      : "text-zinc-300 hover:bg-zinc-900/40";

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles} ${className || ""}`}>
      {children}
    </button>
  );
}


