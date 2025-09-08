import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Clock,
  TrendingUp,
  Globe
} from 'lucide-react';
import { useStellarServices } from '@/hooks/use-stellar-services';

interface ReflectorStatusProps {
  className?: string;
}

export const ReflectorStatus = ({ className = '' }: ReflectorStatusProps) => {
  const { oracleStatus, prices, getPrices, isLoading, error } = useStellarServices();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isMainnet, setIsMainnet] = useState(false);

  useEffect(() => {
    // Simular verificación de mainnet
    const checkMainnet = () => {
      // En producción, esto verificaría la red real
      const isMainnetMode = process.env.NODE_ENV === 'production';
      setIsMainnet(isMainnetMode);
    };

    checkMainnet();
    
    // Actualizar timestamp cada 5 segundos
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-green-500/50 text-green-400 bg-green-500/10';
      case 'warning':
        return 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10';
      case 'error':
        return 'border-red-500/50 text-red-400 bg-red-500/10';
      default:
        return 'border-gray-500/50 text-gray-400 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <WifiOff className="w-4 h-4 text-red-400" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleRefresh = async () => {
    try {
      await getPrices(['XLM', 'BTC', 'ETH', 'SOL', 'ADA']);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error refreshing prices:', error);
    }
  };

  return (
    <Card className={`bg-slate-900/80 border-cyan-500/20 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-cyan-300">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>Reflector Oracle Status</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={getStatusColor(oracleStatus)}>
              {getStatusIcon(oracleStatus)}
              <span className="ml-1">{oracleStatus.toUpperCase()}</span>
            </Badge>
            <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10">
              <Globe className="w-3 h-3 mr-1" />
              {isMainnet ? 'MAINNET' : 'TESTNET'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="text-lg font-bold text-white mb-1">
              {prices.length}
            </div>
            <div className="text-sm text-gray-400">Active Feeds</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="text-lg font-bold text-white mb-1">
              {formatTime(lastUpdate)}
            </div>
            <div className="text-sm text-gray-400">Last Update</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="text-lg font-bold text-white mb-1">
              {isLoading ? '...' : '5s'}
            </div>
            <div className="text-sm text-gray-400">Update Interval</div>
          </div>
        </div>

        {/* Price Feeds */}
        <div>
          <h4 className="text-sm font-semibold text-cyan-300 mb-3">Active Price Feeds</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {prices.map((price) => (
              <div key={price.asset} className="flex items-center justify-between p-2 rounded bg-slate-800/30 border border-slate-700/30">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-white">{price.asset}</span>
                </div>
                <div className="text-sm text-cyan-400">
                  ${price.price.toFixed(4)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Information */}
        <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-cyan-300">Network Information</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Network</div>
              <div className="text-white font-medium">
                {isMainnet ? 'Stellar Mainnet' : 'Stellar Testnet'}
              </div>
            </div>
            <div>
              <div className="text-gray-400">Contract</div>
              <div className="text-white font-medium font-mono text-xs">
                {isMainnet 
                  ? 'CBNGTWIVRCD4FOJ24FGAKI6I5SDAXI7A4GWKSQS7E6UYSR4E4OHRI2JX'
                  : 'CBNGTWIVRCD4FOJ24FGAKI6I5SDAXI7A4GWKSQS7E6UYSR4E4OHRI2JX'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Demo Notice */}
        {!isMainnet && (
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <Clock className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-300">
              Currently running on Testnet. Switch to Mainnet for production use.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
