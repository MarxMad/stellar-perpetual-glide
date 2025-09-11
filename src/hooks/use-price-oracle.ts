import { useState, useEffect, useCallback } from 'react';
import { priceOracleClient } from '../lib/price-oracle-client';

export interface PriceData {
  xlmPrice: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const usePriceOracle = (autoRefresh: boolean = false, refreshInterval: number = 30000) => {
  const [priceData, setPriceData] = useState<PriceData>({
    xlmPrice: 0,
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  // Obtener precio de XLM
  const getXlmPrice = useCallback(async () => {
    try {
      setPriceData(prev => ({ ...prev, isLoading: true, error: null }));
      
      const price = await priceOracleClient.getXlmPrice();
      
      setPriceData(prev => ({
        ...prev,
        xlmPrice: price,
        isLoading: false,
        lastUpdated: new Date(),
      }));
      
      console.log('✅ Precio de XLM actualizado (REAL):', price);
    } catch (error) {
      console.error('❌ Error obteniendo precio de XLM:', error);
      setPriceData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error obteniendo precio del contrato',
      }));
    }
  }, []);

  // Obtener precio de cualquier asset
  const getAssetPrice = useCallback(async (asset: string): Promise<number> => {
    try {
      setPriceData(prev => ({ ...prev, isLoading: true, error: null }));
      
      const price = await priceOracleClient.getAssetPrice(asset);
      
      setPriceData(prev => ({
        ...prev,
        isLoading: false,
        lastUpdated: new Date(),
      }));
      
      return price;
    } catch (error) {
      console.error(`❌ Error obteniendo precio de ${asset}:`, error);
      setPriceData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : `Error obteniendo precio de ${asset}`,
      }));
      throw error;
    }
  }, []);

  // Verificar si el contrato está inicializado
  const checkInitialization = useCallback(async (): Promise<boolean> => {
    try {
      const isInit = await priceOracleClient.isInitialized();
      console.log('✅ Contrato inicializado:', isInit);
      return isInit;
    } catch (error) {
      console.error('❌ Error verificando inicialización:', error);
      return false;
    }
  }, []);

  // Obtener información del contrato
  const getContractInfo = useCallback(async () => {
    try {
      const info = await priceOracleClient.getContractInfo();
      console.log('📊 Información del contrato:', info);
      return info;
    } catch (error) {
      console.error('❌ Error obteniendo información del contrato:', error);
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
    getAssetPrice,
    checkInitialization,
    getContractInfo,
    clearError,
  };
};
