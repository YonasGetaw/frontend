interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'admin' | 'user';
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white p-5 sm:p-7 rounded-2xl shadow-lg shadow-teal-800/15 mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold mb-1 tracking-tight text-balance">{title}</h1>
          {subtitle && (
            <p className="text-teal-200 text-xs sm:text-sm leading-relaxed">{subtitle}</p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
