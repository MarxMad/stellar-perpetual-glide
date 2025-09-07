import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Shield, 
  Zap, 
  Globe, 
  Users,
  ArrowRight,
  Play,
  Star,
  Award,
  Target,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WelcomePageProps {
  onLaunchApp: () => void;
}

export const WelcomePage = ({ onLaunchApp }: WelcomePageProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    {
      icon: BarChart3,
      title: "Trading Avanzado",
      description: "Interfaz profesional con gráficos en tiempo real y análisis técnico avanzado",
      color: "from-cyan-500 to-teal-500"
    },
    {
      icon: Shield,
      title: "Seguridad Máxima",
      description: "Protegido por la red Stellar con contratos inteligentes auditados",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Velocidad Lightning",
      description: "Transacciones instantáneas con confirmaciones en segundos",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Globe,
      title: "Global & Descentralizado",
      description: "Acceso mundial sin restricciones geográficas",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: Users,
      title: "Comunidad Activa",
      description: "Únete a miles de traders en la red Stellar",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Award,
      title: "Recompensas KALE",
      description: "Gana tokens KALE por trading y participación",
      color: "from-indigo-500 to-violet-500"
    }
  ];

  const stats = [
    { label: "Usuarios Activos", value: "10K+", icon: Users },
    { label: "Volumen 24h", value: "$2.4M", icon: TrendingUp },
    { label: "Pares Disponibles", value: "50+", icon: Target },
    { label: "Uptime", value: "99.9%", icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Efectos de fondo futuristas */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-teal-500/5 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
      
      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-400/25 animate-pulse">
                <BarChart3 className="h-6 w-6 text-black" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 bg-clip-text text-transparent">
                Stellar Perpetuals
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              La plataforma de trading de futuros más avanzada en la red Stellar
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
              <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10 px-4 py-2 text-lg">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-ping" />
                Live Trading
              </Badge>
              <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10 px-4 py-2 text-lg">
                <Shield className="w-4 h-4 mr-2" />
                Seguro & Auditado
              </Badge>
              <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 bg-yellow-500/10 px-4 py-2 text-lg">
                <Zap className="w-4 h-4 mr-2" />
                Ultra Rápido
              </Badge>
            </div>

            {/* Launch App Button */}
            <div className="relative">
              <Button
                size="lg"
                className={cn(
                  "text-xl px-12 py-6 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold shadow-2xl shadow-cyan-500/25 transition-all duration-500 transform",
                  isHovered && "scale-105 shadow-cyan-500/40"
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onLaunchApp}
              >
                <Play className="w-6 h-6 mr-3" />
                Launch App
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              
              {/* Efecto de resplandor */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg blur-xl opacity-30 animate-pulse -z-10"></div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="bg-slate-900/80 border-cyan-500/20 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-teal-500/5"></div>
                  <CardContent className="p-6 text-center relative z-10">
                    <Icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
              ¿Por qué elegir Stellar Perpetuals?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="bg-slate-900/80 border-cyan-500/20 backdrop-blur-sm relative overflow-hidden group hover:border-cyan-400/40 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-teal-500/5"></div>
                    <CardContent className="p-6 relative z-10">
                      <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-slate-900/80 border-cyan-500/20 backdrop-blur-sm relative overflow-hidden max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-teal-500/10"></div>
              <CardContent className="p-12 relative z-10">
                <h3 className="text-3xl font-bold text-white mb-4">
                  ¿Listo para comenzar a tradear?
                </h3>
                <p className="text-xl text-gray-300 mb-8">
                  Únete a la revolución del trading descentralizado en Stellar
                </p>
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold shadow-xl shadow-cyan-500/25"
                  onClick={onLaunchApp}
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  Conectar Wallet y Comenzar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-cyan-500/20 bg-slate-900/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-black" />
              </div>
              <span className="text-white font-semibold">Stellar Perpetuals</span>
            </div>
            <div className="text-sm text-gray-400">
              Powered by Stellar Network • Built with ❤️ for the community
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
