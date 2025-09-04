import { useMemo, useEffect, useState } from "react";
import { useStellarServices } from "@/hooks/use-stellar-services";

export const PriceChart = () => {
  const { prices, getPrices } = useStellarServices();
  const [currentPrice, setCurrentPrice] = useState(0.1234);
  const [priceChange, setPriceChange] = useState(2.45);

  // Obtener precio actual de XLM
  useEffect(() => {
    const xlmPrice = prices.find(p => p.asset === 'XLM');
    if (xlmPrice) {
      setCurrentPrice(xlmPrice.price);
      console.log('📈 PriceChart: Precio actual de XLM:', xlmPrice.price);
    }
  }, [prices]);

  // Generar datos del gráfico basados en precio real
  const chartData = useMemo(() => {
    const data = [];
    let price = currentPrice;
    const now = Date.now();
    
    for (let i = 100; i >= 0; i--) {
      const timestamp = now - (i * 15 * 60 * 1000); // 15 min intervals
      price += (Math.random() - 0.5) * 0.002;
      data.push({
        time: timestamp,
        price: Math.max(currentPrice * 0.8, Math.min(currentPrice * 1.2, price)),
        volume: Math.random() * 1000000 + 500000
      });
    }
    return data;
  }, [currentPrice]);

  // Simple canvas-based chart
  return (
    <div className="relative w-full h-full min-h-[300px] bg-background/50 rounded-lg p-4">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Mock Chart Visual */}
        <svg
          className="w-full h-full"
          viewBox="0 0 800 400"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="hsl(var(--chart-grid))"
                strokeWidth="0.5"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Price line */}
          <path
            d={chartData
              .map((point, index) => {
                const x = (index / (chartData.length - 1)) * 800;
                const y = 400 - ((point.price - 0.08) / (0.16 - 0.08)) * 400;
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
              })
              .join(' ')}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            className="drop-shadow-sm"
          />

          {/* Gradient fill */}
          <defs>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            d={`${chartData
              .map((point, index) => {
                const x = (index / (chartData.length - 1)) * 800;
                const y = 400 - ((point.price - 0.08) / (0.16 - 0.08)) * 400;
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
              })
              .join(' ')} L 800 400 L 0 400 Z`}
            fill="url(#priceGradient)"
          />
        </svg>
      </div>

      {/* Price labels */}
      <div className="absolute left-2 top-2 text-sm text-muted-foreground">
        <div>High: ${(currentPrice * 1.05).toFixed(4)}</div>
        <div>Low: ${(currentPrice * 0.95).toFixed(4)}</div>
      </div>

      {/* Current price indicator */}
      <div className="absolute right-2 top-2 bg-primary/20 border border-primary/30 rounded px-2 py-1">
        <span className="text-sm font-mono text-primary">${currentPrice.toFixed(4)}</span>
      </div>
    </div>
  );
};