interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'admin' | 'user';
}

export function SectionHeader({ title, subtitle, action, variant = 'default' }: SectionHeaderProps) {
  const getHeaderStyles = () => {
    switch (variant) {
      case 'admin':
        return 'bg-gradient-to-r from-blue-600 to-blue-700';
      case 'user':
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
      default:
        return 'bg-gradient-to-r from-blue-600 to-blue-700';
    }
  };

  return (
    <div className={`${getHeaderStyles()} text-white p-4 sm:p-6 rounded-lg shadow-lg mb-6`}>
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 truncate">{title}</h1>
          {subtitle && (
            <p className="text-blue-100 text-xs sm:text-sm lg:text-base leading-relaxed">{subtitle}</p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0 sm:ml-4">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
