import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const OrderBook = () => {
  // Mock order book data
  const sellOrders = [
    { price: 0.1245, amount: 15430.5, total: 1920.50 },
    { price: 0.1244, amount: 8750.2, total: 1088.72 },
    { price: 0.1243, amount: 12800.0, total: 1591.04 },
    { price: 0.1242, amount: 6500.8, total: 807.40 },
    { price: 0.1241, amount: 9200.3, total: 1142.56 },
  ].reverse();

  const buyOrders = [
    { price: 0.1234, amount: 8200.5, total: 1011.54 },
    { price: 0.1233, amount: 12400.8, total: 1528.86 },
    { price: 0.1232, amount: 5800.2, total: 714.58 },
    { price: 0.1231, amount: 15600.0, total: 1920.36 },
    { price: 0.1230, amount: 7300.5, total: 897.96 },
  ];

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
            $0.1234
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