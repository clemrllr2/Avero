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
        className="rounded-[10px] border border-line bg-surface px-3.5 py-3 text-[15px] outline-none focus:border-cobalt"
        {...input}
      />
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-[10px] bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
      {message}
    </p>
  );
}
