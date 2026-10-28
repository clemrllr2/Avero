import type { ComponentProps } from "react";

export function AuthField({
  label,
  hint,
  ...input
}: ComponentProps<"input"> & { label: string; hint?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      <input
        className="rounded-xl border border-line bg-surface px-4 py-3.5 text-[15px] transition-shadow outline-none focus:border-cobalt focus:ring-4 focus:ring-cobalt/15"
        {...input}
      />
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-xl border border-danger/20 bg-danger/8 px-4 py-3 text-sm text-danger">
      {message}
    </p>
  );
}
