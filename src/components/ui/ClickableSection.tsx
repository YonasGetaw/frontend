import { useState } from "react";
import { Card } from "../../ui/Card";

interface ClickableSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  headerAction?: React.ReactNode;
}

export function ClickableSection({ title, icon, children, defaultExpanded = false, headerAction }: ClickableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="overflow-hidden p-0">
      {/* Clickable Header */}
      <button 
        onClick={handleClick}
        type="button"
        className="w-full bg-gradient-to-r from-teal-700 to-teal-800 text-white p-4 cursor-pointer hover:from-teal-800 hover:to-teal-900 transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
              {icon}
            </div>
            <h3 className="text-base font-semibold tracking-tight">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {headerAction}
            <svg 
              className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-5 border-t border-teal-100">
          {children}
        </div>
      )}
    </Card>
  );
}
