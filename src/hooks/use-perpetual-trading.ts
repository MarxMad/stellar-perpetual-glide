import { useState, useCallback } from 'react';
import { perpetualTradingClient, Position, ContractStats } from '../lib/perpetual-trading-client';

export interface TradingState {
  currentPosition: Position | null;
  traderPositions: number[];
  contractStats: ContractStats | null;
  contractBalance: number;
  isLoading: boolean;
  error: string | null;
}

export const usePerpetualTrading = () => {
  const [state, setState] = useState<TradingState>({
    currentPosition: null,
    traderPositions: [],
    contractStats: null,
    contractBalance: 0,
    isLoading: false,
    error: null,
  });

  // Abrir posición
  const openPosition = useCallback(async (
    traderAddress: string,
    marginAmount: number, // en XLM
    leverage: number,
    isLong: boolean
  ): Promise<number> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const marginInStroops = Math.floor(marginAmount * 10_000_000);
      const positionId = await perpetualTradingClient.openPosition(
        traderAddress,
        marginInStroops,
        leverage,
        isLong
      );
      
      // Actualizar estado después de abrir posición
      await refreshData();
      
      setState(prev => ({ ...prev, isLoading: false }));
      return positionId;
    } catch (error) {
      console.error('❌ Error abriendo posición:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error abriendo posición',
      }));
      throw error;
    }
  }, []);

  // Cerrar posición
  const closePosition = useCallback(async (
    traderAddress: string,
    positionId: number
  ): Promise<number> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const pnl = await perpetualTradingClient.closePosition(traderAddress, positionId);
      
      // Actualizar estado después de cerrar posición
      await refreshData();
      
      setState(prev => ({ ...prev, isLoading: false }));
      return pnl;
    } catch (error) {
      console.error('❌ Error cerrando posición:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error cerrando posición',
      }));
      throw error;
    }
  }, []);

  // Obtener posición actual
  const getCurrentPosition = useCallback(async (): Promise<Position | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const position = await perpetualTradingClient.getCurrentPosition();
      
      setState(prev => ({ ...prev, currentPosition: position, isLoading: false }));
      return position;
    } catch (error) {
      console.error('❌ Error obteniendo posición actual:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error obteniendo posición',
      }));
      return null;
    }
  }, []);

  // Obtener posiciones del trader
  const getTraderPositions = useCallback(async (traderAddress: string): Promise<number[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const positions = await perpetualTradingClient.getTraderPositions(traderAddress);
      
      setState(prev => ({ ...prev, traderPositions: positions, isLoading: false }));
      return positions;
    } catch (error) {
      console.error('❌ Error obteniendo posiciones del trader:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error obteniendo posiciones',
      }));
      return [];
    }
  }, []);

  // Obtener estadísticas del contrato
  const getContractStats = useCallback(async (): Promise<ContractStats | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const stats = await perpetualTradingClient.getContractStats();
      
      setState(prev => ({ ...prev, contractStats: stats, isLoading: false }));
      return stats;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error obteniendo estadísticas',
      }));
      return null;
    }
  }, []);

  // Obtener balance del contrato
  const getContractBalance = useCallback(async (): Promise<number> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const balance = await perpetualTradingClient.getContractBalance();
      
      setState(prev => ({ ...prev, contractBalance: balance, isLoading: false }));
      return balance;
    } catch (error) {
      console.error('❌ Error obteniendo balance:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error obteniendo balance',
      }));
      return 0;
    }
  }, []);

  // Retirar balance del contrato (solo admin)
  const withdrawContractBalance = useCallback(async (
    adminAddress: string,
    amount: number // en XLM
  ): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const amountInStroops = Math.floor(amount * 10_000_000);
      const success = await perpetualTradingClient.withdrawContractBalance(
        adminAddress,
        amountInStroops
      );
      
      // Actualizar balance después del retiro
      await getContractBalance();
      
      setState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      console.error('❌ Error retirando balance:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error retirando balance',
      }));
      return false;
    }
  }, [getContractBalance]);

  // Pausar contrato (solo admin)
  const pauseContract = useCallback(async (adminAddress: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const success = await perpetualTradingClient.pauseContract(adminAddress);
      
      setState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      console.error('❌ Error pausando contrato:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error pausando contrato',
      }));
      return false;
    }
  }, []);

  // Reanudar contrato (solo admin)
  const resumeContract = useCallback(async (adminAddress: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const success = await perpetualTradingClient.resumeContract(adminAddress);
      
      setState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      console.error('❌ Error reanudando contrato:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error reanudando contrato',
      }));
      return false;
    }
  }, []);

  // Refrescar todos los datos
  const refreshData = useCallback(async () => {
    try {
      await Promise.all([
        getCurrentPosition(),
        getContractStats(),
        getContractBalance(),
      ]);
    } catch (error) {
      console.error('❌ Error refrescando datos:', error);
    }
  }, [getCurrentPosition, getContractStats, getContractBalance]);

  // Limpiar error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    openPosition,
    closePosition,
    getCurrentPosition,
    getTraderPositions,
    getContractStats,
    getContractBalance,
    withdrawContractBalance,
    pauseContract,
    resumeContract,
    refreshData,
    clearError,
  };
};
