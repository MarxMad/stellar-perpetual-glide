import { useState, useEffect, useCallback } from 'react';
import { coinGeckoClient, CoinGeckoPrice } from '../lib/coingecko-client';

export interface PriceData {
  xlmPrice: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  priceChange24h: number;
}

export const useCoinGeckoPrices = (autoRefresh: boolean = true, refreshInterval: number = 30000) => {
  const [priceData, setPriceData] = useState<PriceData>({
    xlmPrice: 0,
    isLoading: false,
    error: null,
    lastUpdated: null,
    priceChange24h: 0,
  });

  // Obtener precio de XLM
  const getXlmPrice = useCallback(async () => {
    try {
      setPriceData(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { price, change24h } = await coinGeckoClient.getXlmPriceWithChange();
      
      setPriceData(prev => ({
        ...prev,
        xlmPrice: price,
        priceChange24h: change24h,
        isLoading: false,
        lastUpdated: new Date(),
      }));
      
      console.log('✅ Precio de XLM actualizado (CoinGecko):', price, 'Cambio 24h:', change24h);
    } catch (error) {
      console.error('❌ Error obteniendo precio de XLM:', error);
      setPriceData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error obteniendo precio de CoinGecko',
      }));
    }
  }, []);

  // Obtener precio de cualquier criptomoneda
  const getPrice = useCallback(async (coinId: string): Promise<number> => {
    try {
      setPriceData(prev => ({ ...prev, isLoading: true, error: null }));
      
      const price = await coinGeckoClient.getPrice(coinId);
      
      setPriceData(prev => ({
        ...prev,
        isLoading: false,
        lastUpdated: new Date(),
      }));
      
      return price;
    } catch (error) {
      console.error(`❌ Error obteniendo precio de ${coinId}:`, error);
      setPriceData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : `Error obteniendo precio de ${coinId}`,
      }));
      throw error;
    }
  }, []);

  // Obtener múltiples precios
  const getMultiplePrices = useCallback(async (coinIds: string[]): Promise<Record<string, number>> => {
    try {
      setPriceData(prev => ({ ...prev, isLoading: true, error: null }));
      
      const prices = await coinGeckoClient.getMultiplePrices(coinIds);
      
      setPriceData(prev => ({
        ...prev,
        isLoading: false,
        lastUpdated: new Date(),
      }));
      
      return prices;
    } catch (error) {
      console.error('❌ Error obteniendo precios múltiples:', error);
      setPriceData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error obteniendo precios múltiples',
      }));
      throw error;
    }
  }, []);

  // Obtener información detallada de una criptomoneda
  const getCoinInfo = useCallback(async (coinId: string): Promise<CoinGeckoPrice> => {
    try {
      const info = await coinGeckoClient.getCoinInfo(coinId);
      return info;
    } catch (error) {
      console.error(`❌ Error obteniendo información de ${coinId}:`, error);
      throw error;
    }
  }, []);

  // Auto-refresh del precio
  useEffect(() => {
    if (autoRefresh) {
      // Obtener precio inicial
      getXlmPrice();
      
      // Configurar intervalo de actualización
      const interval = setInterval(() => {
        getXlmPrice();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, getXlmPrice]);

  // Limpiar error
  const clearError = useCallback(() => {
    setPriceData(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...priceData,
    getXlmPrice,
    getPrice,
    getMultiplePrices,
    getCoinInfo,
    clearError,
  };
};
