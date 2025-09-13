import { useState, useEffect, useCallback } from 'react';

export interface SimplePrice {
  symbol: string;
  price: number;
  change24h: number;
  lastUpdated: Date;
}

export interface SimplePriceData {
  prices: SimplePrice[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// Solo los activos más importantes para evitar rate limiting
const PRIORITY_ASSETS = ['XLM', 'BTC', 'ETH', 'USDC', 'SOL'];

export const useSimplePrices = (
  autoRefresh: boolean = true,
  refreshInterval: number = 300000 // 5 minutos
) => {
  const [priceData, setPriceData] = useState<SimplePriceData>({
    prices: [],
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  const getSimplePrices = useCallback(async () => {
    try {
      setPriceData(prev => ({ ...prev, isLoading: true, error: null }));
      
      console.log('🔍 Obteniendo precios simples desde CoinGecko...');
      
      // Llamar a la API de CoinGecko con solo los activos prioritarios
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=stellar,bitcoin,ethereum,usd-coin,solana&vs_currencies=usd&include_24hr_change=true`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(15000) // 15 segundos timeout
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Mapeo de CoinGecko IDs a símbolos
      const idToSymbol: Record<string, string> = {
        'stellar': 'XLM',
        'bitcoin': 'BTC',
        'ethereum': 'ETH',
        'usd-coin': 'USDC',
        'solana': 'SOL'
      };
      
      // Convertir respuesta a formato SimplePrice
      const prices: SimplePrice[] = Object.entries(data)
        .map(([coinId, coinData]: [string, any]) => {
          const symbol = idToSymbol[coinId];
          if (symbol && coinData.usd) {
            return {
              symbol,
              price: coinData.usd,
              change24h: coinData.usd_24h_change || 0,
              lastUpdated: new Date(),
            };
          }
          return null;
        })
        .filter(Boolean) as SimplePrice[];

      console.log('✅ Precios simples obtenidos:', prices);
      
      setPriceData({
        prices,
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
      });
      
    } catch (error) {
      console.error('❌ Error obteniendo precios simples:', error);
      setPriceData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      }));
    }
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      getSimplePrices();
      const interval = setInterval(() => {
        getSimplePrices();
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, getSimplePrices]);

  return {
    ...priceData,
    getSimplePrices,
    clearError: () => setPriceData(prev => ({ ...prev, error: null })),
  };
};
