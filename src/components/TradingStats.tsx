import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Activity,
  BarChart3,
  Users,
  Zap
} from 'lucide-react';

interface TradingStats {
  totalVolume: number;
  totalTrades: number;
  activePositions: number;
  totalUsers: number;
  totalPnL: number;
  winRate: number;
  avgTradeSize: number;
  liquidations: number;
}

interface TradingStatsProps {
  className?: string;
}

export const TradingStats = ({ className = '' }: TradingStatsProps) => {
  const [stats, setStats] = useState<TradingStats>({
    totalVolume: 0,
    totalTrades: 0,
    activePositions: 0,
    totalUsers: 0,
    totalPnL: 0,
    winRate: 0,
    avgTradeSize: 0,
    liquidations: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de estadísticas
    const loadStats = async () => {
      setIsLoading(true);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos simulados para el hackathon
      setStats({
        totalVolume: 2847392.45,
        totalTrades: 1247,
        activePositions: 89,
        totalUsers: 156,
        totalPnL: 45678.90,
        winRate: 67.8,
        avgTradeSize: 2284.50,
        liquidations: 23
      });
      
      setIsLoading(false);
    };

    loadStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <Card className={`bg-slate-900/80 border-cyan-500/20 backdrop-blur-sm ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-cyan-300">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>Trading Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded mb-2"></div>
                <div className="h-6 bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-slate-900/80 border-cyan-500/20 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-cyan-300">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>Trading Statistics</span>
          </CardTitle>
          <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Volume */}
          <div className="text-center p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatCurrency(stats.totalVolume)}
            </div>
            <div className="text-sm text-gray-400">Total Volume</div>
          </div>

          {/* Total Trades */}
          <div className="text-center p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center justify-center mb-2">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatNumber(stats.totalTrades)}
            </div>
            <div className="text-sm text-gray-400">Total Trades</div>
          </div>

          {/* Active Positions */}
          <div className="text-center p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatNumber(stats.activePositions)}
            </div>
            <div className="text-sm text-gray-400">Active Positions</div>
          </div>

          {/* Total Users */}
          <div className="text-center p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatNumber(stats.totalUsers)}
            </div>
            <div className="text-sm text-gray-400">Total Users</div>
          </div>

          {/* Total PnL */}
          <div className="text-center p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center justify-center mb-2">
              {stats.totalPnL >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className={`text-2xl font-bold mb-1 ${stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(stats.totalPnL)}
            </div>
            <div className="text-sm text-gray-400">Total PnL</div>
          </div>

          {/* Win Rate */}
          <div className="text-center p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {formatPercentage(stats.winRate)}
            </div>
            <div className="text-sm text-gray-400">Win Rate</div>
          </div>

          {/* Average Trade Size */}
          <div className="text-center p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatCurrency(stats.avgTradeSize)}
            </div>
            <div className="text-sm text-gray-400">Avg Trade Size</div>
          </div>

          {/* Liquidations */}
          <div className="text-center p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-400 mb-1">
              {formatNumber(stats.liquidations)}
            </div>
            <div className="text-sm text-gray-400">Liquidations</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
