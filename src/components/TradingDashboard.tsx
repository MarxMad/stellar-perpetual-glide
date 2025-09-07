import { useState, useEffect } from "react";
import { useCoinGecko } from "../hooks/use-coingecko";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, DollarSign, Activity, Coins, Calculator, Wallet, Target, PieChart, Settings, ChevronDown, Home } from "lucide-react";
import { PriceChart } from "./PriceChart";
import { TradingViewChart } from "./TradingViewChart";
import { RealTimeChart } from "./RealTimeChart";
import { OrderBook } from "./OrderBook";
import { TradeForm } from "./TradeForm";
import { PositionCard } from "./PositionCard";
import { ReflectorOracle } from "./ReflectorOracle";
import { KaleRewards } from "./KaleRewards";
import { FundingRates } from "./FundingRates";
import { WalletConnectTech } from "./WalletConnectTech";
import { ReflectorTest } from "./ReflectorTest";
import { ReflectorSubscriptions } from "./ReflectorSubscriptions";
import { WebhookConfig } from "./WebhookConfig";
import { useStellarServices } from "@/hooks/use-stellar-services";
import { MobileMenu } from "./MobileMenu";
import { MobileHeader } from "./MobileHeader";
import { WelcomePage } from "./WelcomePage";

export const TradingDashboard = () => {
  const { prices, getPrices } = useStellarServices();
  const [selectedPair, setSelectedPair] = useState("XLM/USDC");
  const [currentPrice, setCurrentPrice] = useState(0.1234);
  const [priceChange, setPriceChange] = useState(2.45);
  const [activeTab, setActiveTab] = useState("trading");
  const [showWelcome, setShowWelcome] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // Hook para obtener precios reales de CoinGecko
  const { price: xlmPrice, loading: priceLoading } = useCoinGecko('stellar');

  // Obtener precio actual de XLM desde CoinGecko
  useEffect(() => {
    if (xlmPrice) {
      setCurrentPrice(xlmPrice.current_price || 0.1234);
      setPriceChange(xlmPrice.price_change_percentage_24h || 0);
      setIsConnected(true);
    } else if (!priceLoading) {
      // Fallback a precios simulados si CoinGecko falla
      const fallbackPrice = prices.find(p => p.asset === 'XLM');
      if (fallbackPrice) {
        setCurrentPrice(fallbackPrice.price);
        setPriceChange(0); // Valor por defecto si no hay cambio disponible
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    }
  }, [xlmPrice, priceLoading, prices]);

  // Cargar precios al inicializar
  useEffect(() => {
    getPrices(['XLM', 'BTC', 'ETH', 'SOL', 'ADA']);
  }, [getPrices]);

  // Función para lanzar la app
  const handleLaunchApp = () => {
    setShowWelcome(false);
  };

  // Mostrar página de bienvenida si showWelcome es true
  if (showWelcome) {
    return <WelcomePage onLaunchApp={handleLaunchApp} />;
  }

  // VERSIÓN ULTRA SIMPLIFICADA PARA DEBUG
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1e293b', 
      position: 'relative',
      padding: '20px'
    }}>
      
      
      {/* Mobile Header */}
      <MobileHeader 
        currentPrice={currentPrice} 
        priceChange={priceChange} 
        isConnected={isConnected} 
      />

      {/* Desktop Header */}
      <div className="hidden xl:block border-b border-cyan-500/20 bg-slate-900/80 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-teal-500/5"></div>
        <div className="flex items-center justify-between p-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-400/25 animate-pulse">
                <BarChart3 className="h-4 w-4 text-black" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 bg-clip-text text-transparent animate-pulse">
              Stellar Perpetuals
            </h1>
            </div>
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent animate-pulse"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-ping" />
              <span className="relative z-10">Live</span>
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            {/* Home Button */}
            <Button
              variant="outline"
              size="sm"
              className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-200 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/25"
              onClick={() => setShowWelcome(true)}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            
            {/* Desktop Dev Tools */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-200 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/25">
                  <Settings className="h-4 w-4 mr-2" />
                  Dev Tools
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-900/95 border-cyan-500/20 backdrop-blur-sm">
                <DropdownMenuItem 
                  className="text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-100 transition-all duration-300"
                  onClick={() => setActiveTab("oracle")}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Oracle
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-100 transition-all duration-300"
                  onClick={() => setActiveTab("subscriptions")}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Subscriptions
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-100 transition-all duration-300"
                  onClick={() => setActiveTab("webhook")}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Webhook Config
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-100 transition-all duration-300"
                  onClick={() => setActiveTab("funding")}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Funding Rates
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-100 transition-all duration-300"
                  onClick={() => setActiveTab("rewards")}
                >
                  <Coins className="h-4 w-4 mr-2" />
                  KALE Rewards
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-100 transition-all duration-300"
                  onClick={() => setActiveTab("test")}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Test Tools
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <WalletConnectTech />
          </div>
        </div>
      </div>

      {/* Price Header */}
      <div className="border-b border-cyan-500/20 bg-slate-900/40 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-teal-500/5"></div>
        <div className="flex items-center justify-between p-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-lg font-semibold text-cyan-300">{selectedPair}</h2>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">${typeof currentPrice === 'number' ? currentPrice.toFixed(4) : '0.0000'}</span>
                <div className={`flex items-center space-x-1 ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {priceChange >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {priceChange >= 0 ? '+' : ''}{typeof priceChange === 'number' ? priceChange.toFixed(2) : '0.00'}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-6 text-sm">
            <div className="text-center">
              <span className="text-gray-400 block">24h High</span>
              <span className="text-white font-medium">$0.1289</span>
            </div>
            <div className="text-center">
              <span className="text-gray-400 block">24h Low</span>
              <span className="text-white font-medium">$0.1198</span>
            </div>
            <div className="text-center">
              <span className="text-gray-400 block">Volume</span>
              <span className="text-white font-medium">$2.4M</span>
            </div>
            <div className="text-center">
              <span className="text-gray-400 block">Funding</span>
              <span className="text-yellow-400 font-medium">0.01%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="relative z-10 min-h-[calc(100vh-200px)]">
        {/* Debug: Contenido simple */}
        
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tabs - Responsive para todas las pantallas */}
        <div className="w-full px-4 py-3">
          <div className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 p-1 bg-slate-800/90 border border-cyan-500/30 rounded-lg">
              <TabsTrigger 
                value="trading" 
                className="flex items-center justify-center space-x-1 sm:space-x-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-md py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium transition-all duration-200 hover:bg-cyan-500/20 hover:text-cyan-300 text-sm sm:text-base"
              >
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Trading</span>
                <span className="xs:hidden">Trade</span>
          </TabsTrigger>
              
              <TabsTrigger 
                value="positions" 
                className="flex items-center justify-center space-x-1 sm:space-x-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-md py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium transition-all duration-200 hover:bg-cyan-500/20 hover:text-cyan-300 text-sm sm:text-base"
              >
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Positions</span>
                <span className="xs:hidden">Pos</span>
          </TabsTrigger>
              
              <TabsTrigger 
                value="portfolio" 
                className="flex items-center justify-center space-x-1 sm:space-x-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-md py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium transition-all duration-200 hover:bg-cyan-500/20 hover:text-cyan-300 text-sm sm:text-base"
              >
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Portfolio</span>
                <span className="xs:hidden">Port</span>
          </TabsTrigger>
        </TabsList>
          </div>
        </div>

        {/* Tab de Trading - Layout como en la imagen de referencia */}
        <TabsContent value="trading" className="space-y-0 pb-20 xl:pb-8">
          {/* Gráfico Principal - Full Width */}
          <div className="p-4 pb-0">
            <Card className="bg-slate-900/90 border-cyan-500/30 backdrop-blur-sm relative overflow-hidden shadow-2xl shadow-cyan-500/10 h-[400px] xl:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/10"></div>
              <CardHeader className="relative z-10 p-4 border-b border-cyan-500/20">
                <CardTitle className="flex items-center space-x-2 text-cyan-300 text-lg font-semibold">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  <span>XLM/USDC Price Chart</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 p-4 h-[calc(100%-80px)]">
                <RealTimeChart coinId="stellar" />
              </CardContent>
            </Card>
          </div>
          
          {/* Tres Paneles Principales */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 p-4 h-[calc(100vh-700px)] xl:h-[calc(100vh-800px)]">
            
            {/* Columna 1: Order Book - Más grande y funcional */}
            <div className="xl:col-span-1">
              <Card className="h-full bg-slate-900/90 border-cyan-500/30 backdrop-blur-sm relative overflow-hidden shadow-2xl shadow-cyan-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/10"></div>
                <CardHeader className="relative z-10 p-4 border-b border-cyan-500/20">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2 text-cyan-300 text-lg font-semibold">
                      <BarChart3 className="w-5 h-5 text-cyan-400" />
                      <span>Order Book</span>
                    </CardTitle>
                    <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10 px-3 py-1">
                      XLM/USDC
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 p-4 h-[calc(100%-80px)] overflow-auto">
                  <OrderBook />
                </CardContent>
              </Card>
            </div>

            {/* Columna 2: Trade Form - Más grande y funcional */}
            <div className="xl:col-span-1">
              <Card className="h-full bg-slate-900/90 border-cyan-500/30 backdrop-blur-sm relative overflow-hidden shadow-2xl shadow-cyan-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/10"></div>
                <CardHeader className="relative z-10 p-4 border-b border-cyan-500/20">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2 text-cyan-300 text-lg font-semibold">
                      <Activity className="w-5 h-5 text-cyan-400" />
                      <span>Trade</span>
                    </CardTitle>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Balance</div>
                      <div className="text-lg font-bold text-green-400">$1,250.75</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 p-4 h-[calc(100%-80px)] overflow-auto">
                  <TradeForm />
                </CardContent>
              </Card>
            </div>

            {/* Columna 3: Positions - Más grande y funcional */}
            <div className="xl:col-span-1">
              <Card className="h-full bg-slate-900/90 border-cyan-500/30 backdrop-blur-sm relative overflow-hidden shadow-2xl shadow-cyan-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/10"></div>
                <CardHeader className="relative z-10 p-4 border-b border-cyan-500/20">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2 text-cyan-300 text-lg font-semibold">
                      <Target className="w-5 h-5 text-cyan-400" />
                      <span>Positions</span>
                    </CardTitle>
                    <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10 px-3 py-1">
                      +$0.00
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 p-4 h-[calc(100%-80px)] overflow-auto">
                  <PositionCard />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab de Posiciones */}
        <TabsContent value="positions" className="space-y-0 pb-20 xl:pb-8">
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Posiciones Activas */}
              <Card className="bg-slate-900/80 border-cyan-500/20 backdrop-blur-sm relative overflow-hidden neon-glow">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-teal-500/5"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center space-x-2 text-cyan-300 hologram-flicker">
                    <Target className="h-5 w-5 text-green-400" />
                    <span>Posiciones Activas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
              <PositionCard />
                </CardContent>
              </Card>

              {/* Historial de Trading */}
              <Card className="bg-slate-900/80 border-cyan-500/20 backdrop-blur-sm relative overflow-hidden neon-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    <span>Historial de Trading</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">XLM/USDC</p>
                          <p className="text-sm text-gray-400">Long • 1.5x</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-400">+$245.67</p>
                        <p className="text-sm text-gray-400">+12.5%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                          <TrendingDown className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">BTC/USDC</p>
                          <p className="text-sm text-gray-400">Short • 2.0x</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-400">-$89.23</p>
                        <p className="text-sm text-gray-400">-5.2%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab de Portfolio */}
        <TabsContent value="portfolio" className="space-y-0 pb-20 xl:pb-8">
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Balance Total */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Wallet className="h-5 w-5 text-blue-400" />
                    <span>Balance Total</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">$12,456.78</p>
                    <div className="flex items-center justify-center space-x-1 mt-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-medium">+8.5%</span>
                      <span className="text-gray-400 text-sm">24h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* PnL del Día */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    <span>PnL del Día</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-400">+$1,234.56</p>
                    <p className="text-gray-400 text-sm mt-2">+11.2%</p>
                  </div>
                </CardContent>
              </Card>

              {/* Posiciones Abiertas */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Target className="h-5 w-5 text-purple-400" />
                    <span>Posiciones</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">3</p>
                    <p className="text-gray-400 text-sm mt-2">Activas</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Distribución de Activos */}
            <Card className="mt-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <PieChart className="h-5 w-5 text-yellow-400" />
                  <span>Distribución de Activos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/50">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-white">USDC</p>
                      <p className="text-sm text-gray-400">45.2%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/50">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-white">XLM</p>
                      <p className="text-sm text-gray-400">32.1%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/50">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-white">BTC</p>
                      <p className="text-sm text-gray-400">15.7%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/50">
                    <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-white">ETH</p>
                      <p className="text-sm text-gray-400">7.0%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Dev Tools Tabs */}
        <TabsContent value="oracle" className="p-4 pb-20 xl:pb-8">
          <ReflectorOracle />
        </TabsContent>

        <TabsContent value="subscriptions" className="p-4 pb-20 xl:pb-8">
          <ReflectorSubscriptions />
        </TabsContent>

        <TabsContent value="webhook" className="p-4 pb-20 xl:pb-8">
          <WebhookConfig />
        </TabsContent>

        <TabsContent value="funding" className="p-4 pb-20 xl:pb-8">
          <FundingRates />
        </TabsContent>

        <TabsContent value="rewards" className="p-4 pb-20 xl:pb-8">
          <KaleRewards />
        </TabsContent>

        <TabsContent value="test" className="p-4 pb-20 xl:pb-8">
          <ReflectorTest />
        </TabsContent>

        <TabsContent value="settings" className="p-4 pb-20 xl:pb-8">
          <div className="text-center py-8">
            <Settings className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Configuración</h3>
            <p className="text-gray-400">Panel de configuración en desarrollo</p>
          </div>
        </TabsContent>
      </Tabs>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileMenu 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onGoHome={() => setShowWelcome(true)} 
      />
    </div>
  );
};