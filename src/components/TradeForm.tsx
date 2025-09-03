import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, TrendingDown } from "lucide-react";

export const TradeForm = () => {
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [leverage, setLeverage] = useState([10]);
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [side, setSide] = useState<"long" | "short">("long");

  const balance = 1250.75; // Mock USDC balance
  const currentPrice = 0.1234;

  const calculatePnL = () => {
    const amountNum = parseFloat(amount) || 0;
    const leverageNum = leverage[0];
    const positionSize = amountNum * leverageNum;
    const priceNum = orderType === "market" ? currentPrice : parseFloat(price) || currentPrice;
    
    return {
      positionSize: positionSize.toFixed(2),
      liquidationPrice: side === "long" 
        ? (priceNum * (1 - 0.8 / leverageNum)).toFixed(4)
        : (priceNum * (1 + 0.8 / leverageNum)).toFixed(4),
      fees: (positionSize * 0.001).toFixed(2)
    };
  };

  const calculations = calculatePnL();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="w-4 h-4" />
          <span>Trade</span>
          <Badge variant="outline" className="ml-auto">
            Balance: ${balance.toFixed(2)}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Trade Direction */}
        <div className="flex space-x-2">
          <Button
            variant={side === "long" ? "default" : "outline"}
            className={`flex-1 ${side === "long" ? 'bg-success hover:bg-success/90 text-success-foreground' : ''}`}
            onClick={() => setSide("long")}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Long
          </Button>
          <Button
            variant={side === "short" ? "default" : "outline"}
            className={`flex-1 ${side === "short" ? 'bg-danger hover:bg-danger/90 text-danger-foreground' : ''}`}
            onClick={() => setSide("short")}
          >
            <TrendingDown className="w-4 h-4 mr-2" />
            Short
          </Button>
        </div>

        {/* Order Type */}
        <Tabs value={orderType} onValueChange={(value) => setOrderType(value as "market" | "limit")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="limit">Limit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="market" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="market-amount">Amount (USDC)</Label>
              <Input
                id="market-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="font-mono"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="limit" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="limit-price">Price (USDC)</Label>
              <Input
                id="limit-price"
                type="number"
                placeholder={currentPrice.toFixed(4)}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="limit-amount">Amount (USDC)</Label>
              <Input
                id="limit-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="font-mono"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Leverage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Leverage</Label>
            <Badge variant="secondary">
              {leverage[0]}x
            </Badge>
          </div>
          <Slider
            value={leverage}
            onValueChange={setLeverage}
            max={100}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1x</span>
            <span>50x</span>
            <span>100x</span>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {[25, 50, 75, 100].map((percentage) => (
            <Button
              key={percentage}
              variant="outline"
              size="sm"
              onClick={() => setAmount(((balance * percentage) / 100).toFixed(2))}
              className="text-xs"
            >
              {percentage}%
            </Button>
          ))}
        </div>

        {/* Position Info */}
        {amount && (
          <div className="space-y-2 p-3 bg-muted/50 rounded-lg text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Position Size:</span>
              <span className="font-mono">${calculations.positionSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Liquidation Price:</span>
              <span className="font-mono text-warning">${calculations.liquidationPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Est. Fees:</span>
              <span className="font-mono">${calculations.fees}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          className={`w-full ${
            side === "long" 
              ? 'bg-success hover:bg-success/90 text-success-foreground' 
              : 'bg-danger hover:bg-danger/90 text-danger-foreground'
          }`}
          size="lg"
          disabled={!amount || (orderType === "limit" && !price)}
        >
          {side === "long" ? "Open Long" : "Open Short"} Position
        </Button>
      </CardContent>
    </Card>
  );
};