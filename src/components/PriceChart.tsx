import { useMemo } from "react";

export const PriceChart = () => {
  // Mock chart data - in real app this would come from Stellar network
  const chartData = useMemo(() => {
    const data = [];
    let price = 0.1234;
    const now = Date.now();
    
    for (let i = 100; i >= 0; i--) {
      const timestamp = now - (i * 15 * 60 * 1000); // 15 min intervals
      price += (Math.random() - 0.5) * 0.002;
      data.push({
        time: timestamp,
        price: Math.max(0.08, Math.min(0.16, price)),
        volume: Math.random() * 1000000 + 500000
      });
    }
    return data;
  }, []);

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
        <div>High: $0.1289</div>
        <div>Low: $0.1198</div>
      </div>

      {/* Current price indicator */}
      <div className="absolute right-2 top-2 bg-primary/20 border border-primary/30 rounded px-2 py-1">
        <span className="text-sm font-mono text-primary">$0.1234</span>
      </div>
    </div>
  );
};