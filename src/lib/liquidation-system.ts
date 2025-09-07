import { reflectorMainnetClient } from './reflector-enhanced-client';

export interface Position {
  id: string;
  user: string;
  asset: string;
  side: 'long' | 'short';
  size: number; // Tamaño de la posición en USD
  entryPrice: number;
  currentPrice: number;
  leverage: number;
  margin: number; // Margen depositado
  pnl: number; // Profit/Loss actual
  liquidationPrice: number;
  isLiquidated: boolean;
}

export interface LiquidationEvent {
  positionId: string;
  user: string;
  asset: string;
  liquidationPrice: number;
  timestamp: number;
  reason: 'margin_call' | 'stop_loss' | 'take_profit';
}

export class LiquidationSystem {
  private positions: Map<string, Position> = new Map();
  private liquidationThreshold: number = 0.8; // 80% del margen
  private webhookUrl: string = '';

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  // Crear una nueva posición
  createPosition(
    user: string,
    asset: string,
    side: 'long' | 'short',
    size: number,
    entryPrice: number,
    leverage: number,
    margin: number
  ): Position {
    const positionId = `${user}-${asset}-${Date.now()}`;
    const liquidationPrice = this.calculateLiquidationPrice(
      side,
      entryPrice,
      leverage,
      margin,
      size
    );

    const position: Position = {
      id: positionId,
      user,
      asset,
      side,
      size,
      entryPrice,
      currentPrice: entryPrice,
      leverage,
      margin,
      pnl: 0,
      liquidationPrice,
      isLiquidated: false
    };

    this.positions.set(positionId, position);
    console.log(`✅ Posición creada: ${positionId}`, position);
    
    return position;
  }

  // Calcular precio de liquidación
  private calculateLiquidationPrice(
    side: 'long' | 'short',
    entryPrice: number,
    leverage: number,
    margin: number,
    size: number
  ): number {
    const marginRatio = margin / size; // Ej: 0.1 para 10x leverage
    
    if (side === 'long') {
      // Para long: precio baja = pérdida
      // Liquidación cuando pérdida = margen
      return entryPrice * (1 - marginRatio);
    } else {
      // Para short: precio sube = pérdida
      return entryPrice * (1 + marginRatio);
    }
  }

  // Actualizar precio y verificar liquidaciones
  async updatePrice(asset: string, newPrice: number): Promise<LiquidationEvent[]> {
    const liquidations: LiquidationEvent[] = [];
    
    // Buscar todas las posiciones de este activo
    const assetPositions = Array.from(this.positions.values())
      .filter(p => p.asset === asset && !p.isLiquidated);

    for (const position of assetPositions) {
      // Actualizar precio y PnL
      position.currentPrice = newPrice;
      position.pnl = this.calculatePnL(position);

      // Verificar si debe liquidarse
      const shouldLiquidate = this.shouldLiquidate(position);
      
      if (shouldLiquidate) {
        const liquidationEvent = await this.liquidatePosition(position, newPrice);
        liquidations.push(liquidationEvent);
      }
    }

    return liquidations;
  }

  // Calcular PnL
  private calculatePnL(position: Position): number {
    const priceChange = (position.currentPrice - position.entryPrice) / position.entryPrice;
    
    if (position.side === 'long') {
      return position.size * priceChange;
    } else {
      return position.size * (-priceChange);
    }
  }

  // Verificar si debe liquidarse
  private shouldLiquidate(position: Position): boolean {
    // Liquidar si el PnL negativo es >= 80% del margen
    const lossPercentage = Math.abs(position.pnl) / position.margin;
    return lossPercentage >= this.liquidationThreshold;
  }

  // Liquidar posición
  private async liquidatePosition(position: Position, liquidationPrice: number): Promise<LiquidationEvent> {
    position.isLiquidated = true;
    
    const liquidationEvent: LiquidationEvent = {
      positionId: position.id,
      user: position.user,
      asset: position.asset,
      liquidationPrice,
      timestamp: Date.now(),
      reason: 'margin_call'
    };

    console.log(`🚨 LIQUIDACIÓN: ${position.id}`, liquidationEvent);

    // Enviar webhook de liquidación
    await this.sendLiquidationWebhook(liquidationEvent);

    return liquidationEvent;
  }

  // Enviar webhook de liquidación
  private async sendLiquidationWebhook(event: LiquidationEvent): Promise<void> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'liquidation',
          event,
          timestamp: Date.now()
        })
      });

      if (response.ok) {
        console.log(`✅ Webhook de liquidación enviado: ${event.positionId}`);
      } else {
        console.error(`❌ Error enviando webhook: ${response.status}`);
      }
    } catch (error) {
      console.error('Error enviando webhook de liquidación:', error);
    }
  }

  // Obtener posiciones de un usuario
  getUserPositions(user: string): Position[] {
    return Array.from(this.positions.values())
      .filter(p => p.user === user && !p.isLiquidated);
  }

  // Obtener todas las posiciones activas
  getAllActivePositions(): Position[] {
    return Array.from(this.positions.values())
      .filter(p => !p.isLiquidated);
  }

  // Simular monitoreo de precios con webhooks de Reflector
  async startPriceMonitoring(): Promise<void> {
    console.log('🔍 Iniciando monitoreo de precios...');
    
    // Obtener todas las posiciones activas
    const activePositions = this.getAllActivePositions();
    const assets = [...new Set(activePositions.map(p => p.asset))];

    // Configurar webhooks de Reflector para cada activo
    for (const asset of assets) {
      await this.setupReflectorWebhook(asset);
    }
  }

  // Configurar webhook de Reflector para un activo
  private async setupReflectorWebhook(asset: string): Promise<void> {
    try {
      // Aquí usarías el cliente de suscripciones de Reflector
      // para crear una suscripción que monitoree el precio
      
      console.log(`📡 Configurando webhook de Reflector para ${asset}...`);
      
      // Ejemplo de configuración (necesitarías implementar el cliente de suscripciones)
      const subscriptionConfig = {
        base: { asset: asset, source: 'exchanges' },
        quote: { asset: 'USD', source: 'exchanges' },
        threshold: 0.1, // 0.1% de cambio
        heartbeat: 1, // 1 minuto
        webhook: this.webhookUrl,
        initialBalance: '100' // 100 XRF tokens
      };

      console.log(`✅ Webhook configurado para ${asset}:`, subscriptionConfig);
    } catch (error) {
      console.error(`Error configurando webhook para ${asset}:`, error);
    }
  }
}

// Instancia global del sistema de liquidación
export const liquidationSystem = new LiquidationSystem(
  process.env.REACT_APP_WEBHOOK_URL || 'http://localhost:3001/webhook'
);
