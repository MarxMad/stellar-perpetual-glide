# 🔗 Guía de Webhook de Reflector - Stellar Perpetual Futures

Esta guía explica cómo configurar y usar el webhook de Reflector para obtener datos reales de precios en mainnet.

## 📋 Resumen

El webhook de Reflector permite recibir notificaciones en tiempo real cuando los precios de los activos cambian más allá de un umbral configurado. Esto es esencial para:

- **Liquidaciones automáticas** de posiciones
- **Alertas de precio** en tiempo real
- **Trading automático** basado en cambios de precio
- **Monitoreo de mercado** 24/7

## 🚀 Configuración Rápida

### 1. **Configurar el Webhook en tu App**

```typescript
// En WebhookConfig.tsx
const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://tu-dominio.com'  // ⚠️ Cambiar por tu dominio real
  : 'http://localhost:3000';

const fullWebhookUrl = `${baseUrl}/api/webhook-reflector`;
```

### 2. **Crear Suscripción en Reflector Network**

1. Ve a [https://reflector.network/subscription/add](https://reflector.network/subscription/add)
2. Configura los siguientes parámetros:

```
Data source: Aggregated CEX & DEX
Quote ticker: BTC (o el activo que quieras monitorear)
Base ticker: USD
Trigger threshold: 1% (o el umbral que prefieras)
Heartbeat interval: 15 minutes
Initial balance: 10 XRF
Webhook URL: https://tu-dominio.com/api/webhook-reflector
```

### 3. **Verificar el Webhook**

El endpoint `/api/webhook-reflector` está configurado para:
- ✅ Recibir webhooks POST de Reflector
- ✅ Validar el payload
- ✅ Procesar liquidaciones automáticas
- ✅ Enviar alertas de precio
- ✅ Responder con confirmación

## 📊 Estructura del Webhook

### Payload de Entrada (de Reflector)

```json
{
  "update": {
    "contract": "CBNGTWIVRCD4FOJ24FGAKI6I5SDAXI7A4GWKSQS7E6UYSR4E4OHRI2JX",
    "events": ["price_update"],
    "event": {
      "subscription": "sub_123456",
      "base": {
        "source": "exchanges",
        "asset": "BTC"
      },
      "quote": {
        "source": "exchanges", 
        "asset": "USD"
      },
      "decimals": 7,
      "price": "95000000",
      "prevPrice": "94000000",
      "timestamp": 1699123456
    },
    "root": "merkle_root_hash"
  },
  "signature": "signature_hash",
  "verifier": "verifier_address"
}
```

### Respuesta del Webhook

```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "timestamp": 1699123456789
}
```

## 🔧 Funcionalidades Implementadas

### 1. **Sistema de Liquidaciones**

```typescript
// Verifica automáticamente si alguna posición debe ser liquidada
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
```

### 2. **Alertas de Precio**

```typescript
// Envía alertas cuando el precio cambia más del 5%
if (priceChange > 0.05) {
  await this.sendPriceAlert({
    type: 'price_alert',
    asset,
    price,
    prevPrice,
    timestamp: event.timestamp,
    reason: `Precio cambió ${(priceChange * 100).toFixed(2)}%`
  });
}
```

### 3. **Monitoreo de Posiciones**

```typescript
// Agregar posición para monitoreo
webhookHandler.addPosition({
  id: 'pos_123',
  user: 'user_address',
  asset: 'BTC/USD',
  side: 'long',
  size: 1.0,
  entryPrice: 95000,
  margin: 10000,
  isLiquidated: false
});
```

## 🛡️ Seguridad

### Validación de Firma (Recomendado para Producción)

```typescript
// TODO: Implementar validación de firma
const signature = req.headers['x-reflector-signature'];
if (!validateSignature(payload, signature)) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

### Variables de Entorno

```bash
# .env
REFLECTOR_WEBHOOK_SECRET=your_webhook_secret_here
PUBLIC_WEBHOOK_BASE_URL=https://tu-dominio.com
```

## 📈 Monitoreo y Logs

### Logs del Webhook

```bash
# Ver logs en tiempo real
tail -f logs/webhook.log

# Buscar liquidaciones
grep "LIQUIDACIÓN" logs/webhook.log

# Buscar alertas de precio
grep "ALERTA DE PRECIO" logs/webhook.log
```

### Métricas Importantes

- **Tiempo de respuesta** del webhook
- **Número de liquidaciones** ejecutadas
- **Frecuencia de alertas** de precio
- **Errores** en el procesamiento

## 🔄 Flujo Completo

```mermaid
graph TD
    A[Reflector Network] -->|Webhook POST| B[/api/webhook-reflector]
    B --> C[Validar Payload]
    C --> D[Procesar Precio]
    D --> E[Verificar Liquidaciones]
    E --> F[Enviar Alertas]
    F --> G[Responder 200 OK]
    
    E -->|Liquidación| H[Ejecutar Liquidación]
    H --> I[Notificar Usuario]
    
    F -->|Alerta| J[Enviar Notificación]
```

## 🚨 Troubleshooting

### Error: Webhook no recibe datos

1. **Verificar URL**: Asegúrate de que la URL sea accesible públicamente
2. **Verificar SSL**: Usa HTTPS en producción
3. **Verificar logs**: Revisa los logs del servidor

### Error: Liquidaciones no se ejecutan

1. **Verificar posiciones**: Asegúrate de que las posiciones estén agregadas
2. **Verificar umbral**: Revisa el `liquidationThreshold`
3. **Verificar cálculos**: Revisa la lógica de PnL

### Error: Alertas no se envían

1. **Verificar umbral**: Revisa el umbral de alerta (5%)
2. **Verificar implementación**: Revisa los métodos de notificación
3. **Verificar logs**: Busca errores en el procesamiento

## 📞 Soporte

- **Reflector Discord**: https://discord.gg/2tWP5SX9dh
- **Documentación Reflector**: https://reflector.network/docs
- **Stellar Discord**: https://discord.gg/stellar

## 🔗 Enlaces Útiles

- [Reflector Network](https://reflector.network/)
- [Crear Suscripción](https://reflector.network/subscription/add)
- [Documentación API](https://reflector.network/docs)
- [Explorador de Contratos](https://stellar.expert/explorer/public/contract/CBNGTWIVRCD4FOJ24FGAKI6I5SDAXI7A4GWKSQS7E6UYSR4E4OHRI2JX)
