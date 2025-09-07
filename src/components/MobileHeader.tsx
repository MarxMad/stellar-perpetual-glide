import { Badge } from "@/components/ui/badge";
import { WalletConnectTech } from "./WalletConnectTech";
import { NetworkToggle } from "./NetworkToggle";
import { BarChart3, Wifi, WifiOff } from "lucide-react";

interface MobileHeaderProps {
  currentPrice: number;
  priceChange: number;
  isConnected: boolean;
}

export const MobileHeader = ({ currentPrice, priceChange, isConnected }: MobileHeaderProps) => {
  return (
    <div className="sticky top-0 z-40 xl:hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-teal-500/5"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
      
      <div className="bg-slate-900/95 border-b border-cyan-500/20 backdrop-blur-sm relative overflow-hidden">
        <div className="flex items-center justify-between p-3 relative z-10">
          {/* Logo y título */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-400/25">
              <BarChart3 className="h-4 w-4 text-black" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Stellar
              </h1>
              <p className="text-xs text-cyan-300">Perpetuals</p>
            </div>
          </div>

          {/* Status y precio - más compacto */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Precio */}
            <div className="text-right">
              <div className="text-sm font-bold text-white">${currentPrice?.toFixed(4) || '0.0000'}</div>
              <div className={`text-xs flex items-center ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange >= 0 ? '↗' : '↘'} {priceChange >= 0 ? '+' : ''}{priceChange?.toFixed(2) || '0.00'}%
              </div>
            </div>

            {/* Status de conexión y red */}
            <div className="flex items-center space-x-1">
              {isConnected ? (
                <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10 text-xs px-1 py-0.5">
                  <Wifi className="w-2 h-2 mr-1" />
                  <span className="text-xs">Live</span>
                </Badge>
              ) : (
                <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10 text-xs px-1 py-0.5">
                  <WifiOff className="w-2 h-2 mr-1" />
                  <span className="text-xs">Offline</span>
                </Badge>
              )}
              <NetworkToggle />
            </div>
          </div>

          {/* Wallet - en su propia línea si es necesario */}
          <div className="flex-shrink-0">
            <WalletConnectTech />
          </div>
        </div>
      </div>
    </div>
  );
};
