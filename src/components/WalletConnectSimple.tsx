import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wallet, 
  LogOut, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { useWalletSimple } from "@/hooks/use-wallet-simple";
import { useState, useEffect } from "react";

export const WalletConnectSimple = () => {
  const {
    walletInfo,
    isConnecting,
    isDisconnecting,
    error,
    isConnected,
    connect,
    disconnect,
    clearError
  } = useWalletSimple();

  // Verificar si el kit está cargado
  const [kitLoaded, setKitLoaded] = useState(false);

  useEffect(() => {
    // Verificar si el kit está disponible
    const checkKit = async () => {
      try {
        await import("@creit.tech/stellar-wallets-kit");
        setKitLoaded(true);
      } catch (err) {
        console.error('Kit not available:', err);
      }
    };
    checkKit();
  }, []);

  const [copied, setCopied] = useState(false);

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
        return 'bg-yellow-100 text-yellow-800';
      case 'public':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button
            variant="outline"
            size="sm"
            onClick={clearError}
            className="ml-2"
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
              <span className="text-sm font-medium">
                {formatAddress(walletInfo.publicKey)}
              </span>
              <Badge variant="outline" className={getNetworkColor(walletInfo.network)}>
                {getNetworkLabel(walletInfo.network)}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
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
          >
            {copied ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={disconnect}
            disabled={isDisconnecting}
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
      <Button disabled className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading Wallet...</span>
      </Button>
    );
  }

  return (
    <Button
      onClick={connect}
      disabled={isConnecting}
      className="flex items-center space-x-2"
    >
      {isConnecting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Wallet className="h-4 w-4" />
      )}
      <span>
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </span>
    </Button>
  );
};
