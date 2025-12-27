import clsx from "clsx";

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }
) {
  const { variant = "primary", className, ...rest } = props;
  return (
    <button
      {...rest}
      className={clsx(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-brand-600 text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-200",
        variant === "secondary" &&
          "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200",
        variant === "danger" &&
          "bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-200",
        className
      )}
    />
  );
}
