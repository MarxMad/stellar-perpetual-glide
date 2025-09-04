import { useState, useCallback } from 'react';
import { perpetualContractClient } from '@/lib/perpetual-contract-client';
import { useStellarServices } from './use-stellar-services';

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
}

export interface TradingFormData {
  asset: string;
  side: 'long' | 'short';
  amount: number;
  leverage: number;
  orderType: 'market' | 'limit';
  price?: number;
}

export const useTrading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [positions, setPositions] = useState<TradingPosition[]>([]);
  const { userAddress, isConnected } = useStellarServices();

  // Abrir posición long
  const openLongPosition = useCallback(async (formData: TradingFormData) => {
    console.log('🔍 Debug wallet connection:', { isConnected, userAddress });
    
    if (!isConnected || !userAddress) {
      throw new Error('Wallet no conectada');
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Abriendo posición long:', formData);
      
      const positionId = await perpetualContractClient.openLongPosition(
        userAddress,
        formData.asset,
        formData.amount,
        formData.leverage
      );

      console.log('✅ Posición long abierta:', positionId);

      // Obtener detalles de la posición
      const positionDetails = await perpetualContractClient.getPosition(positionId);
      
      const newPosition: TradingPosition = {
        id: positionId,
        asset: formData.asset,
        side: 'long',
        size: formData.amount,
        leverage: formData.leverage,
        entryPrice: 0, // Se actualizará con precio real
        currentPrice: 0,
        pnl: 0,
        timestamp: Date.now()
      };

      setPositions(prev => [...prev, newPosition]);
      return positionId;
    } catch (error) {
      console.error('❌ Error abriendo posición long:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, userAddress]);

  // Abrir posición short
  const openShortPosition = useCallback(async (formData: TradingFormData) => {
    console.log('🔍 Debug wallet connection:', { isConnected, userAddress });
    
    if (!isConnected || !userAddress) {
      throw new Error('Wallet no conectada');
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Abriendo posición short:', formData);
      
      const positionId = await perpetualContractClient.openShortPosition(
        userAddress,
        formData.asset,
        formData.amount,
        formData.leverage
      );

      console.log('✅ Posición short abierta:', positionId);

      // Obtener detalles de la posición
      const positionDetails = await perpetualContractClient.getPosition(positionId);
      
      const newPosition: TradingPosition = {
        id: positionId,
        asset: formData.asset,
        side: 'short',
        size: formData.amount,
        leverage: formData.leverage,
        entryPrice: 0, // Se actualizará con precio real
        currentPrice: 0,
        pnl: 0,
        timestamp: Date.now()
      };

      setPositions(prev => [...prev, newPosition]);
      return positionId;
    } catch (error) {
      console.error('❌ Error abriendo posición short:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, userAddress]);

  // Cerrar posición
  const closePosition = useCallback(async (positionId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Cerrando posición:', positionId);
      
      const success = await perpetualContractClient.closePosition(positionId);
      
      if (success) {
        console.log('✅ Posición cerrada:', positionId);
        setPositions(prev => prev.filter(p => p.id !== positionId));
        return true;
      } else {
        throw new Error('No se pudo cerrar la posición');
      }
    } catch (error) {
      console.error('❌ Error cerrando posición:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Actualizar PnL de todas las posiciones
  const updatePositionsPnL = useCallback(async () => {
    if (positions.length === 0) return;

    try {
      const updatedPositions = await Promise.all(
        positions.map(async (position) => {
          try {
            const pnl = await perpetualContractClient.calculatePnL(
              position.id,
              position.currentPrice
            );
            return { ...position, pnl };
          } catch (error) {
            console.error(`Error actualizando PnL para posición ${position.id}:`, error);
            return position;
          }
        })
      );
      
      setPositions(updatedPositions);
    } catch (error) {
      console.error('Error actualizando PnL de posiciones:', error);
    }
  }, [positions]);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estado
    isLoading,
    error,
    positions,
    isConnected,
    userAddress,
    
    // Acciones
    openLongPosition,
    openShortPosition,
    closePosition,
    updatePositionsPnL,
    clearError,
  };
};
