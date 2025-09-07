import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wallet, 
  LogOut, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Shield,
  Zap
} from "lucide-react";
import { useWalletSimple } from "@/hooks/use-wallet-simple";
import { useState } from "react";

export const WalletConnectTech = () => {
  const {
    walletInfo,
    isConnecting,
    isDisconnecting,
    error,
    isConnected,
    kitLoaded,
    connect,
    disconnect,
    clearError
  } = useWalletSimple();

  const [copied, setCopied] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConnect = async () => {
    const now = Date.now();
    
    // Prevenir clicks múltiples en menos de 3 segundos
    if (now - lastClickTime < 3000) {
      console.log('🔄 Click demasiado rápido, ignorando...');
      return;
    }
    
    // Prevenir si ya está procesando
    if (isProcessing || isConnecting) {
      console.log('🔄 Ya hay una conexión en progreso, ignorando...');
      return;
    }
    
    setLastClickTime(now);
    setIsProcessing(true);
    
    try {
      await connect();
    } catch (error) {
      console.error('Error en handleConnect:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyAddress = async () => {
    if (walletInfo?.publicKey) {
      try {
        await navigator.clipboard.writeText(walletInfo.publicKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Error copying address:', err);
      }
    }
  };

  const formatAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const getNetworkColor = (network: string) => {
    switch (network) {
      case 'testnet':
        return 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10';
      case 'public':
        return 'border-green-500/50 text-green-400 bg-green-500/10';
      default:
        return 'border-gray-500/50 text-gray-400 bg-gray-500/10';
    }
  };

  const getNetworkLabel = (network: string) => {
    switch (network) {
      case 'testnet':
        return 'Testnet';
      case 'public':
        return 'Mainnet';
      default:
        return network;
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-500/50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-red-300">
          {error}
          <Button
            variant="outline"
            size="sm"
            onClick={clearError}
            className="ml-2 border-red-500/50 text-red-300 hover:bg-red-500/10"
          >
            Dismiss
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (isConnected && walletInfo) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-white">
                {formatAddress(walletInfo.publicKey)}
              </span>
              <Badge variant="outline" className={getNetworkColor(walletInfo.network)}>
                {getNetworkLabel(walletInfo.network)}
              </Badge>
            </div>
            <div className="text-xs text-gray-400 ml-10">
              {walletInfo.walletId}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyAddress}
            disabled={copied}
            className="border-slate-600 text-gray-300 hover:bg-slate-700"
          >
            {copied ? (
              <CheckCircle className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={disconnect}
            disabled={isDisconnecting}
            className="border-slate-600 text-gray-300 hover:bg-slate-700"
          >
            {isDisconnecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            <span className="ml-2">Disconnect</span>
          </Button>
        </div>
      </div>
    );
  }

  if (!kitLoaded) {
    return (
      <Button disabled className="flex items-center space-x-2 bg-slate-800/50 border-slate-700">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading Wallet...</span>
      </Button>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting || isProcessing || !kitLoaded}
      className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
    >
      {(isConnecting || isProcessing) ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Wallet className="h-4 w-4" />
      )}
      <span>
        {isConnecting || isProcessing ? 'Connecting...' : 'Connect Wallet'}
      </span>
    </Button>
  );
};
