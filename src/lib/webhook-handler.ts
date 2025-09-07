// Handler para webhooks de Reflector
export interface ReflectorWebhookPayload {
  update: {
    contract: string;
    events: string[];
    event: {
      subscription: string;
      base: {
        source: string;
        asset: string;
      };
      quote: {
        source: string;
        asset: string;
      };
      decimals: number;
      price: string;
      prevPrice: string;
      timestamp: number;
    };
    root: string;
  };
  signature: string;
  verifier: string;
}

export interface LiquidationEvent {
  type: 'liquidation' | 'price_alert' | 'funding_rate';
  positionId?: string;
  user?: string;
  asset: string;
  price: number;
  prevPrice: number;
  timestamp: number;
  reason?: string;
}

export class WebhookHandler {
  private positions: Map<string, any> = new Map();
  private liquidationThreshold: number = 0.8; // 80% del margen

  // Procesar webhook de Reflector
  async handleReflectorWebhook(payload: ReflectorWebhookPayload): Promise<void> {
    try {
      console.log('📡 Webhook de Reflector recibido:', payload);

      const { event } = payload.update;
      const asset = `${event.base.asset}/${event.quote.asset}`;
      const price = parseFloat(event.price) / Math.pow(10, event.decimals);
      const prevPrice = parseFloat(event.prevPrice) / Math.pow(10, event.decimals);
      const priceChange = Math.abs(price - prevPrice) / prevPrice;

      console.log(`💰 Precio actualizado: ${asset} = $${price} (cambio: ${(priceChange * 100).toFixed(2)}%)`);

      // Verificar liquidaciones
      await this.checkLiquidations(asset, price);

      // Enviar alertas de precio
      if (priceChange > 0.05) { // 5% de cambio
        await this.sendPriceAlert({
          type: 'price_alert',
          asset,
          price,
          prevPrice,
          timestamp: event.timestamp,
          reason: `Precio cambió ${(priceChange * 100).toFixed(2)}%`
        });
      }

    } catch (error) {
      console.error('Error procesando webhook de Reflector:', error);
    }
  }

  // Verificar liquidaciones
  private async checkLiquidations(asset: string, currentPrice: number): Promise<void> {
    const positions = Array.from(this.positions.values())
      .filter(p => p.asset === asset && !p.isLiquidated);

    for (const position of positions) {
      const pnl = this.calculatePnL(position, currentPrice);
      const lossPercentage = Math.abs(pnl) / position.margin;

      if (lossPercentage >= this.liquidationThreshold) {
        await this.liquidatePosition(position, currentPrice);
      }
    }
  }

  // Calcular PnL
  private calculatePnL(position: any, currentPrice: number): number {
    const priceChange = (currentPrice - position.entryPrice) / position.entryPrice;
    
    if (position.side === 'long') {
      return position.size * priceChange;
    } else {
      return position.size * (-priceChange);
    }
  }

  // Liquidar posición
  private async liquidatePosition(position: any, liquidationPrice: number): Promise<void> {
    position.isLiquidated = true;
    
    const liquidationEvent: LiquidationEvent = {
      type: 'liquidation',
      positionId: position.id,
      user: position.user,
      asset: position.asset,
      price: liquidationPrice,
      prevPrice: position.entryPrice,
      timestamp: Date.now(),
      reason: 'margin_call'
    };

    console.log(`🚨 LIQUIDACIÓN: ${position.id}`, liquidationEvent);

    // Aquí puedes:
    // 1. Enviar notificación por email/SMS
    // 2. Ejecutar orden de cierre automática
    // 3. Actualizar base de datos
    // 4. Enviar alerta a la aplicación

    await this.sendLiquidationNotification(liquidationEvent);
  }

  // Enviar alerta de precio
  private async sendPriceAlert(event: LiquidationEvent): Promise<void> {
    console.log(`📢 ALERTA DE PRECIO: ${event.asset}`, event);
    
    // Aquí puedes enviar notificaciones:
    // - Push notifications
    // - Email alerts
    // - SMS
    // - Discord/Slack webhooks
  }

  // Enviar notificación de liquidación
  private async sendLiquidationNotification(event: LiquidationEvent): Promise<void> {
    console.log(`🚨 NOTIFICACIÓN DE LIQUIDACIÓN:`, event);
    
    // TODO: Implementar notificaciones reales
    // - Enviar email/SMS al usuario
    // - Notificación push en la app
    // - Log en base de datos
    // - Webhook a sistema externo
    
    // Ejemplo de implementación:
    // await this.sendEmail(event.user, 'Liquidation Alert', event);
    // await this.sendPushNotification(event.user, event);
    // await this.logToDatabase(event);
  }

  // Agregar posición para monitoreo
  addPosition(position: any): void {
    this.positions.set(position.id, position);
    console.log(`✅ Posición agregada para monitoreo: ${position.id}`);
  }

  // Remover posición
  removePosition(positionId: string): void {
    this.positions.delete(positionId);
    console.log(`❌ Posición removida del monitoreo: ${positionId}`);
  }
}

// Instancia global del handler
export const webhookHandler = new WebhookHandler();
