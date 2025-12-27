import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface NavigationBarProps {
  title: string;
  showBack?: boolean;
  backTo?: string;
}

export function NavigationBar({ title, showBack = true, backTo = "/app/home" }: NavigationBarProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(backTo);
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg shadow-lg mb-6">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-blue-800 transition-colors duration-200"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-lg font-semibold flex-1">{title}</h1>
      </div>
    </div>
  );
}
