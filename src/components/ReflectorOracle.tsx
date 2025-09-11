import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useReflectorEnhanced } from '@/hooks/use-reflector-enhanced';
import { ReflectorPriceData } from '@/hooks/use-reflector-enhanced';

export const ReflectorOracle = () => {
  const { 
    contractInfo, 
    prices, 
    getPrices, 
    getRealTimePrice, 
    isLoading, 
    error,
    clearError 
  } = useReflectorEnhanced(false);

  const [realTimePrices, setRealTimePrices] = useState<ReflectorPriceData[]>([]);
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);

  // Activos a monitorear
  const assets = ['XLM', 'BTC', 'ETH', 'SOL', 'ADA'];

  useEffect(() => {
    // Cargar precios iniciales
    console.log('🔄 ReflectorOracle: Cargando precios iniciales para activos:', assets);
    getPrices(assets);
  }, [getPrices]);

  // Activar precios en tiempo real
  useEffect(() => {
    if (isRealTimeActive) {
      const cleanupFunctions: (() => void)[] = [];

      assets.forEach(asset => {
        getRealTimePrice(asset, (price) => {
          setRealTimePrices(prev => {
            const existing = prev.find(p => p.asset === asset);
            if (existing) {
              return prev.map(p => p.asset === asset ? price : p);
            } else {
              return [...prev, price];
            }
          });
        });
        const cleanup = getRealTimePrice(asset, (price) => {
          setRealTimePrices(prev => {
            const existing = prev.find(p => p.asset === asset);
            if (existing) {
              return prev.map(p => p.asset === asset ? price : p);
            } else {
              return [...prev, price];
            }
          });
        });
        cleanupFunctions.push(cleanup);
      });

      return () => {
        cleanupFunctions.forEach(cleanup => cleanup());
      };
    }
  }, [isRealTimeActive, getRealTimePrice]);

  const toggleRealTime = () => {
    setIsRealTimeActive(!isRealTimeActive);
  };

  const refreshPrices = () => {
    getPrices(assets);
  };

  const getPriceChange = (asset: string) => {
    const realTimePrice = realTimePrices.find(p => p.asset === asset);
    const staticPrice = prices.find(p => p.asset === asset);
    
    if (realTimePrice && staticPrice) {
      return ((realTimePrice.price - staticPrice.price) / staticPrice.price) * 100;
    }
    return 0;
  };

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else if (price >= 0.01) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error}
          <Button variant="outline" size="sm" onClick={clearError} className="ml-2">
            Dismiss
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Estado del Oráculo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Estado del Oráculo Reflector</span>
            <Badge variant={contractInfo?.isActive ? "default" : "secondary"}>
              {contractInfo?.isActive ? "Activo" : "Inactivo"}
            </Badge>
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              TESTNET
            </Badge>
          </CardTitle>
          <p className="text-sm text-orange-600 font-medium">
            ⚠️ Los precios mostrados son datos de prueba. Para precios reales usa Mainnet.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Estado:</span>
              <span className="ml-2 font-medium">
                {contractInfo?.isActive ? "Operativo" : "Mantenimiento"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Última Actualización:</span>
              <span className="ml-2 font-medium">
                {contractInfo?.network ? "Testnet" : "N/A"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Total de Feeds:</span>
              <span className="ml-2 font-medium">{contractInfo?.decimals || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controles */}
      <div className="flex space-x-2">
        <Button 
          onClick={refreshPrices} 
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar Precios
        </Button>
        <Button 
          onClick={toggleRealTime} 
          variant={isRealTimeActive ? "default" : "outline"}
          size="sm"
        >
          {isRealTimeActive ? "Desactivar" : "Activar"} Tiempo Real
        </Button>
      </div>

      {/* Precios de Activos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map(asset => {
          const price = realTimePrices.find(p => p.asset === asset) || prices.find(p => p.asset === asset);
          const priceChange = getPriceChange(asset);
          const isRealTime = realTimePrices.find(p => p.asset === asset);

          if (!price) return null;

          return (
            <Card key={asset} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{asset}</CardTitle>
                  {isRealTime && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {formatPrice(price.price)}
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-muted-foreground">Fuente:</span>
                    <span className="font-medium">{price.source}</span>
                  </div>
                  {priceChange !== 0 && (
                    <div className={`flex items-center space-x-1 text-sm ${
                      priceChange > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {priceChange > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{Math.abs(priceChange).toFixed(2)}%</span>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Última actualización: {new Date(price.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Información del Oráculo */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Oráculo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              Reflector es un oráculo push-based nativo de Stellar que proporciona feeds de precios 
              para activos clásicos, tasas FX y CEXs/DEXs.
            </p>
            <p>
              Los precios se actualizan automáticamente y se utilizan para calcular funding rates 
              dinámicos basados en la diferencia entre precios spot y futuros.
            </p>
            <p>
              <strong>Fuente:</strong> {prices[0]?.source || 'Reflector Network'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
