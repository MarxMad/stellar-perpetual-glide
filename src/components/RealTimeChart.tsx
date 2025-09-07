import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BarChart3, TrendingUp, Activity, RefreshCw, Loader2 } from 'lucide-react';
import { useCoinGecko, CoinGeckoMarketData } from '../hooks/use-coingecko';

interface RealTimeChartProps {
  coinId?: string;
  height?: number;
}

export const RealTimeChart: React.FC<RealTimeChartProps> = ({ 
  coinId = 'stellar', 
  height = 400 
}) => {
  const { price, marketData, loading, error, fetchPeriodData } = useCoinGecko(coinId);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [chartType, setChartType] = useState<'line' | 'candlestick' | 'area'>('line');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const periods = [
    { key: '1d', label: '1D', days: 1 },
    { key: '7d', label: '7D', days: 7 },
    { key: '30d', label: '30D', days: 30 },
    { key: '90d', label: '90D', days: 90 },
    { key: '1y', label: '1Y', days: 365 }
  ];

  // Dibujar gráfico en canvas
  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || !marketData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Obtener el tamaño del contenedor
    const container = canvas.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Establecer el tamaño del canvas
    canvas.width = width;
    canvas.height = height;

    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);

    // Configurar estilos
    ctx.strokeStyle = '#06b6d4';
    ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
    ctx.lineWidth = 2;

    if (marketData.prices.length === 0) return;

    // Encontrar min y max
    const prices = marketData.prices.map(([_, price]) => price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Dibujar grid
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Dibujar línea de precio
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();

    marketData.prices.forEach(([timestamp, price], index) => {
      const x = padding + (chartWidth / (marketData.prices.length - 1)) * index;
      const y = padding + chartHeight - ((price - minPrice) / priceRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Rellenar área bajo la línea
    if (chartType === 'area' || chartType === 'line') {
      ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
      ctx.lineTo(width - padding, padding + chartHeight);
      ctx.lineTo(padding, padding + chartHeight);
      ctx.closePath();
      ctx.fill();
    }

    // Dibujar puntos
    ctx.fillStyle = '#06b6d4';
    marketData.prices.forEach(([timestamp, price], index) => {
      const x = padding + (chartWidth / (marketData.prices.length - 1)) * index;
      const y = padding + chartHeight - ((price - minPrice) / priceRange) * chartHeight;

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Dibujar etiquetas de precio
    ctx.fillStyle = '#06b6d4';
    ctx.font = '12px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`$${maxPrice.toFixed(4)}`, padding - 10, padding + 15);
    ctx.fillText(`$${minPrice.toFixed(4)}`, padding - 10, padding + chartHeight - 5);
  };

  // Redibujar cuando cambien los datos
  useEffect(() => {
    drawChart();
  }, [marketData, chartType]);

  // Redimensionar canvas cuando cambie el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      drawChart();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [marketData, chartType]);

  // Manejar cambio de período
  const handlePeriodChange = async (period: typeof periods[0]) => {
    setSelectedPeriod(period.key);
    await fetchPeriodData(period.days);
  };

  // Obtener color del cambio de precio
  const getPriceChangeColor = () => {
    if (!price) return 'text-gray-400';
    return price.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getPriceChangeIcon = () => {
    if (!price) return null;
    return price.price_change_percentage_24h >= 0 ? 
      <TrendingUp className="w-4 h-4" /> : 
      <TrendingUp className="w-4 h-4 rotate-180" />;
  };

  return (
    <Card className="h-full bg-slate-900/80 border-cyan-500/20 backdrop-blur-sm relative overflow-hidden neon-glow scan-line">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-teal-500/5 energy-flow"></div>
      
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-cyan-300 hologram-flicker">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>Price Chart</span>
            {price && (
              <Badge variant="outline" className="text-xs">
                {price.symbol?.toUpperCase()}/USDC
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex space-x-2">
            {periods.map((period) => (
              <Button
                key={period.key}
                variant={selectedPeriod === period.key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handlePeriodChange(period)}
                className="text-xs px-2 py-1"
                disabled={loading}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Información de precio */}
        {price && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <div>
                <div className="text-2xl font-bold text-white">
                  ${typeof price.current_price === 'number' ? price.current_price.toFixed(4) : '0.0000'}
                </div>
                <div className={`flex items-center space-x-1 text-sm ${getPriceChangeColor()}`}>
                  {getPriceChangeIcon()}
                  <span>{typeof price.price_change_percentage_24h === 'number' ? price.price_change_percentage_24h.toFixed(2) : '0.00'}%</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-400 space-y-1">
                <div>24h High: <span className="text-green-400">${typeof price.high_24h === 'number' ? price.high_24h.toFixed(4) : '0.0000'}</span></div>
                <div>24h Low: <span className="text-red-400">${typeof price.low_24h === 'number' ? price.low_24h.toFixed(4) : '0.0000'}</span></div>
                <div>Volume: <span className="text-cyan-400">${typeof price.total_volume === 'number' ? (price.total_volume / 1000000).toFixed(1) : '0.0'}M</span></div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant={chartType === 'line' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('line')}
                className="text-xs px-2 py-1"
              >
                <Activity className="w-3 h-3 mr-1" />
                Line
              </Button>
              <Button
                variant={chartType === 'area' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('area')}
                className="text-xs px-2 py-1"
              >
                <BarChart3 className="w-3 h-3 mr-1" />
                Area
              </Button>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="relative z-10 h-[calc(100%-120px)]">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto" />
              <p className="text-gray-400">Cargando datos del mercado...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="text-red-400 text-lg">⚠️ Error</div>
              <p className="text-gray-400">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </div>
          </div>
        )}

        {!loading && !error && marketData && (
          <div className="h-full w-full">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          </div>
        )}

        {!loading && !error && !marketData && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="text-gray-400 text-lg">📊</div>
              <p className="text-gray-400">No hay datos disponibles</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
