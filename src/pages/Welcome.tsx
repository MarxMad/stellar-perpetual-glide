import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  Globe, 
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Users,
  BarChart3,
  Wallet,
  Target,
  Rocket
} from 'lucide-react';
import { PriceChart } from '@/components/PriceChart';
import { useReflectorEnhanced } from '@/hooks/use-reflector-enhanced';

export const Welcome = () => {
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [isMainnet, setIsMainnet] = useState(true);
  const { getPrices, prices, isLoading, contractInfo } = useReflectorEnhanced(isMainnet);

  const assets = ['BTC', 'ETH', 'XLM', 'SOL', 'ADA'];
  
  // Cargar precios al montar el componente
  useEffect(() => {
    getPrices(assets);
  }, [isMainnet]);

  // Datos mock para estadísticas (reemplazar con datos reales)
  const stats = {
    totalVolume: '$2.4M',
    totalUsers: '1,247',
    activePositions: '89',
    fundingRate: '0.01%',
    openInterest: '$156K'
  };

  const topMovers = [
    { symbol: 'BTC', price: 95000, change: 2.4, volume: '$1.2M' },
    { symbol: 'ETH', price: 3500, change: -1.2, volume: '$800K' },
    { symbol: 'XLM', price: 0.36, change: 5.8, volume: '$200K' },
    { symbol: 'SOL', price: 180, change: 3.1, volume: '$150K' },
    { symbol: 'ADA', price: 0.45, change: -0.8, volume: '$100K' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Stellar Perpetuals
              </h1>
            </div>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Trading de futuros perpetuos descentralizado en Stellar Network. 
              Liquidaciones automáticas, precios en tiempo real y tecnología blockchain de vanguardia.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Wallet className="h-5 w-5 mr-2" />
                Conectar Wallet
              </Button>
              <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <BarChart3 className="h-5 w-5 mr-2" />
                Ver Trading
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Volumen 24h</p>
                  <p className="text-xl font-bold text-white">{stats.totalVolume}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Usuarios Activos</p>
                  <p className="text-xl font-bold text-white">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Target className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Posiciones Abiertas</p>
                  <p className="text-xl font-bold text-white">{stats.activePositions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Activity className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Funding Rate</p>
                  <p className="text-xl font-bold text-white">{stats.fundingRate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Open Interest</p>
                  <p className="text-xl font-bold text-white">{stats.openInterest}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="markets" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="markets" className="data-[state=active]:bg-slate-700">
              <Globe className="h-4 w-4 mr-2" />
              Mercados
            </TabsTrigger>
            <TabsTrigger value="charts" className="data-[state=active]:bg-slate-700">
              <BarChart3 className="h-4 w-4 mr-2" />
              Gráficas
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-slate-700">
              <Star className="h-4 w-4 mr-2" />
              Características
            </TabsTrigger>
          </TabsList>

          {/* Markets Tab */}
          <TabsContent value="markets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Movers */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    <span>Top Movers</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Activos con mayor movimiento en las últimas 24h
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topMovers.map((asset) => (
                    <div key={asset.symbol} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {asset.symbol[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{asset.symbol}</p>
                          <p className="text-sm text-gray-400">Vol: {asset.volume}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">${asset.price.toLocaleString()}</p>
                        <div className={`flex items-center space-x-1 ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {asset.change >= 0 ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )}
                          <span className="text-sm font-medium">
                            {asset.change >= 0 ? '+' : ''}{asset.change}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Live Prices */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <span>Precios en Tiempo Real</span>
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      {isMainnet ? 'Mainnet' : 'Testnet'}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Datos de Reflector Network
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="animate-pulse flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-slate-600 rounded-full" />
                            <div className="space-y-2">
                              <div className="h-4 w-16 bg-slate-600 rounded" />
                              <div className="h-3 w-20 bg-slate-600 rounded" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 w-20 bg-slate-600 rounded" />
                            <div className="h-3 w-12 bg-slate-600 rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {prices.map((price) => (
                        <div key={price.asset} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {price.asset[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{price.asset}</p>
                              <p className="text-sm text-gray-400">
                                {price.source === 'contract' ? 'Reflector' : 'Mock'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-white">
                              ${price.price.toLocaleString(undefined, { 
                                minimumFractionDigits: 2, 
                                maximumFractionDigits: 6 
                              })}
                            </p>
                            <p className="text-sm text-gray-400">
                              {new Date(price.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Gráfica de Precios</CardTitle>
                <CardDescription className="text-gray-400">
                  Selecciona un activo para ver su gráfica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {assets.map((asset) => (
                    <Button
                      key={asset}
                      variant={selectedAsset === asset ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedAsset(asset)}
                      className={selectedAsset === asset ? "bg-gradient-to-r from-blue-600 to-purple-600" : "border-slate-600 text-gray-300"}
                    >
                      {asset}
                    </Button>
                  ))}
                </div>
                <PriceChart asset={selectedAsset} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Shield className="h-6 w-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Liquidaciones Automáticas</h3>
                  </div>
                  <p className="text-gray-400">
                    Sistema de liquidación automática basado en precios de Reflector Network para proteger a los traders.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Zap className="h-6 w-6 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Precios en Tiempo Real</h3>
                  </div>
                  <p className="text-gray-400">
                    Datos de precios actualizados en tiempo real desde múltiples exchanges a través de Reflector Network.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Globe className="h-6 w-6 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Descentralizado</h3>
                  </div>
                  <p className="text-gray-400">
                    Construido sobre Stellar Network, completamente descentralizado y sin custodia de fondos.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
