# 💰 Guía de Fondos para Reflector Network

Esta guía explica cómo fondear tu cuenta para usar Reflector Network y crear suscripciones de webhook.

## 🎯 **¿Qué Necesitas Fondear?**

### **NO es tu contrato** ❌
Tu contrato de Perpetual Futures NO necesita fondos para recibir webhooks.

### **SÍ es tu cuenta personal** ✅
Tu cuenta personal de Stellar que usarás para:
- Conectar con Reflector Network
- Crear suscripciones
- Pagar fees de transacción

## 💎 **Tokens XRF (Reflector Token)**

### **¿Qué son los XRF?**
- Tokens nativos de Reflector Network
- Se usan para pagar suscripciones
- Cada suscripción cuesta ~10 XRF inicialmente
- Se consumen gradualmente según el uso

### **¿Dónde Obtener XRF?**

#### **Opción 1: Stellar DEX (Recomendado)**
```
1. Ve a https://stellar.expert/explorer/public/asset/XRF-GBZ35ZJRIKJGYH5PBKLKOX5SCTU4C43ZEIAT2Q7Q3U5U3S3N
2. Conecta tu wallet (Freighter, Albedo, etc.)
3. Intercambia XLM por XRF
4. Cantidad recomendada: 50-100 XRF
```

#### **Opción 2: Exchanges**
```
- StellarX
- Lobstr
- Interstellar
- Cualquier exchange que soporte XRF
```

#### **Opción 3: Comunidad**
```
- Discord de Reflector: https://discord.gg/2tWP5SX9dh
- Pregunta por faucets o airdrops
- Intercambio directo con otros usuarios
```

## 🔧 **Configurar tu Wallet**

### **1. Instalar Freighter (Recomendado)**
```bash
# Descargar desde: https://freighter.app/
# O instalar extensión del navegador
```

### **2. Crear/Importar Cuenta**
```bash
# Crear nueva cuenta
# O importar cuenta existente con seed phrase
```

### **3. Fondear con XLM**
```bash
# Para Testnet (desarrollo)
curl "https://friendbot.stellar.org/?addr=TU_DIRECCION"

# Para Mainnet (producción)
# Comprar XLM en exchange y enviar a tu dirección
```

## 💰 **Proceso de Fondos Completo**

### **Paso 1: Obtener XLM**
```bash
# Testnet: Friendbot (gratis)
curl "https://friendbot.stellar.org/?addr=TU_DIRECCION"

# Mainnet: Comprar en exchange
# Binance, Coinbase, Kraken, etc.
```

### **Paso 2: Obtener XRF**
```bash
# Intercambiar XLM por XRF en Stellar DEX
# Cantidad recomendada: 50-100 XRF
```

### **Paso 3: Verificar Balance**
```bash
# En tu wallet, verificar que tienes:
# - XLM: Para fees de transacción
# - XRF: Para suscripciones de Reflector
```

## 🚀 **Crear Suscripción en Reflector**

### **1. Conectar Wallet**
```
1. Ve a https://reflector.network/subscription/add
2. Conecta tu wallet (Freighter, Albedo, etc.)
3. Verifica que tienes XRF suficiente
```

### **2. Configurar Suscripción**
```
Data source: Aggregated CEX & DEX
Quote ticker: BTC
Base ticker: USD
Trigger threshold: 1%
Heartbeat interval: 15 minutes
Initial balance: 10 XRF
Webhook URL: https://tu-app.vercel.app/api/webhook-reflector
```

### **3. Confirmar y Pagar**
```
- Revisar configuración
- Confirmar transacción
- Pagar con XRF (se deduce automáticamente)
```

## 📊 **Costos Estimados**

### **Suscripción Inicial**
```
- Costo inicial: ~10 XRF
- Consumo mensual: ~5-20 XRF (depende del uso)
- Fees de transacción: ~0.00001 XLM
```

### **Recomendación de Fondos**
```
- XLM: 10-50 XLM (para fees)
- XRF: 50-100 XRF (para suscripciones)
- Total estimado: ~$50-100 USD
```

## 🔍 **Verificar Fondos**

### **En tu Wallet**
```bash
# Verificar balance de XLM
# Verificar balance de XRF
# Verificar que la cuenta está activa
```

### **En Stellar Explorer**
```bash
# Ve a https://stellar.expert/explorer/public/account/TU_DIRECCION
# Verifica balances y transacciones
```

## 🚨 **Troubleshooting**

### **Error: Insufficient XRF**
```bash
# Solución: Obtener más XRF
# Intercambiar XLM por XRF en Stellar DEX
```

### **Error: Insufficient XLM**
```bash
# Solución: Fondear con XLM
# Testnet: Friendbot
# Mainnet: Comprar en exchange
```

### **Error: Account Not Found**
```bash
# Solución: Activar cuenta
# Enviar mínimo 1 XLM para activar
```

## 🔗 **Enlaces Útiles**

- **Stellar DEX**: https://stellar.expert/explorer/public/asset/XRF-GBZ35ZJRIKJGYH5PBKLKOX5SCTU4C43ZEIAT2Q7Q3U5U3S3N
- **Freighter Wallet**: https://freighter.app/
- **Reflector Network**: https://reflector.network/
- **Stellar Explorer**: https://stellar.expert/
- **Discord Reflector**: https://discord.gg/2tWP5SX9dh

## 📝 **Checklist de Fondos**

- [ ] **Wallet instalado** (Freighter, Albedo, etc.)
- [ ] **Cuenta creada/importada**
- [ ] **XLM obtenido** (para fees)
- [ ] **XRF obtenido** (para suscripciones)
- [ ] **Balance verificado**
- [ ] **Listo para crear suscripción**

## 🎯 **Resumen**

1. **NO fondear tu contrato** - No es necesario
2. **SÍ fondear tu cuenta personal** - Para crear suscripciones
3. **Obtener XRF** - Para pagar suscripciones
4. **Obtener XLM** - Para fees de transacción
5. **Crear suscripción** - En Reflector Network
6. **Recibir webhooks** - En tu aplicación

¡Tu contrato recibirá los webhooks automáticamente una vez configurada la suscripción! 🚀
