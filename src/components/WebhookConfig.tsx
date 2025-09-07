import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Webhook, 
  Copy, 
  CheckCircle, 
  ExternalLink,
  AlertCircle,
  Globe,
  Zap
} from 'lucide-react';

export const WebhookConfig = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [threshold, setThreshold] = useState('1');
  const [heartbeat, setHeartbeat] = useState('15');
  const [copied, setCopied] = useState(false);

  // URL base de tu aplicación (se actualizará automáticamente en Vercel)
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? (typeof window !== 'undefined' ? window.location.origin : 'https://tu-app.vercel.app')
    : 'http://localhost:3000';

  const fullWebhookUrl = `${baseUrl}/api/webhook-reflector`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullWebhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying URL:', err);
    }
  };

  const assets = [
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'SOL', name: 'Solana' },
    { symbol: 'XLM', name: 'Stellar' },
    { symbol: 'USDC', name: 'USD Coin' },
  ];

  return (
    <div className="space-y-6">
      {/* Configuración del Webhook */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Webhook className="h-5 w-5" />
            <span>Configuración del Webhook</span>
          </CardTitle>
          <CardDescription>
            Configura tu webhook para recibir notificaciones de Reflector en tiempo real
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL del Webhook</Label>
            <div className="flex space-x-2">
              <Input
                id="webhook-url"
                value={fullWebhookUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyUrl}
                disabled={copied}
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Copia esta URL y úsala en Reflector Network
            </p>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>URL del Webhook:</strong> {fullWebhookUrl}
              <br />
              <strong>Estado:</strong> {process.env.NODE_ENV === 'production' ? '✅ Producción' : '🔧 Desarrollo'}
              {process.env.NODE_ENV === 'production' && (
                <span className="text-green-600 ml-2">Listo para Reflector Network</span>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Configuración de Suscripción */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Configuración de Suscripción</span>
          </CardTitle>
          <CardDescription>
            Parámetros recomendados para tu suscripción en Reflector
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asset">Activo a Monitorear</Label>
              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.symbol} value={asset.symbol}>
                      {asset.symbol} - {asset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="threshold">Umbral de Activación (%)</Label>
              <Select value={threshold} onValueChange={setThreshold}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.1">0.1%</SelectItem>
                  <SelectItem value="0.5">0.5%</SelectItem>
                  <SelectItem value="1">1%</SelectItem>
                  <SelectItem value="2">2%</SelectItem>
                  <SelectItem value="5">5%</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="heartbeat">Intervalo Heartbeat (minutos)</Label>
              <Select value={heartbeat} onValueChange={setHeartbeat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutos</SelectItem>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Red</Label>
              <div className="flex items-center space-x-2">
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Mainnet
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Datos reales de mercado
                </span>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Configuración Recomendada:</h4>
            <div className="text-sm space-y-1">
              <p><strong>Data source:</strong> Aggregated CEX & DEX</p>
              <p><strong>Quote ticker:</strong> {selectedAsset}</p>
              <p><strong>Base ticker:</strong> USD</p>
              <p><strong>Trigger threshold:</strong> {threshold}%</p>
              <p><strong>Heartbeat interval:</strong> {heartbeat} minutes</p>
              <p><strong>Initial balance:</strong> 10 XRF</p>
              <p><strong>Webhook URL:</strong> {fullWebhookUrl}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => window.open('https://reflector.network/subscription/add', '_blank')}
              className="flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Crear Suscripción en Reflector</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.open('https://reflector.network', '_blank')}
              className="flex items-center space-x-2"
            >
              <Globe className="h-4 w-4" />
              <span>Ver Documentación</span>
            </Button>

            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const response = await fetch('/api/webhook-reflector', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ test: 'webhook', timestamp: Date.now() })
                  });
                  
                  if (response.ok) {
                    alert('✅ Webhook funcionando correctamente!');
                  } else {
                    alert('❌ Error en el webhook: ' + response.status);
                  }
                } catch (error) {
                  alert('❌ Error al probar webhook: ' + error);
                }
              }}
              className="flex items-center space-x-2"
            >
              <Zap className="h-4 w-4" />
              <span>Probar Webhook</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información sobre el Webhook */}
      <Card>
        <CardHeader>
          <CardTitle>¿Cómo Funciona el Webhook?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium">Configuración</h4>
                <p className="text-sm text-muted-foreground">
                  Crea una suscripción en Reflector con tu webhook URL
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium">Monitoreo</h4>
                <p className="text-sm text-muted-foreground">
                  Reflector monitorea el precio del activo cada minuto
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium">Notificación</h4>
                <p className="text-sm text-muted-foreground">
                  Cuando el precio cambia más del umbral, se envía una notificación POST a tu webhook
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                4
              </div>
              <div>
                <h4 className="font-medium">Acción</h4>
                <p className="text-sm text-muted-foreground">
                  Tu aplicación puede ejecutar liquidaciones, alertas o trading automático
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
