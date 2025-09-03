import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, X, DollarSign } from "lucide-react";

export const PositionCard = () => {
  // Mock positions data
  const positions = [
    {
      id: 1,
      pair: "XLM/USDC",
      side: "long" as const,
      size: 1500.00,
      entryPrice: 0.1200,
      currentPrice: 0.1234,
      leverage: 10,
      pnl: 42.50,
      pnlPercentage: 2.83,
      liquidationPrice: 0.1080,
      margin: 150.00
    },
    {
      id: 2,
      pair: "XLM/USDC",
      side: "short" as const,
      size: 800.00,
      entryPrice: 0.1250,
      currentPrice: 0.1234,
      leverage: 5,
      pnl: 12.80,
      pnlPercentage: 2.00,
      liquidationPrice: 0.1450,
      margin: 160.00
    }
  ];

  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const totalMargin = positions.reduce((sum, pos) => sum + pos.margin, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Positions</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={totalPnL >= 0 ? "default" : "destructive"}
              className={totalPnL >= 0 ? "bg-success text-success-foreground" : ""}
            >
              {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {positions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">📈</div>
            <p>No open positions</p>
            <p className="text-sm">Open your first position to start trading</p>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg text-sm">
              <div>
                <div className="text-muted-foreground">Total P&L</div>
                <div className={`font-bold ${totalPnL >= 0 ? 'text-success' : 'text-danger'}`}>
                  {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Total Margin</div>
                <div className="font-bold">${totalMargin.toFixed(2)}</div>
              </div>
            </div>

            {/* Positions List */}
            <div className="space-y-2">
              {positions.map((position) => (
                <div
                  key={position.id}
                  className="border border-border rounded-lg p-3 space-y-2 hover:bg-accent/50 transition-colors"
                >
                  {/* Position Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={position.side === "long" ? "default" : "destructive"}
                        className={`text-xs ${
                          position.side === "long" 
                            ? "bg-success text-success-foreground" 
                            : "bg-danger text-danger-foreground"
                        }`}
                      >
                        {position.side === "long" ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {position.leverage}x {position.side.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-medium">{position.pair}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Position Details */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-muted-foreground">Size</div>
                      <div className="font-mono">${position.size.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Entry Price</div>
                      <div className="font-mono">${position.entryPrice.toFixed(4)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Current Price</div>
                      <div className="font-mono">${position.currentPrice.toFixed(4)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Liq. Price</div>
                      <div className="font-mono text-warning">${position.liquidationPrice.toFixed(4)}</div>
                    </div>
                  </div>

                  {/* P&L */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="text-xs">
                      <span className="text-muted-foreground">Margin: </span>
                      <span className="font-mono">${position.margin.toFixed(2)}</span>
                    </div>
                    <div className={`text-sm font-bold ${position.pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                      {position.pnl >= 0 ? "+" : ""}${position.pnl.toFixed(2)} 
                      <span className="text-xs ml-1">
                        ({position.pnl >= 0 ? "+" : ""}{position.pnlPercentage.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Close All Button */}
            <Button variant="outline" className="w-full" size="sm">
              Close All Positions
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};