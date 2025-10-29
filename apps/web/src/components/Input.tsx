import { useState } from "react";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  label?: string;
  hint?: string;
  error?: string;
  type?: "text" | "password" | "number" | "email";
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  name?: string;
  autoComplete?: string;
  passwordToggle?: boolean; // enable eye toggle for password fields
}

export function Input({
  value,
  onChange,
  placeholder,
  required,
  label,
  hint,
  error,
  type = "text",
  leading,
  trailing,
  disabled,
  className,
  name,
  autoComplete,
  passwordToggle = true,
}: InputProps) {
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPwd ? "text" : type;

  const base =
    "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors " +
    "border-zinc-800/70 bg-white/5 dark:bg-black/20 backdrop-blur " +
    "focus:ring-2 focus:ring-violet-400/30 focus:border-violet-500/50 " +
    "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02),0_8px_24px_-12px_rgba(0,0,0,0.50)]";
  const state = disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-white/10 dark:hover:bg-black/30";
  const padLeft = leading ? "pl-10" : "";
  const padRight = trailing || (isPassword && passwordToggle) ? "pr-10" : "";
  const errorRing = error ? "border-red-500/60 focus:ring-red-400/30 focus:border-red-500/70" : "";

  return (
    <div className="grid gap-1.5">
      {label && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-300">{label}</label>
          {required && <span className="text-[10px] text-zinc-500">(required)</span>}
        </div>
      )}

      <div className="relative group">
        {leading && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            {leading}
          </div>
        )}

        <input
          type={inputType}
          required={required}
          disabled={disabled}
          name={name}
          autoComplete={autoComplete}
          className={[base, state, padLeft, padRight, errorRing, className || ""].join(" ").trim()}
          placeholder={placeholder || "Enter text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        {trailing && !isPassword && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">{trailing}</div>
        )}

        {isPassword && passwordToggle && (
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs rounded px-2 py-1 border border-zinc-700 hover:bg-zinc-900"
            tabIndex={-1}
          >
            {showPwd ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : hint ? (
        <p className="text-xs text-zinc-500">{hint}</p>
      ) : null}
    </div>
  );
}