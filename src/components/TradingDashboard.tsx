import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, DollarSign, Activity, Coins, Calculator, Wallet, Target, PieChart, Settings, ChevronDown, Home, RefreshCw } from "lucide-react";
import { TradingViewWidget } from "./TradingViewWidget";
import { AssetSelector, AVAILABLE_ASSETS, Asset } from "./AssetSelector";
import { OrderBook } from "./OrderBook";
import { TradeForm } from "./TradeForm";
import { PositionCard } from "./PositionCard";
import { ContractTester } from "./ContractTester";
import { useReflectorEnhanced } from "@/hooks/use-reflector-enhanced";
import { useWalletContext } from "@/contexts/WalletContext";
import { usePriceOracle } from "@/hooks/use-price-oracle";
import { useCoinGeckoPrices } from "@/hooks/use-coingecko-prices";
import { MobileMenu } from "./MobileMenu";
import { MobileHeader } from "./MobileHeader";
import { WelcomePage } from "./WelcomePage";

export const TradingDashboard = () => {
  const { prices, getPrices } = useReflectorEnhanced(false);
  const { walletInfo, isConnected, connect, disconnect, isConnecting, updateBalance } = useWalletContext();
  
  // Usar CoinGecko como fuente principal de precios
  const { 
    xlmPrice: coinGeckoXlmPrice, 
    isLoading: coinGeckoLoading, 
    error: coinGeckoError,
    priceChange24h 
  } = useCoinGeckoPrices(true, 30000); // Auto-refresh cada 30 segundos
  
  // Fallback al Price Oracle si CoinGecko falla
  const { xlmPrice: oracleXlmPrice, isLoading: priceLoading, error: priceError } = usePriceOracle();
  const [selectedAsset, setSelectedAsset] = useState<Asset>(AVAILABLE_ASSETS[0]); // XLM por defecto
  const [selectedPair, setSelectedPair] = useState("XLM/USDC");
  const [currentPrice, setCurrentPrice] = useState(0.1234);
  const [priceChange, setPriceChange] = useState(2.45);
  const [activeTab, setActiveTab] = useState("trading");
  const [showWelcome, setShowWelcome] = useState(true);

  // Obtener precios desde Reflector
  const { prices: reflectorPrices, isLoading: reflectorLoading } = useReflectorEnhanced(false);

  // Obtener precio actual de XLM - prioridad: CoinGecko > Price Oracle > Reflector > Fallback
  useEffect(() => {
    if (coinGeckoXlmPrice > 0) {
      setCurrentPrice(coinGeckoXlmPrice);
      setPriceChange(priceChange24h || 0); // Usar el cambio real de 24h de CoinGecko
      console.log('✅ Usando precio de CoinGecko:', coinGeckoXlmPrice, 'Cambio 24h:', priceChange24h);
    } else if (oracleXlmPrice > 0) {
      setCurrentPrice(oracleXlmPrice);
      setPriceChange(0);
      console.log('✅ Usando precio del Price Oracle:', oracleXlmPrice);
    } else if (!coinGeckoLoading && !oracleXlmPrice) {
      // Fallback a Reflector si CoinGecko falla
      const xlmPriceReflector = reflectorPrices.find(p => p.asset === 'XLM');
      if (xlmPriceReflector) {
        setCurrentPrice(xlmPriceReflector.price);
        setPriceChange(0);
        console.log('✅ Usando precio de Reflector:', xlmPriceReflector.price);
      } else {
        // Fallback final a precios simulados
        const fallbackPrice = prices.find(p => p.asset === 'XLM');
        if (fallbackPrice) {
          setCurrentPrice(fallbackPrice.price);
          setPriceChange(0);
          console.log('✅ Usando precio de fallback:', fallbackPrice.price);
        }
      }
    }
  }, [coinGeckoXlmPrice, oracleXlmPrice, coinGeckoLoading, priceLoading, reflectorPrices, prices, priceChange24h]);

  // Cargar precios al inicializar
  useEffect(() => {
    getPrices(['XLM', 'BTC', 'ETH', 'SOL', 'ADA']);
  }, [getPrices]);

  // Función para lanzar la app
  const handleLaunchApp = () => {
    setShowWelcome(false);
  };

  // Función para cambiar activo
  const handleAssetChange = (asset: Asset) => {
    setSelectedAsset(asset);
    setSelectedPair(`${asset.symbol}/USDC`);
    setCurrentPrice(asset.price);
    setPriceChange(asset.change24h);
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

      {/* Filtro de conexión - solo mostrar contenido si está conectado */}
      {!isConnected ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <Card className="max-w-md mx-auto bg-slate-900/90 border-cyan-500/30 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-cyan-300 flex items-center justify-center space-x-2">
                <Wallet className="w-6 h-6" />
                <span>Conecta tu Wallet</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-400 text-sm">
                Necesitas conectar tu wallet de Stellar para acceder a la plataforma de trading.
              </p>
              <Button 
                onClick={connect} 
                disabled={isConnecting}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                {isConnecting ? 'Conectando...' : 'Conectar Wallet'}
              </Button>
              <div className="text-xs text-gray-500">
                Compatible con Freighter, Albedo y otras wallets de Stellar
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {/* Desktop Header */}
      <div className="hidden lg:block border-b border-cyan-500/20 bg-slate-900/80 backdrop-blur-sm relative overflow-hidden">
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
            
            {/* Wallet info o botón de conectar */}
            {walletInfo ? (
              <div className="flex items-center space-x-2">
                {/* Balance */}
                <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10">
                  {walletInfo.balance?.toFixed(2) || '0.00'} XLM
                </Badge>
                
                {/* Dirección truncada */}
                <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10">
                  {walletInfo.publicKey.slice(0, 4)}...{walletInfo.publicKey.slice(-4)}
                </Badge>
                
                {/* Red */}
                <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10">
                  {walletInfo.network}
                </Badge>
                
                {/* Botón de actualizar balance */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={updateBalance}
                  className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                
                {/* Botón de desconectar */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnect}
                  className="border-red-500/30 text-red-300 hover:bg-red-500/20"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={connect}
                disabled={isConnecting}
                className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-200 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/25 flex items-center space-x-2"
              >
                <Wallet className="h-4 w-4" />
                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </Button>
            )}
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
        <div className="w-full px-4 py-6">
          <div className="max-w-6xl mx-auto">
            {/* Barra de navegación personalizada */}
            <div className="relative">
              {/* Fondo de la barra */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800/90 via-slate-700/90 to-slate-800/90 rounded-2xl border border-slate-600/50 shadow-2xl"></div>
              
              {/* Contenido de la barra */}
              <div className="relative flex items-center justify-between px-2 py-2">
                {/* Botón Trading */}
                <button
                  onClick={() => setActiveTab("trading")}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === "trading"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                      : "text-slate-300 hover:text-cyan-400 hover:bg-slate-600/50"
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Trading</span>
                </button>

                {/* Botón Positions */}
                <button
                  onClick={() => setActiveTab("positions")}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === "positions"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                      : "text-slate-300 hover:text-cyan-400 hover:bg-slate-600/50"
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  <span>Positions</span>
                </button>

                {/* Botón Portfolio */}
                <button
                  onClick={() => setActiveTab("portfolio")}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === "portfolio"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                      : "text-slate-300 hover:text-cyan-400 hover:bg-slate-600/50"
                  }`}
                >
                  <Wallet className="w-5 h-5" />
                  <span>Portfolio</span>
                </button>

                {/* Botón Stats */}
                <button
                  onClick={() => setActiveTab("stats")}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === "stats"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                      : "text-slate-300 hover:text-cyan-400 hover:bg-slate-600/50"
                  }`}
                >
                  <Activity className="w-5 h-5" />
                  <span>Stats</span>
                </button>

                {/* Botón Contract */}
                <button
                  onClick={() => setActiveTab("contract")}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === "contract"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                      : "text-slate-300 hover:text-cyan-400 hover:bg-slate-600/50"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Contract</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab de Trading - Layout como en la imagen de referencia */}
        <TabsContent value="trading" className="space-y-0 pb-20 xl:pb-8">
          {/* Selector de Activos */}
          <div className="p-4 pb-2">
            <AssetSelector 
              selectedAsset={selectedAsset} 
              onAssetChange={handleAssetChange}
              className="max-w-md mx-auto"
              realXlmPrice={coinGeckoXlmPrice}
              realXlmChange={priceChange24h}
            />
          </div>
          
          {/* Gráfico Principal - Full Width con TradingView */}
          <div className="p-4 pb-0">
            <Card className="bg-slate-900/90 border-cyan-500/30 backdrop-blur-sm relative overflow-hidden shadow-2xl shadow-cyan-500/10 h-[400px] xl:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/10"></div>
              <CardHeader className="relative z-10 p-4 border-b border-cyan-500/20">
                    <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 text-cyan-300 text-lg font-semibold">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    <span>{selectedAsset.symbol}/USDC Price Chart</span>
                      </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10">
                      {selectedAsset.category.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10">
                      Live
                    </Badge>
                      </div>
                    </div>
                  </CardHeader>
              <CardContent className="relative z-10 p-0 h-[calc(100%-80px)]">
                <TradingViewWidget 
                  symbol={selectedAsset.tradingViewSymbol}
                  theme="dark"
                  interval="15"
                  height="100%"
                  width="100%"
                />
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
                      {selectedAsset.symbol}/USDC
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

        {/* Tab de Estadísticas y Reflector */}
        <TabsContent value="stats" className="space-y-0 pb-20 xl:pb-8">
          <div className="p-4 space-y-6">
            {/* Trading Statistics */}
            {/* Trading stats moved to ContractTester */}
            
            {/* Reflector Status */}
            {/* Reflector status moved to ContractTester */}
            
            {/* Liquidation Alerts */}
            {/* Liquidation alerts moved to ContractTester */}
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

        {/* Contract Tab */}
        <TabsContent value="contract" className="p-4 pb-20 xl:pb-8">
          <ContractTester />
        </TabsContent>

      </Tabs>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileMenu 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onGoHome={() => setShowWelcome(true)} 
      />
        </>
      )}
    </div>
  );
};