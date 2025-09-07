import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bell, 
  Globe, 
  Zap, 
  Clock, 
  DollarSign,
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { reflectorTestnetClient, reflectorMainnetClient, ReflectorTicker } from '@/lib/reflector-enhanced-client';

interface SubscriptionInfo {
  id: string;
  base: string;
  quote: string;
  threshold: number;
  heartbeat: number;
  balance: string;
  active: boolean;
}

export const ReflectorSubscriptions = () => {
  const [tickers, setTickers] = useState<ReflectorTicker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMainnet, setUseMainnet] = useState(false);

  useEffect(() => {
    loadTickers();
  }, [useMainnet]);

  const loadTickers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const client = useMainnet ? reflectorMainnetClient : reflectorTestnetClient;
      const availableTickers = await client.getAvailableTickers();
      
      // Filtrar solo los primeros 20 para mostrar
      setTickers(availableTickers.slice(0, 20));
    } catch (err) {
      console.error('Error loading tickers:', err);
      setError('Error cargando tickers disponibles');
    } finally {
      setLoading(false);
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'pubnet':
        return 'bg-blue-100 text-blue-800';
      case 'exchanges':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'pubnet':
        return 'Stellar Network';
      case 'exchanges':
        return 'External Exchanges';
      default:
        return source;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Reflector Subscriptions</span>
          </CardTitle>
          <CardDescription>
            Cargando tickers disponibles...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con toggle de red */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Reflector Subscriptions</span>
              </CardTitle>
              <CardDescription>
                Sistema de suscripciones para feeds de precios en tiempo real
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={useMainnet ? "default" : "secondary"}>
                {useMainnet ? 'Mainnet' : 'Testnet'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUseMainnet(!useMainnet)}
              >
                Cambiar a {useMainnet ? 'Testnet' : 'Mainnet'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Información sobre suscripciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>¿Qué son las Suscripciones de Reflector?</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Triggers Automáticos</h4>
                <p className="text-sm text-muted-foreground">
                  Notificaciones cuando el precio cambia más del umbral configurado
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Heartbeat Regular</h4>
                <p className="text-sm text-muted-foreground">
                  Actualizaciones periódicas incluso sin cambios de precio
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <DollarSign className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Pago por Uso</h4>
                <p className="text-sm text-muted-foreground">
                  Solo pagas por las notificaciones que recibes
                </p>
              </div>
            </div>
          </div>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Beta:</strong> Las suscripciones están en beta pública. 
              El formato de datos y condiciones del servicio pueden cambiar.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Tickers disponibles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Tickers Disponibles</span>
          </CardTitle>
          <CardDescription>
            Activos disponibles para crear suscripciones ({tickers.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {tickers.map((ticker, index) => (
              <div
                key={`${ticker.symbol}-${ticker.source}-${index}`}
                className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{ticker.symbol}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getSourceColor(ticker.source)}`}
                  >
                    {getSourceLabel(ticker.source)}
                  </Badge>
                </div>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Información sobre webhooks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ExternalLink className="h-5 w-5" />
            <span>Configuración de Webhooks</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Formato de Notificación</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Cuando se activa una suscripción, Reflector envía una notificación POST a tu webhook:
            </p>
            <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
{`{
  "update": {
    "contract": "CBNGTWIVRCD4FOJ24FGAKI6I5SDAXI7A4GWKSQS7E6UYSR4E4OHRI2JX",
    "event": {
      "subscription": "16",
      "base": {"source": "pubnet", "asset": "XLM"},
      "quote": {"source": "exchanges", "asset": "BTC"},
      "price": "21749494669965161500",
      "prevPrice": "21688544256328711209",
      "timestamp": 1725578340000
    }
  },
  "signature": "FLS6e1auSAdPjDTlb/EKfrv2KvZ1juMRX4zaXCNQWyyjciN4h3kV5hkbfEdjVYTKZmOHaXBod+QFjZPIBEEuCA==",
  "verifier": "GCQTHGZAYIJB3SEMFJZABA7V7QIAJVRD72GHQAYNHHRBIMOMUXMWBPG3"
}`}
            </pre>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => window.open('https://reflector.network/subscription/add', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Crear Suscripción
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('https://reflector.network', '_blank')}
            >
              <Globe className="h-4 w-4 mr-2" />
              Ver Documentación
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
