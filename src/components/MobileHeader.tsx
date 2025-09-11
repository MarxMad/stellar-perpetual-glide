import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Wifi, WifiOff, Wallet, RefreshCw, DollarSign } from "lucide-react";
import { useWalletContext } from "../contexts/WalletContext";
import { usePriceOracle } from "../hooks/use-price-oracle";

interface MobileHeaderProps {
  currentPrice: number;
  priceChange: number;
  isConnected: boolean;
}

export const MobileHeader = ({ currentPrice, priceChange, isConnected }: MobileHeaderProps) => {
  const { walletInfo, connect, disconnect, isConnecting, updateBalance } = useWalletContext();
  const { xlmPrice, isLoading: priceLoading } = usePriceOracle();
  
  console.log('MobileHeader rendering:', { walletInfo, isConnected, xlmPrice });

  return (
    <div className="sticky top-0 z-40 lg:hidden">
      <div className="bg-slate-900/95 border-b border-cyan-500/20 backdrop-blur-sm">
        <div className="flex items-center justify-between px-3 py-2 min-h-[48px]">
          {/* Logo y título - ultra compacto */}
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <div className="w-5 h-5 bg-gradient-to-r from-cyan-500 to-teal-500 rounded flex items-center justify-center">
              <BarChart3 className="h-2 w-2 text-black" />
            </div>
            <h1 className="text-[11px] font-bold text-cyan-400 whitespace-nowrap">
              Stellar Perpetuals
            </h1>
          </div>

          {/* Status y wallet - balance perfecto */}
          <div className="flex items-center space-x-1">
            {/* Precio de XLM */}
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10 text-[10px] px-1 py-0.5 h-5 whitespace-nowrap">
              <DollarSign className="w-2 h-2 mr-0.5" />
              <span>${(xlmPrice || currentPrice).toFixed(4)}</span>
            </Badge>
            
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
            
            {/* Wallet info o botón de conectar */}
            {walletInfo ? (
              <div className="flex items-center space-x-1">
                {/* Balance */}
                <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10 text-[10px] px-1 py-0.5 h-5">
                  {walletInfo.balance?.toFixed(2) || '0.00'} XLM
                </Badge>
                
                {/* Dirección truncada */}
                <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10 text-[10px] px-1 py-0.5 h-5">
                  {walletInfo.publicKey.slice(0, 4)}...{walletInfo.publicKey.slice(-4)}
                </Badge>
                
                {/* Red */}
                <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10 text-[10px] px-1 py-0.5 h-5">
                  {walletInfo.network}
                </Badge>
                
                {/* Botón de actualizar balance */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={updateBalance}
                  className="h-5 px-1 text-[10px] border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20"
                >
                  <RefreshCw className="w-3 h-3" />
                </Button>
                
                {/* Botón de desconectar */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnect}
                  className="h-5 px-1 text-[10px] border-red-500/50 text-red-400 hover:bg-red-500/20"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={connect}
                disabled={isConnecting}
                className="h-5 px-2 text-[10px] border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 flex items-center space-x-1"
              >
                <Wallet className="w-3 h-3" />
                <span>{isConnecting ? 'Connecting...' : 'Connect'}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};