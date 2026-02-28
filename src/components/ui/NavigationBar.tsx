import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface NavigationBarProps {
  title: string;
  showBack?: boolean;
  backTo?: string;
  subtitle?: string;
}

export function NavigationBar({ title, showBack = true, backTo = "/app/home", subtitle }: NavigationBarProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(backTo);
  };

  return (
    <div className="flex items-center gap-3 mb-6">
      {showBack && (
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200/80 bg-white text-slate-500 shadow-premium transition-all duration-200 hover:shadow-premium-hover hover:text-slate-700 hover:border-slate-300 active:scale-95"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
