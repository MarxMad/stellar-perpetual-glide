import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  Info,
  Clock,
  DollarSign
} from 'lucide-react';
import { useStellarServices } from '@/hooks/use-stellar-services';
import { ReflectorService } from '@/lib/reflector';

export const FundingRates = () => {
  const { prices, getPrices, isLoading, error, clearError } = useStellarServices();
  const [reflectorService] = useState(() => new ReflectorService());

  const [selectedPair, setSelectedPair] = useState('XLM/USDC');
  const [spotPrice, setSpotPrice] = useState('');
  const [futuresPrice, setFuturesPrice] = useState('');
  const [volatility, setVolatility] = useState('0.1');
  const [fundingRate, setFundingRate] = useState<number | null>(null);
  const [nextFunding, setNextFunding] = useState<Date | null>(null);

  // Pares de trading disponibles
  const tradingPairs = [
    'XLM/USDC',
    'BTC/USDC',
    'ETH/USDC',
    'SOL/USDC',
    'ADA/USDC',
  ];

  // Calcular funding rate
  const calculateFundingRate = () => {
    const spot = parseFloat(spotPrice);
    const futures = parseFloat(futuresPrice);
    const vol = parseFloat(volatility);

    if (spot > 0 && futures > 0) {
      const rate = reflectorService.calculateFundingRate(spot, futures, vol);
      setFundingRate(rate);
      
      // Calcular próximo funding (cada 8 horas)
      const now = new Date();
      const nextFundingTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
      setNextFunding(nextFundingTime);
    }
  };

  // Auto-llenar precios desde Reflector
  const autoFillPrices = async () => {
    const [base, quote] = selectedPair.split('/');
    const basePrice = prices.find(p => p.asset === base);
    const quotePrice = prices.find(p => p.asset === quote);

    if (basePrice && quotePrice) {
      const calculatedSpotPrice = basePrice.price / quotePrice.price;
      setSpotPrice(calculatedSpotPrice.toFixed(6));
      setFuturesPrice(calculatedSpotPrice.toFixed(6));
    }
  };

  // Obtener precios cuando cambie el par seleccionado
  useEffect(() => {
    const [base, quote] = selectedPair.split('/');
    getPrices([base, quote]);
  }, [selectedPair, getPrices]);

  // Calcular funding rate cuando cambien los precios
  useEffect(() => {
    if (spotPrice && futuresPrice) {
      calculateFundingRate();
    }
  }, [spotPrice, futuresPrice, volatility]);

  const getFundingRateColor = (rate: number) => {
    if (rate > 0.001) return 'text-green-600';
    if (rate < -0.001) return 'text-red-600';
    return 'text-gray-600';
  };

  const getFundingRateBadge = (rate: number) => {
    if (rate > 0.001) return 'bg-green-100 text-green-800';
    if (rate < -0.001) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatFundingRate = (rate: number) => {
    const percentage = rate * 100;
    if (percentage >= 0) {
      return `+${percentage.toFixed(4)}%`;
    }
    return `${percentage.toFixed(4)}%`;
  };

  const getFundingRateDescription = (rate: number) => {
    if (rate > 0.001) {
      return 'Los long positions pagan a los short positions';
    } else if (rate < -0.001) {
      return 'Los short positions pagan a los long positions';
    } else {
      return 'Funding rate neutral';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Funding Rates Dinámicos
        </h2>
        <p className="text-muted-foreground mt-2">
          Calcula funding rates basados en diferencias spot-futures y volatilidad del mercado
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculadora de Funding Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5" />
              <span>Calculadora</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selección de Par */}
            <div className="space-y-2">
              <Label htmlFor="trading-pair">Par de Trading</Label>
              <Select value={selectedPair} onValueChange={setSelectedPair}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un par" />
                </SelectTrigger>
                <SelectContent>
                  {tradingPairs.map((pair) => (
                    <SelectItem key={pair} value={pair}>
                      {pair}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Precio Spot */}
            <div className="space-y-2">
              <Label htmlFor="spot-price">Precio Spot</Label>
              <div className="flex space-x-2">
                <Input
                  id="spot-price"
                  type="number"
                  placeholder="0.000000"
                  value={spotPrice}
                  onChange={(e) => setSpotPrice(e.target.value)}
                  step="0.000001"
                />
                <Button 
                  onClick={autoFillPrices} 
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Precio Futures */}
            <div className="space-y-2">
              <Label htmlFor="futures-price">Precio Futures</Label>
              <Input
                id="futures-price"
                type="number"
                placeholder="0.000000"
                value={futuresPrice}
                onChange={(e) => setFuturesPrice(e.target.value)}
                step="0.000001"
              />
            </div>

            {/* Volatilidad */}
            <div className="space-y-2">
              <Label htmlFor="volatility">Volatilidad del Mercado</Label>
              <Select value={volatility} onValueChange={setVolatility}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona volatilidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.05">Baja (5%)</SelectItem>
                  <SelectItem value="0.1">Media (10%)</SelectItem>
                  <SelectItem value="0.15">Alta (15%)</SelectItem>
                  <SelectItem value="0.2">Muy Alta (20%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botón de Cálculo */}
            <Button 
              onClick={calculateFundingRate} 
              disabled={!spotPrice || !futuresPrice}
              className="w-full"
            >
              Calcular Funding Rate
            </Button>
          </CardContent>
        </Card>

        {/* Resultados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Resultados</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {fundingRate !== null ? (
              <>
                {/* Funding Rate Principal */}
                <div className="text-center space-y-2">
                  <div className="text-sm text-muted-foreground">Funding Rate</div>
                  <div className={`text-4xl font-bold ${getFundingRateColor(fundingRate)}`}>
                    {formatFundingRate(fundingRate)}
                  </div>
                  <Badge className={getFundingRateBadge(fundingRate)}>
                    {getFundingRateDescription(fundingRate)}
                  </Badge>
                </div>

                {/* Detalles del Cálculo */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Diferencia de Precio:</span>
                    <span className="font-medium">
                      {((parseFloat(futuresPrice) - parseFloat(spotPrice)) / parseFloat(spotPrice) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Volatilidad:</span>
                    <span className="font-medium">{(parseFloat(volatility) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Rate:</span>
                    <span className="font-medium">0.01%</span>
                  </div>
                </div>

                {/* Próximo Funding */}
                {nextFunding && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Próximo Funding</span>
                    </div>
                    <div className="text-lg font-semibold">
                      {nextFunding.toLocaleTimeString()} ({nextFunding.toLocaleDateString()})
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Ingresa los precios para calcular el funding rate</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Información sobre Funding Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>¿Qué son los Funding Rates?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-3">
            <p>
              Los funding rates son pagos periódicos entre long y short positions que ayudan 
              a mantener el precio de los futuros cerca del precio spot.
            </p>
            <p>
              <strong>¿Cómo se calculan?</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Base Rate:</strong> Tasa mínima del 0.01%</li>
              <li><strong>Ajuste por Precio:</strong> Basado en la diferencia spot-futures</li>
              <li><strong>Ajuste por Volatilidad:</strong> Mayor volatilidad = mayor funding rate</li>
            </ul>
            <p>
              <strong>Frecuencia:</strong> Los funding rates se aplican cada 8 horas (00:00, 08:00, 16:00 UTC).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Precios Actuales de Reflector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Precios Actuales (Reflector)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {prices.map((price) => (
              <div key={price.asset} className="text-center p-3 border rounded-lg">
                <div className="font-medium">{price.asset}</div>
                <div className="text-lg font-bold">
                  ${price.price >= 1 ? price.price.toFixed(2) : price.price.toFixed(6)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {(price.confidence * 100).toFixed(1)}% confianza
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
