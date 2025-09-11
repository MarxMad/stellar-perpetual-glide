import { useState, useCallback, useRef } from 'react';
import { createPerpetualContractClient, TESTNET_CONFIG } from '@/lib/perpetual-contract-client';
import { useWalletSimple } from './use-wallet-simple';
import { Keypair } from '@stellar/stellar-sdk';

export interface TradingPosition {
  id: number;
  asset: string;
  side: 'long' | 'short';
  size: number;
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  timestamp: number;
  isActive: boolean;
}

export interface TradingFormData {
  asset: string;
  side: 'long' | 'short';
  amount: number;
  leverage: number;
  margin: number;
}

// Hook para trading real
export const useTradingReal = () => {
  const { walletInfo, isConnected, connect, disconnect, isConnecting } = useWalletSimple();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [positions, setPositions] = useState<TradingPosition[]>([]);
  const [contractConfig, setContractConfig] = useState<any>(null);

  // Usar useRef para evitar recrear el cliente en cada render
  const contractClientRef = useRef(createPerpetualContractClient(
    TESTNET_CONFIG.perpetualTradingContractId,
    TESTNET_CONFIG.rpcUrl,
    TESTNET_CONFIG.networkPassphrase
  ));

  // Inicializar config una sola vez
  const configInitialized = useRef(false);
  
  useState(() => {
    if (!configInitialized.current) {
      setContractConfig({
        contractId: TESTNET_CONFIG.perpetualTradingContractId,
        rpcUrl: TESTNET_CONFIG.rpcUrl,
        networkPassphrase: TESTNET_CONFIG.networkPassphrase,
        contractBalance: 0
      });
      configInitialized.current = true;
    }
  });

  // Helper para obtener el signer desde la wallet
  const getSigner = useCallback((): Keypair | null => {
    if (!walletInfo?.publicKey) {
      return null;
    }
    
    // En un entorno real, necesitarías obtener la clave privada de la wallet
    // Por ahora retornamos null para indicar que se necesita firma externa
    return null;
  }, [walletInfo?.publicKey]);

  // Obtener configuración del contrato
  const getContractConfig = useCallback(async () => {
    try {
      const config = await contractClientRef.current.getConfig();
      setContractConfig(config);
      return config;
    } catch (err) {
      return null;
    }
  }, []);

  // Depositar XLM para margin
  const depositXlm = useCallback(async (amount: number) => {
    if (!isConnected || !walletInfo?.publicKey) {
      throw new Error('Wallet no conectada');
    }

    setIsLoading(true);
    setError(null);

    try {
      const signer = getSigner();
      if (!signer) {
        throw new Error('No se puede obtener la clave privada de la wallet. Necesitas firmar la transacción manualmente en tu wallet de Stellar (Freighter, Albedo, etc.)');
      }

      const success = await contractClientRef.current.depositXlm(
        walletInfo.publicKey,
        amount,
        signer
      );

      if (success) {
        await getContractConfig();
      }

      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error depositando XLM';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, walletInfo?.publicKey, getSigner, getContractConfig]);

  // Abrir posición
  const openPosition = useCallback(async (formData: TradingFormData) => {
    if (!isConnected || !walletInfo?.publicKey) {
      throw new Error('Wallet no conectada');
    }

    setIsLoading(true);
    setError(null);

    try {
      const signer = getSigner();
      if (!signer) {
        throw new Error('No se puede obtener la clave privada de la wallet. Necesitas firmar la transacción manualmente en tu wallet de Stellar (Freighter, Albedo, etc.)');
      }

      const positionId = await contractClientRef.current.openPosition(
        walletInfo.publicKey,
        formData.asset,
        formData.margin,
        formData.leverage,
        formData.side === 'long',
        signer
      );

      if (positionId > 0) {
        const newPosition: TradingPosition = {
          id: positionId,
          asset: formData.asset,
          side: formData.side,
          size: formData.amount,
          leverage: formData.leverage,
          entryPrice: 0,
          currentPrice: 0,
          pnl: 0,
          timestamp: Date.now(),
          isActive: true
        };

        setPositions(prev => [...prev, newPosition]);
      }

      return positionId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error abriendo posición';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, walletInfo?.publicKey, getSigner]);

  // Cerrar posición
  const closePosition = useCallback(async (positionId: number) => {
    if (!isConnected || !walletInfo?.publicKey) {
      throw new Error('Wallet no conectada');
    }

    setIsLoading(true);
    setError(null);

    try {
      const signer = getSigner();
      if (!signer) {
        throw new Error('No se puede obtener la clave privada de la wallet. Necesitas firmar la transacción manualmente en tu wallet de Stellar (Freighter, Albedo, etc.)');
      }

      const pnl = await contractClientRef.current.closePosition(
        walletInfo.publicKey,
        positionId,
        signer
      );

      setPositions(prev => prev.filter(p => p.id !== positionId));
      
      return pnl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cerrando posición';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, walletInfo?.publicKey, getSigner]);

  // Obtener balance del trader
  const getTraderBalance = useCallback(async () => {
    if (!walletInfo?.publicKey) {
      return 0;
    }

    try {
      const balance = await contractClientRef.current.getTraderBalance(walletInfo.publicKey);
      return balance;
    } catch (err) {
      return 0;
    }
  }, [walletInfo?.publicKey]);

  // Obtener posición actual
  const getCurrentPosition = useCallback(async () => {
    if (!walletInfo?.publicKey) {
      return null;
    }

    try {
      const position = await contractClientRef.current.getCurrentPosition(walletInfo.publicKey);
      return position;
    } catch (err) {
      return null;
    }
  }, [walletInfo?.publicKey]);

  // Retirar XLM
  const withdrawXlm = useCallback(async (amount: number) => {
    if (!isConnected || !walletInfo?.publicKey) {
      throw new Error('Wallet no conectada');
    }

    setIsLoading(true);
    setError(null);

    try {
      const signer = getSigner();
      if (!signer) {
        throw new Error('No se puede obtener la clave privada de la wallet. Necesitas firmar la transacción manualmente en tu wallet de Stellar (Freighter, Albedo, etc.)');
      }

      const success = await contractClientRef.current.withdrawXlm(
        walletInfo.publicKey,
        amount,
        signer
      );

      if (success) {
        await getContractConfig();
      }

      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error retirando XLM';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, walletInfo?.publicKey, getSigner, getContractConfig]);

  // Obtener versión del contrato
  const getContractVersion = useCallback(async () => {
    try {
      return 1;
    } catch (err) {
      return 0;
    }
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading: isLoading || isConnecting,
    error,
    positions,
    contractConfig,
    isConnected,
    userAddress: walletInfo?.publicKey,
    contractId: TESTNET_CONFIG.perpetualTradingContractId,
    rpcUrl: TESTNET_CONFIG.rpcUrl,
    network: 'testnet',
    connect,
    disconnect,
    depositXlm,
    openPosition,
    closePosition,
    withdrawXlm,
    getTraderBalance,
    getCurrentPosition,
    getContractConfig,
    getContractVersion,
    clearError,
  };
};