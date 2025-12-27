import clsx from "clsx";

export function Card(props: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={clsx("rounded-2xl border border-slate-200 bg-white p-5 shadow-soft", props.className)}>
      {props.children}
    </div>
  );
}
