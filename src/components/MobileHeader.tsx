import { Badge } from "@/components/ui/badge";
import { WalletConnectTech } from "./WalletConnectTech";
import { NetworkToggle } from "./NetworkToggle";
import { BarChart3, Wifi, WifiOff } from "lucide-react";
import { useCoinGecko } from "../hooks/use-coingecko";

interface MobileHeaderProps {
  currentPrice: number;
  priceChange: number;
  isConnected: boolean;
}

export const MobileHeader = ({ currentPrice, priceChange, isConnected }: MobileHeaderProps) => {
  return (
    <div className="sticky top-0 z-40 xl:hidden">
      <div className="bg-slate-900/95 border-b border-cyan-500/20 backdrop-blur-sm">
        <div className="flex items-center justify-between px-3 py-2 min-h-[48px]">
          {/* Logo y título - ultra compacto */}
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <div className="w-5 h-5 bg-gradient-to-r from-cyan-500 to-teal-500 rounded flex items-center justify-center">
              <BarChart3 className="h-2 w-2 text-black" />
            </div>
            <h1 className="text-[11px] font-bold text-cyan-400 whitespace-nowrap">
              Stellar
            </h1>
          </div>

          {/* Status y wallet - balance perfecto */}
          <div className="flex items-center space-x-0.5">
            {/* Status de conexión */}
            {isConnected ? (
              <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10 text-[10px] px-1 py-0.5 h-5 whitespace-nowrap">
                <Wifi className="w-2 h-2 mr-0.5" />
                <span>Live</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10 text-[10px] px-1 py-0.5 h-5 whitespace-nowrap">
                <WifiOff className="w-2 h-2 mr-0.5" />
                <span>Off</span>
              </Badge>
            )}
            
            {/* Wallet - más cerca del badge */}
            <div className="scale-[0.65] -ml-1">
              <WalletConnectTech />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
