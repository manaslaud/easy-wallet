"use client";
import { ReactNode } from "react";

export function Section({
  title,
  subtitle,
  rightSlot,
  children,
}: {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-800/70 bg-white/5 dark:bg-black/20 backdrop-blur p-5 md:p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset,0_10px_30px_-12px_rgba(0,0,0,0.5)]">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="grid gap-1">
          <h2 className="text-lg md:text-xl font-semibold">{title}</h2>
          {subtitle && <p className="text-xs md:text-sm text-zinc-500">{subtitle}</p>}
        </div>
        {rightSlot}
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}


