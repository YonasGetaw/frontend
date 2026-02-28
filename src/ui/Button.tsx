import clsx from "clsx";

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "accent" }
) {
  const { variant = "primary", className, ...rest } = props;
  return (
    <button
      {...rest}
      className={clsx(
        "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-teal-700 text-white shadow-md shadow-teal-700/20 hover:bg-teal-800 hover:shadow-lg hover:shadow-teal-700/25 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-1",
        variant === "secondary" &&
          "border border-slate-200 bg-white text-slate-700 shadow-premium hover:bg-slate-50 hover:border-slate-300 hover:shadow-premium-hover active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-teal-200 focus:ring-offset-1",
        variant === "danger" &&
          "bg-rose-600 text-white shadow-md shadow-rose-600/20 hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-600/25 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-rose-200 focus:ring-offset-1",
        variant === "accent" &&
          "bg-amber-500 text-white shadow-md shadow-amber-500/20 hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/25 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-1",
        className
      )}
    />
  );
}
