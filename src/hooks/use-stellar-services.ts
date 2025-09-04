import { useState, useEffect, useCallback } from 'react';
import { ReflectorService, ReflectorPriceData } from '@/lib/reflector';
import { KaleService, KaleStakingData, KaleTask, KaleReward } from '@/lib/kale';
import { useWalletSimple } from './use-wallet-simple';

// Hook para usar los servicios de Stellar
export const useStellarServices = () => {
  const { walletInfo, isConnected } = useWalletSimple();
  
  // Debug logs
  console.log('🔍 useStellarServices debug:', { 
    walletInfo, 
    isConnected, 
    publicKey: walletInfo?.publicKey 
  });
  const [reflectorService] = useState(() => new ReflectorService());
  const [kaleService] = useState(() => new KaleService());
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para precios de Reflector
  const [prices, setPrices] = useState<ReflectorPriceData[]>([]);
  const [oracleStatus, setOracleStatus] = useState<any>(null);

  // Estado para KALE
  const [stakingData, setStakingData] = useState<KaleStakingData | null>(null);
  const [availableTasks, setAvailableTasks] = useState<KaleTask[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // Inicializar servicios
  useEffect(() => {
    const initializeServices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        await Promise.all([
          reflectorService.initialize(),
          kaleService.initialize(),
        ]);
        
        // Obtener estado inicial
        const status = await reflectorService.getOracleStatus();
        setOracleStatus(status);
        
        const tasks = await kaleService.getAvailableTasks();
        setAvailableTasks(tasks);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error initializing services');
      } finally {
        setIsLoading(false);
      }
    };

    initializeServices();
  }, [reflectorService, kaleService]);

  // Obtener precios de múltiples activos
  const getPrices = useCallback(async (assets: string[]) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const priceData = await reflectorService.getPrices(assets);
      setPrices(priceData);
      
      return priceData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error getting prices');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [reflectorService]);

  // Obtener precio en tiempo real
  const getRealTimePrice = useCallback((asset: string, callback: (price: ReflectorPriceData) => void) => {
    return reflectorService.getRealTimePrice(asset, callback);
  }, [reflectorService]);

  // Obtener datos de staking del usuario
  const getUserStakingData = useCallback(async (userAddress?: string) => {
    // Si no se proporciona dirección, usar la de la wallet conectada
    const address = userAddress || walletInfo?.publicKey;
    if (!address) {
      setError('No wallet connected');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const data = await kaleService.getUserStakingData(address);
      setStakingData(data);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error getting staking data');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [kaleService, walletInfo?.publicKey]);

  // Stake tokens
  const stakeTokens = useCallback(async (amount: number, userAddress?: string) => {
    const address = userAddress || walletInfo?.publicKey;
    if (!address) {
      setError('No wallet connected');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const success = await kaleService.stakeTokens(address, amount);
      
      if (success) {
        // Actualizar datos de staking
        await getUserStakingData(address);
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error staking tokens');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [kaleService, getUserStakingData, walletInfo?.publicKey]);

  // Unstake tokens
  const unstakeTokens = useCallback(async (amount: number, userAddress?: string) => {
    const address = userAddress || walletInfo?.publicKey;
    if (!address) {
      setError('No wallet connected');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const success = await kaleService.unstakeTokens(address, amount);
      
      if (success) {
        // Actualizar datos de staking
        await getUserStakingData(address);
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error unstaking tokens');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [kaleService, getUserStakingData, walletInfo?.publicKey]);

  // Harvest recompensas
  const harvestRewards = useCallback(async (userAddress?: string) => {
    const address = userAddress || walletInfo?.publicKey;
    if (!address) {
      setError('No wallet connected');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const reward = await kaleService.harvestRewards(address);
      
      if (reward) {
        // Actualizar datos de staking
        await getUserStakingData(address);
      }
      
      return reward;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error harvesting rewards');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [kaleService, getUserStakingData, walletInfo?.publicKey]);

  // Completar tarea
  const completeTask = useCallback(async (taskId: string, userAddress?: string) => {
    const address = userAddress || walletInfo?.publicKey;
    if (!address) {
      setError('No wallet connected');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const success = await kaleService.completeTask(address, taskId);
      
      if (success) {
        // Actualizar tareas disponibles
        const tasks = await kaleService.getAvailableTasks();
        setAvailableTasks(tasks);
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error completing task');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [kaleService, walletInfo?.publicKey]);

  // Obtener estadísticas del usuario
  const getUserStats = useCallback(async (userAddress?: string) => {
    const address = userAddress || walletInfo?.publicKey;
    if (!address) {
      setError('No wallet connected');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const stats = await kaleService.getUserStats(address);
      setUserStats(stats);
      
      return stats;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error getting user stats');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [kaleService, walletInfo?.publicKey]);

  // Obtener leaderboard
  const getLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const leaderboardData = await kaleService.getLeaderboard();
      setLeaderboard(leaderboardData);
      
      return leaderboardData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error getting leaderboard');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [kaleService]);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Servicios
    reflectorService,
    kaleService,
    
    // Estado
    isLoading,
    error,
    prices,
    oracleStatus,
    stakingData,
    availableTasks,
    userStats,
    leaderboard,
    
    // Métodos de Reflector
    getPrices,
    getRealTimePrice,
    
    // Métodos de KALE
    getUserStakingData,
    stakeTokens,
    unstakeTokens,
    harvestRewards,
    completeTask,
    getUserStats,
    getLeaderboard,
    
    // Utilidades
    clearError,
    isConnected,
    userAddress: walletInfo?.publicKey,
  };
};
