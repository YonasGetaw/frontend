import { ReactNode } from "react";
import { SectionHeader } from "../ui/SectionHeader";

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  variant?: 'admin' | 'user';
}

export function DashboardLayout({ title, subtitle, children, action, variant = 'user' }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Header */}
      <SectionHeader 
        title={title} 
        subtitle={subtitle} 
        action={action}
        variant={variant}
      />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
