import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { ChevronDown, TrendingUp, TrendingDown, Star, Coins } from 'lucide-react';

export interface Asset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: string;
  marketCap: string;
  category: 'stellar' | 'crypto' | 'forex' | 'commodities';
  tradingViewSymbol: string;
  description: string;
}

interface AssetSelectorProps {
  selectedAsset: Asset;
  onAssetChange: (asset: Asset) => void;
  className?: string;
}

// Los 10 activos más importantes de Stellar y el mercado
export const AVAILABLE_ASSETS: Asset[] = [
  // Stellar Ecosystem
  {
    symbol: 'XLM',
    name: 'Stellar Lumens',
    price: 0.1234,
    change24h: 2.45,
    volume24h: '$2.4M',
    marketCap: '$3.6B',
    category: 'stellar',
    tradingViewSymbol: 'BINANCE:XLMUSDT',
    description: 'La criptomoneda nativa de la red Stellar'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    price: 1.0000,
    change24h: 0.01,
    volume24h: '$8.2B',
    marketCap: '$32.1B',
    category: 'stellar',
    tradingViewSymbol: 'BINANCE:USDCUSDT',
    description: 'Stablecoin respaldada por USD en Stellar'
  },
  {
    symbol: 'AQUA',
    name: 'Aqua',
    price: 0.0045,
    change24h: -1.23,
    volume24h: '$1.2M',
    marketCap: '$45.2M',
    category: 'stellar',
    tradingViewSymbol: 'BINANCE:AQUAUSDT',
    description: 'Token de gobernanza de Stellar'
  },
  
  // Major Cryptocurrencies
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 43250.00,
    change24h: 1.85,
    volume24h: '$28.5B',
    marketCap: '$847.2B',
    category: 'crypto',
    tradingViewSymbol: 'BINANCE:BTCUSDT',
    description: 'La criptomoneda líder del mercado'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2650.00,
    change24h: 2.12,
    volume24h: '$15.8B',
    marketCap: '$318.7B',
    category: 'crypto',
    tradingViewSymbol: 'BINANCE:ETHUSDT',
    description: 'Plataforma de contratos inteligentes'
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 98.50,
    change24h: 3.45,
    volume24h: '$2.1B',
    marketCap: '$42.3B',
    category: 'crypto',
    tradingViewSymbol: 'BINANCE:SOLUSDT',
    description: 'Blockchain de alto rendimiento'
  },
  
  // Forex
  {
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    price: 1.0850,
    change24h: -0.15,
    volume24h: '$6.8T',
    marketCap: 'N/A',
    category: 'forex',
    tradingViewSymbol: 'FX:EURUSD',
    description: 'Par de divisas más negociado'
  },
  {
    symbol: 'GBP/USD',
    name: 'British Pound / US Dollar',
    price: 1.2650,
    change24h: 0.25,
    volume24h: '$3.2T',
    marketCap: 'N/A',
    category: 'forex',
    tradingViewSymbol: 'FX:GBPUSD',
    description: 'Par de divisas esterlina-dólar'
  },
  
  // Commodities
  {
    symbol: 'GOLD',
    name: 'Gold',
    price: 2045.00,
    change24h: 0.85,
    volume24h: '$180B',
    marketCap: 'N/A',
    category: 'commodities',
    tradingViewSymbol: 'TVC:GOLD',
    description: 'Oro como activo refugio'
  },
  {
    symbol: 'OIL',
    name: 'Crude Oil',
    price: 78.50,
    change24h: -1.20,
    volume24h: '$45B',
    marketCap: 'N/A',
    category: 'commodities',
    tradingViewSymbol: 'TVC:USOIL',
    description: 'Petróleo crudo WTI'
  }
];

export const AssetSelector = ({ selectedAsset, onAssetChange, className = '' }: AssetSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'stellar':
        return <Star className="w-4 h-4 text-cyan-400" />;
      case 'crypto':
        return <Coins className="w-4 h-4 text-yellow-400" />;
      case 'forex':
        return <TrendingUp className="w-4 h-4 text-blue-400" />;
      case 'commodities':
        return <TrendingDown className="w-4 h-4 text-orange-400" />;
      default:
        return <Coins className="w-4 h-4 text-gray-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'stellar':
        return 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10';
      case 'crypto':
        return 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10';
      case 'forex':
        return 'border-blue-500/50 text-blue-400 bg-blue-500/10';
      case 'commodities':
        return 'border-orange-500/50 text-orange-400 bg-orange-500/10';
      default:
        return 'border-gray-500/50 text-gray-400 bg-gray-500/10';
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    } else if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toFixed(4)}`;
    }
  };

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center space-x-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        <span>{isPositive ? '+' : ''}{change.toFixed(2)}%</span>
      </span>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between p-4 h-auto border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-200 transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              {getCategoryIcon(selectedAsset.category)}
              <div className="text-left">
                <div className="font-semibold text-lg">{selectedAsset.symbol}</div>
                <div className="text-sm text-gray-400">{selectedAsset.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">{formatPrice(selectedAsset.price)}</div>
              {formatChange(selectedAsset.change24h)}
            </div>
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-96 bg-slate-900/95 border-cyan-500/20 backdrop-blur-sm">
          <div className="p-3">
            <div className="text-sm font-semibold text-cyan-300 mb-2">Seleccionar Activo</div>
            <div className="text-xs text-gray-400 mb-3">{selectedAsset.description}</div>
          </div>
          
          <DropdownMenuSeparator className="bg-cyan-500/20" />
          
          <div className="max-h-80 overflow-y-auto">
            {AVAILABLE_ASSETS.map((asset) => (
              <DropdownMenuItem
                key={asset.symbol}
                onClick={() => {
                  onAssetChange(asset);
                  setIsOpen(false);
                }}
                className="p-3 hover:bg-cyan-500/10 focus:bg-cyan-500/10 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(asset.category)}
                    <div>
                      <div className="font-semibold text-white">{asset.symbol}</div>
                      <div className="text-sm text-gray-400">{asset.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">{formatPrice(asset.price)}</div>
                    {formatChange(asset.change24h)}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
          
          <DropdownMenuSeparator className="bg-cyan-500/20" />
          
          <div className="p-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center">
                <div className="text-gray-400">Volumen 24h</div>
                <div className="text-cyan-300 font-semibold">{selectedAsset.volume24h}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Market Cap</div>
                <div className="text-cyan-300 font-semibold">{selectedAsset.marketCap}</div>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
