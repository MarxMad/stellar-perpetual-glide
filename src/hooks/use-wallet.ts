import { useState, useEffect, useCallback } from 'react';
import { 
  connect, 
  disconnect, 
  getPublicKey, 
  isConnected, 
  getWalletInfo,
  setWallet 
} from '@/lib/stellar-wallets-kit';

export interface WalletInfo {
  publicKey: string;
  walletId: string;
  network: string;
}

export const useWallet = () => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar estado de conexión al cargar
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await isConnected();
        if (connected) {
          const info = await getWalletInfo();
          if (info) {
            setWalletInfo(info);
          }
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
      }
    };

    checkConnection();
  }, []);

  // Conectar wallet
  const handleConnect = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);

      await connect(async () => {
        // Callback después de conectar
        const info = await getWalletInfo();
        if (info) {
          setWalletInfo(info);
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error connecting wallet';
      setError(errorMessage);
      console.error('Error connecting wallet:', err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Desconectar wallet
  const handleDisconnect = useCallback(async () => {
    try {
      setIsDisconnecting(true);
      setError(null);

      await disconnect(async () => {
        // Callback después de desconectar
        setWalletInfo(null);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error disconnecting wallet';
      setError(errorMessage);
      console.error('Error disconnecting wallet:', err);
    } finally {
      setIsDisconnecting(false);
    }
  }, []);

  // Cambiar wallet
  const handleSetWallet = useCallback(async (walletId: string) => {
    try {
      setError(null);
      await setWallet(walletId);
      
      // Verificar nueva conexión
      const info = await getWalletInfo();
      if (info) {
        setWalletInfo(info);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error setting wallet';
      setError(errorMessage);
      console.error('Error setting wallet:', err);
    }
  }, []);

  // Obtener public key actual
  const getCurrentPublicKey = useCallback(async () => {
    try {
      const publicKey = await getPublicKey();
      return publicKey;
    } catch (err) {
      console.error('Error getting public key:', err);
      return null;
    }
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estado
    walletInfo,
    isConnecting,
    isDisconnecting,
    error,
    isConnected: !!walletInfo,

    // Métodos
    connect: handleConnect,
    disconnect: handleDisconnect,
    setWallet: handleSetWallet,
    getPublicKey: getCurrentPublicKey,
    clearError,
  };
};
