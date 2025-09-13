import { 
  BarChart3, 
  TrendingUp, 
  Wallet, 
  Home,
  Settings,
  Wrench
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onGoHome?: () => void;
}

export const MobileMenu = ({ activeTab, onTabChange, onGoHome }: MobileMenuProps) => {
  const mainTabs = [
    { id: "trading", label: "Trading", icon: BarChart3 },
    { id: "positions", label: "Positions", icon: TrendingUp },
    { id: "portfolio", label: "Portfolio", icon: Wallet },
    { id: "stats", label: "Stats", icon: TrendingUp },
    { id: "contract", label: "Contract", icon: Wrench },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 xl:hidden">
      {/* Efecto de resplandor superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse"></div>
      
      {/* Barra de navegación */}
      <div className="bg-slate-900/95 border-t border-cyan-500/20 backdrop-blur-md relative overflow-hidden shadow-2xl shadow-cyan-500/10">
        {/* Efecto de fondo */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-teal-500/5"></div>
        
        <div className="flex items-center justify-between py-3 px-2 relative z-10">
          {/* Botón Home */}
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 hover:bg-cyan-500/20 min-w-[50px]"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <Home className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-xs text-cyan-400 font-medium">Home</span>
            </button>
          )}

          {/* Pestañas principales */}
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 relative min-w-[50px] group",
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-400/30"
                    : "text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-lg"></div>
                )}
                <div className="w-6 h-6 flex items-center justify-center relative z-10">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium relative z-10">{tab.label}</span>
                
                {/* Indicador activo */}
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
