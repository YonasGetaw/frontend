import { useState } from "react";
import { Card } from "../../ui/Card";
import { SectionHeader } from "./SectionHeader";

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
    <Card className="overflow-hidden">
      {/* Clickable Header */}
      <div 
        onClick={handleClick}
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-white">
              {icon}
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <div className="flex items-center space-x-2">
            {headerAction}
            <svg 
              className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-4 border-t border-blue-100">
          {children}
        </div>
      )}
    </Card>
  );
}
