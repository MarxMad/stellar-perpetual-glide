import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, DollarSign, Activity, Coins, Calculator } from "lucide-react";
import { PriceChart } from "./PriceChart";
import { OrderBook } from "./OrderBook";
import { TradeForm } from "./TradeForm";
import { PositionCard } from "./PositionCard";
import { ReflectorOracle } from "./ReflectorOracle";
import { KaleRewards } from "./KaleRewards";
import { FundingRates } from "./FundingRates";
import { WalletConnectSimple } from "./WalletConnectSimple";
import { ReflectorTest } from "./ReflectorTest";
import { useStellarServices } from "@/hooks/use-stellar-services";

export const TradingDashboard = () => {
  const { prices, getPrices } = useStellarServices();
  const [selectedPair, setSelectedPair] = useState("XLM/USDC");
  const [currentPrice, setCurrentPrice] = useState(0.1234);
  const [priceChange, setPriceChange] = useState(2.45);

  // Cargar precios al inicializar
  useEffect(() => {
    console.log('🚀 TradingDashboard: Inicializando y cargando precios...');
    getPrices(['XLM', 'BTC', 'ETH', 'SOL', 'ADA']);
  }, [getPrices]);

  // Actualizar precio actual cuando cambien los precios
  useEffect(() => {
    const xlmPrice = prices.find(p => p.asset === 'XLM');
    if (xlmPrice) {
      setCurrentPrice(xlmPrice.price);
      console.log('📊 TradingDashboard: Precio actualizado:', xlmPrice.price);
    }
  }, [prices]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Stellar Perpetuals
            </h1>
            <Badge variant="secondary" className="hidden sm:flex">
              Beta
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <WalletConnectSimple />
          </div>
        </div>
      </div>

      {/* Price Header */}
      <div className="border-b border-border bg-card/30 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-lg font-semibold">{selectedPair}</h2>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">${currentPrice.toFixed(4)}</span>
                <div className={`flex items-center space-x-1 ${priceChange >= 0 ? 'text-success' : 'text-danger'}`}>
                  {priceChange >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-sm">
            <div>
              <span className="text-muted-foreground">24h High:</span>
              <span className="ml-1 font-medium">$0.1289</span>
            </div>
            <div>
              <span className="text-muted-foreground">24h Low:</span>
              <span className="ml-1 font-medium">$0.1198</span>
            </div>
            <div>
              <span className="text-muted-foreground">Volume:</span>
              <span className="ml-1 font-medium">$2.4M</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="trading" className="w-full">
        <TabsList className="grid w-full grid-cols-5 p-4">
          <TabsTrigger value="trading" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Trading</span>
          </TabsTrigger>
          <TabsTrigger value="oracle" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Oracle</span>
          </TabsTrigger>
          <TabsTrigger value="funding" className="flex items-center space-x-2">
            <Calculator className="w-4 h-4" />
            <span>Funding</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center space-x-2">
            <Coins className="w-4 h-4" />
            <span>Rewards</span>
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Test</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab de Trading */}
        <TabsContent value="trading" className="space-y-0">
          <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)]">
            {/* Left Side - Chart & OrderBook */}
            <div className="flex-1 flex flex-col">
              {/* Chart */}
              <div className="flex-1 p-4">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5" />
                        <span>Price Chart</span>
                      </CardTitle>
                      <div className="flex space-x-1">
                        {['1m', '5m', '15m', '1h', '4h', '1d'].map((timeframe) => (
                          <Button
                            key={timeframe}
                            variant={timeframe === '15m' ? 'default' : 'ghost'}
                            size="sm"
                            className="h-7 px-2 text-xs"
                          >
                            {timeframe}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 h-[calc(100%-80px)]">
                    <PriceChart />
                  </CardContent>
                </Card>
              </div>

              {/* OrderBook - Mobile/Tablet */}
              <div className="lg:hidden p-4 pt-0">
                <OrderBook />
              </div>
            </div>

            {/* Right Side - Trading Panel */}
            <div className="w-full lg:w-80 xl:w-96 flex flex-col space-y-4 p-4">
              {/* OrderBook - Desktop */}
              <div className="hidden lg:block">
                <OrderBook />
              </div>

              {/* Trade Form */}
              <TradeForm />

              {/* Position Card */}
              <PositionCard />
            </div>
          </div>
        </TabsContent>

        {/* Tab del Oracle Reflector */}
        <TabsContent value="oracle" className="p-4">
          <ReflectorOracle />
        </TabsContent>

        {/* Tab de Funding Rates */}
        <TabsContent value="funding" className="p-4">
          <FundingRates />
        </TabsContent>

        {/* Tab de KALE Rewards */}
        <TabsContent value="rewards" className="p-4">
          <KaleRewards />
        </TabsContent>

        {/* Tab de Prueba de Reflector */}
        <TabsContent value="test" className="p-4">
          <ReflectorTest />
        </TabsContent>
      </Tabs>
    </div>
  );
};