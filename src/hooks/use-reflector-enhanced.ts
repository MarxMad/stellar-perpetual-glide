import { useState, useEffect, useCallback } from 'react';
import { reflectorTestnetClient, reflectorMainnetClient, ReflectorTicker } from '@/lib/reflector-enhanced-client';
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

// Hook mejorado para usar Reflector
export const useReflectorEnhanced = (useMainnet: boolean = false) => {
  const { walletInfo, isConnected } = useWalletSimple();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prices, setPrices] = useState<ReflectorPriceData[]>([]);
  const [tickers, setTickers] = useState<ReflectorTicker[]>([]);
  const [contractInfo, setContractInfo] = useState<ReflectorContractInfo | null>(null);

  // Obtener el cliente correcto
  const client = useMainnet ? reflectorMainnetClient : reflectorTestnetClient;

  // Inicializar y obtener información del contrato
  useEffect(() => {
    const initializeContract = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`🚀 Inicializando Reflector en ${useMainnet ? 'Mainnet' : 'Testnet'}...`);
        
        const info = await client.getContractInfo();
        setContractInfo(info);
        
        console.log(`✅ Reflector inicializado:`, info);
      } catch (err) {
        console.error('Error initializing Reflector:', err);
        setError(err instanceof Error ? err.message : 'Error initializing Reflector');
      } finally {
        setIsLoading(false);
      }
    };

    initializeContract();
  }, [client, useMainnet]);

  // Cargar tickers disponibles
  const loadTickers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('📊 Cargando tickers disponibles...');
      const availableTickers = await client.getAvailableTickers();
      setTickers(availableTickers);
      
      console.log(`✅ Tickers cargados: ${availableTickers.length} disponibles`);
    } catch (err) {
      console.error('Error loading tickers:', err);
      setError(err instanceof Error ? err.message : 'Error loading tickers');
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  // Obtener precios de múltiples activos
  const getPrices = useCallback(async (assets: string[]) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`💰 Obteniendo precios para activos:`, assets);
      const priceData = await client.getMultiplePrices(assets);
      
      const formattedPrices: ReflectorPriceData[] = Object.entries(priceData).map(([asset, data]) => ({
        asset,
        price: data.price,
        timestamp: data.timestamp,
        decimals: data.decimals,
        source: data.source
      }));
      
      setPrices(formattedPrices);
      console.log(`✅ Precios obtenidos:`, formattedPrices);
      
      return formattedPrices;
    } catch (err) {
      console.error('Error getting prices:', err);
      setError(err instanceof Error ? err.message : 'Error getting prices');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  // Obtener precio de un activo específico
  const getPrice = useCallback(async (asset: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`💰 Obteniendo precio para ${asset}...`);
      const priceData = await client.getLastPrice(asset);
      
      const formattedPrice: ReflectorPriceData = {
        asset,
        price: priceData.price,
        timestamp: priceData.timestamp,
        decimals: priceData.decimals,
        source: priceData.source
      };
      
      console.log(`✅ Precio obtenido para ${asset}:`, formattedPrice);
      return formattedPrice;
    } catch (err) {
      console.error(`Error getting price for ${asset}:`, err);
      setError(err instanceof Error ? err.message : `Error getting price for ${asset}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  // Obtener precio en tiempo real (simulado con polling)
  const getRealTimePrice = useCallback((asset: string, callback: (price: ReflectorPriceData) => void, interval: number = 30000) => {
    const fetchPrice = async () => {
      try {
        const price = await getPrice(asset);
        if (price) {
          callback(price);
        }
      } catch (err) {
        console.error('Error in real-time price fetch:', err);
      }
    };

    // Obtener precio inmediatamente
    fetchPrice();

    // Configurar polling
    const intervalId = setInterval(fetchPrice, interval);

    // Retornar función de limpieza
    return () => clearInterval(intervalId);
  }, [getPrice]);

  // Verificar si un activo está disponible
  const isAssetAvailable = useCallback((asset: string, source?: 'pubnet' | 'exchanges') => {
    if (source) {
      return tickers.some(ticker => ticker.symbol === asset && ticker.source === source);
    }
    return tickers.some(ticker => ticker.symbol === asset);
  }, [tickers]);

  // Obtener activos disponibles por fuente
  const getAssetsBySource = useCallback((source: 'pubnet' | 'exchanges') => {
    return tickers.filter(ticker => ticker.source === source).map(ticker => ticker.symbol);
  }, [tickers]);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cambiar red
  const switchNetwork = useCallback((newUseMainnet: boolean) => {
    setPrices([]);
    setTickers([]);
    setContractInfo(null);
    setError(null);
  }, []);

  return {
    // Estado
    isLoading,
    error,
    prices,
    tickers,
    contractInfo,
    isConnected,
    userAddress: walletInfo?.publicKey,
    network: useMainnet ? 'mainnet' : 'testnet',
    
    // Métodos
    getPrices,
    getPrice,
    getRealTimePrice,
    loadTickers,
    isAssetAvailable,
    getAssetsBySource,
    clearError,
    switchNetwork,
    
    // Cliente directo (para uso avanzado)
    client
  };
};
