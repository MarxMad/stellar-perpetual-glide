import { useState, useEffect, useCallback, useRef } from 'react';
import { createReflectorEnhancedClient, ReflectorTicker } from '@/lib/reflector-enhanced-client';
import { useWalletSimple } from './use-wallet-simple';

export interface ReflectorPriceData {
  asset: string;
  price: number;
  timestamp: number;
  decimals: number;
  source: 'contract' | 'mock';
}

export interface ReflectorContractInfo {
  contractId: string;
  isActive: boolean;
  decimals: number;
  network: string;
  version: number;
}

// Hook para usar Reflector sin bucles infinitos
export const useReflectorEnhanced = (useMainnet: boolean = false) => {
  const { walletInfo, isConnected } = useWalletSimple();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prices, setPrices] = useState<ReflectorPriceData[]>([]);
  const [contractInfo, setContractInfo] = useState<ReflectorContractInfo | null>(null);
  
  // Usar useRef para evitar recrear el cliente en cada render
  const clientRef = useRef(createReflectorEnhancedClient(useMainnet));
  const initializedRef = useRef(false);

  // Inicializar contrato info una sola vez
  useEffect(() => {
    if (initializedRef.current) return;
    
    const initializeContract = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const info = await clientRef.current.getContractInfo();
        setContractInfo({
          contractId: info.contractId,
          isActive: true,
          decimals: 7,
          network: useMainnet ? 'mainnet' : 'testnet',
          version: 1
        });
        initializedRef.current = true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error initializing Reflector');
      } finally {
        setIsLoading(false);
      }
    };

    initializeContract();
  }, [useMainnet]);

  // Obtener precios de activos
  const getPrices = useCallback(async (assets: string[]) => {
    try {
      setIsLoading(true);
      setError(null);

      const assetObjects = assets.map(asset => ({ Other: asset }));
      const prices = await clientRef.current.getLastPrices(assetObjects);
      
      const priceData: ReflectorPriceData[] = assets.map(asset => {
        const priceInfo = prices.get(asset);
        if (priceInfo) {
          return {
            asset,
            price: parseFloat(priceInfo.price) / 10000000, // Convertir de stroops
            timestamp: parseInt(priceInfo.timestamp),
            decimals: 7,
            source: 'contract' as const
          };
        }
        return {
          asset,
          price: 0,
          timestamp: Date.now(),
          decimals: 7,
          source: 'mock' as const
        };
      });

      setPrices(priceData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error getting prices');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener precio individual
  const getPrice = useCallback(async (asset: string) => {
    try {
      const priceData = await clientRef.current.getLastPrice({ Other: asset });
      if (priceData) {
        return {
          asset,
          price: parseFloat(priceData.price) / 10000000,
          timestamp: parseInt(priceData.timestamp),
          decimals: 7,
          source: 'contract' as const
        };
      }
      return null;
    } catch (err) {
      return null;
    }
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    prices,
    contractInfo,
    isConnected,
    userAddress: walletInfo?.publicKey,
    contractId: contractInfo?.contractId || '',
    rpcUrl: useMainnet ? 'https://soroban-mainnet.stellar.org:443' : 'https://soroban-testnet.stellar.org:443',
    network: useMainnet ? 'mainnet' : 'testnet',
    getPrices,
    getPrice,
    clearError,
  };
};