import { useState, useEffect } from 'react';

export interface CoinGeckoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: any;
  last_updated: string;
}

export interface CoinGeckoMarketData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export const useCoinGecko = (coinId: string = 'stellar') => {
  const [price, setPrice] = useState<CoinGeckoPrice | null>(null);
  const [marketData, setMarketData] = useState<CoinGeckoMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener precio actual
  const fetchCurrentPrice = async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPrice(data.market_data);
      setError(null);
    } catch (err) {
      console.error('Error fetching current price:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  // Obtener datos históricos para gráfico
  const fetchMarketData = async (days: number = 7) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${days <= 1 ? 'hourly' : 'daily'}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMarketData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchCurrentPrice(),
        fetchMarketData(7)
      ]);
      setLoading(false);
    };

    loadData();

    // Actualizar cada 30 segundos
    const interval = setInterval(() => {
      fetchCurrentPrice();
    }, 30000);

    return () => clearInterval(interval);
  }, [coinId]);

  // Función para obtener datos de un período específico
  const fetchPeriodData = async (days: number) => {
    setLoading(true);
    await fetchMarketData(days);
    setLoading(false);
  };

  return {
    price,
    marketData,
    loading,
    error,
    fetchCurrentPrice,
    fetchPeriodData,
    refetch: () => {
      setLoading(true);
      Promise.all([
        fetchCurrentPrice(),
        fetchMarketData(7)
      ]).finally(() => setLoading(false));
    }
  };
};

// Hook para múltiples criptomonedas
export const useMultipleCoins = (coinIds: string[]) => {
  const [prices, setPrices] = useState<Record<string, CoinGeckoPrice>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMultiplePrices = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const pricesMap: Record<string, CoinGeckoPrice> = {};
        
        data.forEach((coin: any) => {
          pricesMap[coin.id] = coin;
        });
        
        setPrices(pricesMap);
        setError(null);
      } catch (err) {
        console.error('Error fetching multiple prices:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchMultiplePrices();

    // Actualizar cada 60 segundos
    const interval = setInterval(fetchMultiplePrices, 60000);

    return () => clearInterval(interval);
  }, [coinIds.join(',')]);

  return { prices, loading, error };
};
