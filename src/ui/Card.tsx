import clsx from "clsx";

export function Card(props: React.PropsWithChildren<{ className?: string; hover?: boolean }>) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-slate-200/80 bg-white p-5 shadow-premium transition-all duration-200",
        props.hover !== false && "hover:shadow-premium-hover hover:border-slate-200",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
