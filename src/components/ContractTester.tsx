import React, { useState } from 'react';
import { usePerpetualTrading } from '@/hooks/use-perpetual-trading';
import { useCoinGeckoPrices } from '@/hooks/use-coingecko-prices';
import { useWalletContext } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, DollarSign, TrendingUp, Activity } from 'lucide-react';

export const ContractTester: React.FC = () => {
  const { walletInfo, isConnected, connect, disconnect } = useWalletContext();
  
  const {
    currentPosition,
    traderPositions,
    contractStats,
    contractBalance,
    isLoading,
    error,
    openPosition,
    closePosition,
    getCurrentPosition,
    getTraderPositions,
    getContractStats,
    getContractBalance,
    withdrawContractBalance,
    refreshData,
    clearError
  } = usePerpetualTrading();

  const {
    xlmPrice,
    priceChange24h,
    isLoading: priceLoading,
    error: priceError,
    lastUpdated,
    getXlmPrice,
    getPrice,
    clearError: clearPriceError
  } = useCoinGeckoPrices(true, 30000);

  const [withdrawAmount, setWithdrawAmount] = useState('10');
  const [positionForm, setPositionForm] = useState({
    asset: 'XLM',
    side: 'long',
    margin: '10', // XLM
    leverage: '2'
  });

  // Obtener dirección del usuario
  const userAddress = walletInfo?.publicKey;

  // Abrir posición (ahora incluye transferencia directa de XLM)
  const handleOpenPosition = async () => {
    try {
      if (!walletInfo?.publicKey) {
        alert('Por favor conecta tu wallet primero');
        return;
      }

      const margin = parseFloat(positionForm.margin);
      const leverage = parseInt(positionForm.leverage);
      
      if (isNaN(margin) || margin <= 0) {
        alert('Por favor ingresa un margen válido');
        return;
      }
      
      if (isNaN(leverage) || leverage < 1 || leverage > 10) {
        alert('El leverage debe estar entre 1x y 10x');
        return;
      }

      const isLong = positionForm.side === 'long';
      const positionId = await openPosition(
        walletInfo.publicKey,
        margin,
        leverage,
        isLong
      );
      
      alert(`Posición abierta exitosamente! ID: ${positionId}`);
      setPositionForm({
        asset: 'XLM',
        side: 'long',
        margin: '10',
        leverage: '2'
      });
    } catch (error) {
      console.error('Error abriendo posición:', error);
      alert('Error abriendo posición');
    }
  };

  // Retirar XLM del contrato (solo admin)
  const handleWithdraw = async () => {
    try {
      if (!walletInfo?.publicKey) {
        alert('Por favor conecta tu wallet primero');
        return;
      }

      const amount = parseFloat(withdrawAmount);
      if (isNaN(amount) || amount <= 0) {
        alert('Por favor ingresa un monto válido');
        return;
      }

      const success = await withdrawContractBalance(walletInfo.publicKey, amount);
      if (success) {
        alert(`Retiro de ${amount} XLM exitoso`);
        setWithdrawAmount('');
      } else {
        alert('Error en el retiro');
      }
    } catch (error) {
      console.error('Error retirando:', error);
      alert('Error en el retiro');
    }
  };


  // Cerrar posición
  const handleClosePosition = async (positionId: number) => {
    try {
      if (!walletInfo?.publicKey) {
        alert('Por favor conecta tu wallet primero');
        return;
      }

      const pnl = await closePosition(walletInfo.publicKey, positionId);
      alert(`Posición cerrada! PnL: ${pnl / 10_000_000} XLM`);
    } catch (error) {
      console.error('Error cerrando posición:', error);
      alert('Error cerrando posición');
    }
  };

  // Obtener balance del contrato
  const handleGetBalance = async () => {
    try {
      const balance = await getContractBalance();
      alert(`Balance del contrato: ${balance / 10_000_000} XLM`);
    } catch (error) {
      console.error('Error obteniendo balance:', error);
      alert('Error obteniendo balance');
    }
  };

  // Obtener posición actual
  const handleGetCurrentPosition = async () => {
    try {
      const position = await getCurrentPosition();
      if (position) {
        alert(`Posición actual: ${JSON.stringify(position, null, 2)}`);
      } else {
        alert('No hay posición activa');
      }
    } catch (error) {
      console.error('Error obteniendo posición:', error);
      alert('Error obteniendo posición');
    }
  };

  // Obtener estadísticas del contrato
  const handleGetConfig = async () => {
    try {
      const stats = await getContractStats();
      if (stats) {
        alert(`Estadísticas del contrato: ${JSON.stringify(stats, null, 2)}`);
      } else {
        alert('No se pudieron obtener las estadísticas');
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      alert('Error obteniendo estadísticas');
    }
  };


  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">🔗 Wallet No Conectada</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            Conecta tu wallet desde el botón en la parte superior para acceder a las funciones del contrato.
          </p>
          
          <div className="text-sm text-muted-foreground text-center">
            <p>Usa Freighter, Albedo o cualquier wallet compatible con Stellar</p>
            <p className="text-xs mt-1">Red: Testnet</p>
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
              <p className="text-blue-800">
                🔗 <strong>Integración Web3:</strong> Los contratos están desplegados en testnet.
                Para transacciones reales, integra con Freighter/Albedo usando el SDK de Stellar.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🧪 Contract Tester</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {userAddress ? `${userAddress.slice(0, 8)}...${userAddress.slice(-8)}` : 'No conectado'}
              </span>
              <Button variant="outline" size="sm" onClick={disconnect}>
                Desconectar
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Withdraw (Admin Only) */}
      <Card>
        <CardHeader>
          <CardTitle>💸 Retirar XLM (Admin)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="withdraw-amount">Monto (XLM)</Label>
            <Input
              id="withdraw-amount"
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="5"
            />
          </div>
          <Button 
            onClick={handleWithdraw} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Procesando...' : 'Retirar'}
          </Button>
        </CardContent>
      </Card>

      {/* Position Management */}
      <Card>
        <CardHeader>
          <CardTitle>📈 Abrir Posición</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="asset">Activo</Label>
              <Select value={positionForm.asset} onValueChange={(value) => setPositionForm(prev => ({ ...prev, asset: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XLM">XLM</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="side">Lado</Label>
              <Select value={positionForm.side} onValueChange={(value) => setPositionForm(prev => ({ ...prev, side: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="long">Long</SelectItem>
                  <SelectItem value="short">Short</SelectItem>
                </SelectContent>
              </Select>
            </div>


            <div>
              <Label htmlFor="leverage">Leverage</Label>
              <Input
                id="leverage"
                type="number"
                value={positionForm.leverage}
                onChange={(e) => setPositionForm(prev => ({ ...prev, leverage: e.target.value }))}
                placeholder="2"
              />
            </div>

            <div>
              <Label htmlFor="margin">Margin (XLM)</Label>
              <Input
                id="margin"
                type="number"
                value={positionForm.margin}
                onChange={(e) => setPositionForm(prev => ({ ...prev, margin: e.target.value }))}
                placeholder="50"
              />
            </div>
          </div>

          <Button 
            onClick={handleOpenPosition} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Procesando...' : 'Abrir Posición'}
          </Button>
        </CardContent>
      </Card>

      {/* Price Oracle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Price Oracle Contract
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Precio actual de XLM */}
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              <span className="text-sm font-medium">Precio XLM:</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-lg font-bold">
                ${xlmPrice.toFixed(4)}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={getXlmPrice}
                disabled={priceLoading}
              >
                <RefreshCw className={`h-4 w-4 ${priceLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Información de actualización */}
          {lastUpdated && (
            <div className="text-xs text-slate-400">
              Última actualización: {lastUpdated.toLocaleTimeString()}
            </div>
          )}

          {/* Error del precio */}
          {priceError && (
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div className="text-red-400 text-sm">
                ❌ Error: {priceError}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={clearPriceError}
                className="mt-2"
              >
                Limpiar Error
              </Button>
            </div>
          )}

          {/* Botones de prueba */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={getXlmPrice}
              disabled={priceLoading}
              className="w-full"
            >
              {priceLoading ? 'Obteniendo...' : 'Obtener Precio XLM'}
            </Button>
            
            <Button
              onClick={getXlmPrice}
              disabled={priceLoading}
              variant="outline"
              className="w-full"
            >
              Actualizar Precio
            </Button>
          </div>

          {/* Información del contrato Oracle */}
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <div className="text-sm text-slate-300">
              <div className="font-medium mb-2">📊 Contrato Oracle:</div>
              <div className="text-xs space-y-1">
                <div>ID: CAYMTS6FAAYPCYUSMGRIIHSRBLTWB53EYPMANEV6UZMHE4VIBINF52TD</div>
                <div>Red: Testnet</div>
                <div>Estado: {priceLoading ? 'Cargando...' : 'Conectado'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Info */}
      <Card>
        <CardHeader>
          <CardTitle>ℹ️ Información del Contrato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleGetBalance} disabled={isLoading}>
              Obtener Balance
            </Button>
            <Button onClick={handleGetCurrentPosition} disabled={isLoading}>
              Posición Actual
            </Button>
            <Button onClick={handleGetConfig} disabled={isLoading}>
              Configuración
            </Button>
            <Button onClick={refreshData} disabled={isLoading}>
              Actualizar Datos
            </Button>
          </div>

          {contractStats && (
            <div className="mt-4 p-4 bg-slate-800/30 rounded-lg">
              <h4 className="font-semibold mb-2 text-slate-300">Estadísticas del Contrato:</h4>
              <pre className="text-xs text-slate-400">
                {JSON.stringify(contractStats, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};