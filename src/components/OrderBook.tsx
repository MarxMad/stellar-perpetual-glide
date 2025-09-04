import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStellarServices } from "@/hooks/use-stellar-services";
import { useEffect, useState } from "react";

export const OrderBook = () => {
  const { prices, getPrices } = useStellarServices();
  const [currentPrice, setCurrentPrice] = useState(0.1234);

  // Obtener precio actual de XLM
  useEffect(() => {
    const xlmPrice = prices.find(p => p.asset === 'XLM');
    if (xlmPrice) {
      setCurrentPrice(xlmPrice.price);
      console.log('📊 OrderBook: Precio actual de XLM:', xlmPrice.price);
    }
  }, [prices]);

  // Generar order book basado en precio real con variación
  const generateOrderBook = (basePrice: number) => {
    const sellOrders = [];
    const buyOrders = [];
    
    // Generar órdenes de venta (precios más altos)
    for (let i = 1; i <= 5; i++) {
      const price = basePrice + (i * 0.0001);
      const amount = Math.random() * 10000 + 5000;
      sellOrders.push({
        price: price,
        amount: amount,
        total: price * amount
      });
    }
    
    // Generar órdenes de compra (precios más bajos)
    for (let i = 1; i <= 5; i++) {
      const price = basePrice - (i * 0.0001);
      const amount = Math.random() * 10000 + 5000;
      buyOrders.push({
        price: price,
        amount: amount,
        total: price * amount
      });
    }
    
    return { sellOrders: sellOrders.reverse(), buyOrders };
  };

  const { sellOrders, buyOrders } = generateOrderBook(currentPrice);

  const formatAmount = (amount: number) => {
    return amount.toLocaleString(undefined, { maximumFractionDigits: 1 });
  };

  const formatPrice = (price: number) => {
    return price.toFixed(4);
  };

  const formatTotal = (total: number) => {
    return total.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Order Book</CardTitle>
          <Badge variant="outline" className="text-xs">
            XLM/USDC
          </Badge>
        </div>
        
        {/* Headers */}
        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground font-medium">
          <div className="text-right">Price (USDC)</div>
          <div className="text-right">Amount (XLM)</div>
          <div className="text-right">Total (USDC)</div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-1 p-4 pt-0">
        {/* Sell Orders */}
        <div className="space-y-0.5">
          {sellOrders.map((order, index) => (
            <div
              key={`sell-${index}`}
              className="grid grid-cols-3 gap-2 text-xs py-1 hover:bg-danger/5 cursor-pointer transition-colors relative"
            >
              <div 
                className="absolute inset-y-0 right-0 bg-danger/10 rounded-sm"
                style={{ width: `${Math.min((order.amount / 20000) * 100, 100)}%` }}
              />
              <div className="text-danger font-mono text-right relative z-10">
                {formatPrice(order.price)}
              </div>
              <div className="text-foreground/80 font-mono text-right relative z-10">
                {formatAmount(order.amount)}
              </div>
              <div className="text-foreground/60 font-mono text-right relative z-10">
                {formatTotal(order.total)}
              </div>
            </div>
          ))}
        </div>

        {/* Current Price */}
        <div className="flex items-center justify-center py-2 my-2 border-y border-border/50">
          <div className="text-lg font-bold text-primary font-mono">
            ${currentPrice.toFixed(4)}
          </div>
          <div className="ml-2 text-sm text-success">
            ↗ +2.45%
          </div>
        </div>

        {/* Buy Orders */}
        <div className="space-y-0.5">
          {buyOrders.map((order, index) => (
            <div
              key={`buy-${index}`}
              className="grid grid-cols-3 gap-2 text-xs py-1 hover:bg-success/5 cursor-pointer transition-colors relative"
            >
              <div 
                className="absolute inset-y-0 right-0 bg-success/10 rounded-sm"
                style={{ width: `${Math.min((order.amount / 20000) * 100, 100)}%` }}
              />
              <div className="text-success font-mono text-right relative z-10">
                {formatPrice(order.price)}
              </div>
              <div className="text-foreground/80 font-mono text-right relative z-10">
                {formatAmount(order.amount)}
              </div>
              <div className="text-foreground/60 font-mono text-right relative z-10">
                {formatTotal(order.total)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};