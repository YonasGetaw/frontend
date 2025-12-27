import React from "react";
import clsx from "clsx";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; containerClassName?: string }
>(function Input(props, ref) {
  const { label, error, containerClassName, className, ...rest } = props;

  return (
    <label className={clsx("block", containerClassName)}>
      <div className="mb-1 text-sm font-medium text-slate-700">{label}</div>
      <input
        ref={ref}
        {...rest}
        className={clsx(
          "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100",
          error && "border-rose-300 focus:border-rose-400 focus:ring-rose-100",
          className
        )}
      />
      {error ? <div className="mt-1 text-xs text-rose-600">{error}</div> : null}
    </label>
  );
});
