import React from "react";
import clsx from "clsx";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; containerClassName?: string }
>(function Input(props, ref) {
  const { label, error, containerClassName, className, ...rest } = props;

  return (
    <label className={clsx("block", containerClassName)}>
      <div className="mb-1.5 text-sm font-medium text-slate-600">{label}</div>
      <input
        ref={ref}
        {...rest}
        className={clsx(
          "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-premium outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 focus:shadow-premium-hover",
          error && "border-rose-300 focus:border-rose-400 focus:ring-rose-100",
          className
        )}
      />
      {error ? <div className="mt-1.5 text-xs font-medium text-rose-500">{error}</div> : null}
    </label>
  );
});
