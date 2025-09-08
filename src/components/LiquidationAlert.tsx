import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  X, 
  Zap,
  DollarSign,
  Clock
} from 'lucide-react';

interface LiquidationEvent {
  id: string;
  positionId: string;
  asset: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  liquidationPrice: number;
  pnl: number;
  timestamp: number;
  reason: 'price_movement' | 'funding_rate' | 'margin_call';
}

interface LiquidationAlertProps {
  liquidations: LiquidationEvent[];
  onClose?: (liquidationId: string) => void;
  className?: string;
}

export const LiquidationAlert = ({ liquidations, onClose, className = '' }: LiquidationAlertProps) => {
  const [visibleLiquidations, setVisibleLiquidations] = useState<LiquidationEvent[]>([]);

  useEffect(() => {
    // Mostrar las últimas 5 liquidaciones
    setVisibleLiquidations(liquidations.slice(-5));
  }, [liquidations]);

  const formatPrice = (price: number) => {
    return `$${price.toFixed(4)}`;
  };

  const formatPnL = (pnl: number) => {
    const isPositive = pnl >= 0;
    return (
      <span className={`font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? '+' : ''}${pnl.toFixed(2)}
      </span>
    );
  };

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'price_movement':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'funding_rate':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'margin_call':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
  };

  const getReasonText = (reason: string) => {
    switch (reason) {
      case 'price_movement':
        return 'Price Movement';
      case 'funding_rate':
        return 'Funding Rate';
      case 'margin_call':
        return 'Margin Call';
      default:
        return 'Unknown';
    }
  };

  const handleClose = (liquidationId: string) => {
    setVisibleLiquidations(prev => prev.filter(l => l.id !== liquidationId));
    onClose?.(liquidationId);
  };

  if (visibleLiquidations.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {visibleLiquidations.map((liquidation) => (
        <Alert key={liquidation.id} className="border-red-500/50 bg-red-500/10">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10">
                    LIQUIDATED
                  </Badge>
                  <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10">
                    {liquidation.asset}
                  </Badge>
                  <Badge variant="outline" className={`${liquidation.side === 'long' ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-red-500/50 text-red-400 bg-red-500/10'}`}>
                    {liquidation.side.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Position Size</div>
                    <div className="text-white font-semibold">${liquidation.size.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Entry Price</div>
                    <div className="text-white font-semibold">{formatPrice(liquidation.entryPrice)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Liquidation Price</div>
                    <div className="text-red-400 font-semibold">{formatPrice(liquidation.liquidationPrice)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">PnL</div>
                    <div>{formatPnL(liquidation.pnl)}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-2">
                  {getReasonIcon(liquidation.reason)}
                  <span className="text-sm text-gray-400">
                    Reason: {getReasonText(liquidation.reason)}
                  </span>
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">
                    {new Date(liquidation.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleClose(liquidation.id)}
                className="text-gray-400 hover:text-white hover:bg-red-500/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};
