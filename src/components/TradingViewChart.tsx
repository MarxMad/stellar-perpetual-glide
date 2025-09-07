import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

interface TradingViewChartProps {
  symbol?: string;
  height?: number;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
  symbol = 'XLMUSDT', 
  height = 400 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartType, setChartType] = useState<'tradingview' | 'simple' | 'candlestick'>('tradingview');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (chartType === 'tradingview' && containerRef.current && !isLoaded) {
      // TradingView Widget
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: `BINANCE:${symbol}`,
        interval: '15',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#1e293b',
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        container_id: 'tradingview_chart',
        studies: [
          'RSI@tv-basicstudies',
          'MACD@tv-basicstudies'
        ]
      });

      containerRef.current.appendChild(script);
      setIsLoaded(true);

      return () => {
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      };
    }
  }, [chartType, symbol, isLoaded]);

  const renderSimpleChart = () => (
    <div className="h-full flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-32 h-32 mx-auto relative">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
            </defs>
            <path
              d="M10,80 Q25,60 40,70 T70,50 T90,30"
              stroke="#06b6d4"
              strokeWidth="2"
              fill="none"
              className="circuit-pulse"
            />
            <path
              d="M10,80 Q25,60 40,70 T70,50 T90,30 L90,100 L10,100 Z"
              fill="url(#chartGradient)"
              opacity="0.3"
            />
            <circle cx="90" cy="30" r="3" fill="#06b6d4" className="particle-float" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-cyan-300 font-semibold">XLM/USDC</h3>
          <p className="text-2xl font-bold text-green-400">$0.1234</p>
          <p className="text-sm text-green-300">+2.45% (24h)</p>
        </div>
      </div>
    </div>
  );

  const renderCandlestickChart = () => (
    <div className="h-full p-4">
      <div className="grid grid-cols-12 gap-1 h-full">
        {Array.from({ length: 24 }, (_, i) => (
          <div key={i} className="flex flex-col justify-end">
            <div 
              className={`w-full rounded-sm ${
                Math.random() > 0.5 ? 'bg-green-400' : 'bg-red-400'
              }`}
              style={{ 
                height: `${Math.random() * 80 + 20}%`,
                opacity: 0.8
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="h-full bg-slate-900/80 border-cyan-500/20 backdrop-blur-sm relative overflow-hidden neon-glow">
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-cyan-300 hologram-flicker">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>Price Chart</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={chartType === 'tradingview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('tradingview')}
              className="text-xs px-2 py-1"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              TradingView
            </Button>
            <Button
              variant={chartType === 'simple' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('simple')}
              className="text-xs px-2 py-1"
            >
              <Activity className="w-3 h-3 mr-1" />
              Simple
            </Button>
            <Button
              variant={chartType === 'candlestick' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('candlestick')}
              className="text-xs px-2 py-1"
            >
              <BarChart3 className="w-3 h-3 mr-1" />
              Candles
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10 h-[calc(100%-80px)]">
        {chartType === 'tradingview' && (
          <div 
            ref={containerRef}
            id="tradingview_chart"
            className="w-full h-full"
            style={{ height: `${height - 80}px` }}
          />
        )}
        {chartType === 'simple' && renderSimpleChart()}
        {chartType === 'candlestick' && renderCandlestickChart()}
      </CardContent>
    </Card>
  );
};
