# 🚀 Guía de Deployment en Vercel - Stellar Perpetual Futures

Esta guía te ayudará a desplegar tu aplicación en Vercel y configurar el webhook de Reflector.

## 📋 Pasos para Deployment

### 1. **Preparar el Proyecto**

```bash
# Asegúrate de que el proyecto compile correctamente
npm run build

# Verificar que no hay errores
npm run lint
```

### 2. **Subir a GitHub**

```bash
# Inicializar git si no está inicializado
git init

# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "Initial commit: Stellar Perpetual Futures with Reflector webhook"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/tu-usuario/stellar-perpetual-glide.git
git push -u origin main
```

### 3. **Deploy en Vercel**

1. **Ir a [vercel.com](https://vercel.com)**
2. **Conectar con GitHub**
3. **Importar el proyecto**
4. **Configurar las variables de entorno**

### 4. **Variables de Entorno en Vercel**

En el dashboard de Vercel, ve a **Settings > Environment Variables** y agrega:

```bash
# Stellar Network
PUBLIC_STELLAR_NETWORK=public
PUBLIC_STELLAR_NETWORK_PASSPHRASE_PUBLIC="Public Global Stellar Network ; September 2015"
PUBLIC_STELLAR_HORIZON_URL_PUBLIC=https://horizon.stellar.org
PUBLIC_SOROBAN_RPC_URL_PUBLIC=https://soroban.stellar.org

# Reflector Mainnet
PUBLIC_REFLECTOR_CONTRACT_ID_PUBLIC=CBNGTWIVRCD4FOJ24FGAKI6I5SDAXI7A4GWKSQS7E6UYSR4E4OHRI2JX

# Webhook Configuration
PUBLIC_WEBHOOK_BASE_URL=https://tu-app.vercel.app
REFLECTOR_WEBHOOK_SECRET=tu_secreto_seguro_aqui

# KALE (opcional)
PUBLIC_KALE_CONTRACT_ID_PUBLIC=tu_kale_mainnet_contract_id
```

### 5. **Configuración de Build**

Vercel detectará automáticamente que es un proyecto Vite. La configuración en `vercel.json` manejará:

- ✅ **Build automático** con `vite build`
- ✅ **API routes** en `/api/*`
- ✅ **SPA routing** para React Router
- ✅ **Variables de entorno** para producción

## 🔗 Configurar Webhook de Reflector

### 1. **Obtener la URL del Webhook**

Una vez desplegado, tu webhook estará disponible en:
```
https://tu-app.vercel.app/api/webhook-reflector
```

### 2. **Crear Suscripción en Reflector Network**

1. **Ir a [https://reflector.network/subscription/add](https://reflector.network/subscription/add)**

2. **Configurar la suscripción:**

```
Data source: Aggregated CEX & DEX
Quote ticker: BTC
Base ticker: USD
Trigger threshold: 1%
Heartbeat interval: 15 minutes
Initial balance: 10 XRF
Webhook URL: https://tu-app.vercel.app/api/webhook-reflector
```

3. **Conectar tu wallet** (Freighter, Albedo, etc.)

4. **Confirmar la suscripción**

### 3. **Verificar el Webhook**

```bash
# Probar el endpoint
curl -X POST https://tu-app.vercel.app/api/webhook-reflector \
  -H "Content-Type: application/json" \
  -d '{"test": "webhook"}'
```

## 📊 Monitoreo del Deployment

### 1. **Logs de Vercel**

- Ve a **Functions** en el dashboard de Vercel
- Revisa los logs del endpoint `/api/webhook-reflector`
- Monitorea errores y rendimiento

### 2. **Logs del Webhook**

```bash
# En los logs de Vercel, busca:
📡 Webhook recibido: {...}
💰 Precio actualizado: BTC/USD = $95000
🚨 LIQUIDACIÓN: pos_123
📢 ALERTA DE PRECIO: BTC/USD
```

### 3. **Métricas Importantes**

- **Tiempo de respuesta** del webhook
- **Número de requests** por minuto
- **Errores** en el procesamiento
- **Uso de memoria** y CPU

## 🔧 Troubleshooting

### Error: Build Failed

```bash
# Verificar dependencias
npm install

# Limpiar cache
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Error: API Route Not Found

```bash
# Verificar que el archivo existe
ls -la src/pages/api/webhook-reflector.ts

# Verificar vercel.json
cat vercel.json
```

### Error: Environment Variables

```bash
# Verificar en Vercel Dashboard
# Settings > Environment Variables
# Asegúrate de que todas las variables estén configuradas
```

### Error: Webhook Not Receiving Data

1. **Verificar URL**: Asegúrate de que la URL sea correcta
2. **Verificar SSL**: Vercel usa HTTPS automáticamente
3. **Verificar logs**: Revisa los logs en Vercel
4. **Verificar suscripción**: Revisa en Reflector Network

## 🚀 Comandos Útiles

```bash
# Deploy local para testing
npm run build
npm run preview

# Verificar build
npm run build && npm run preview

# Linting
npm run lint

# Desarrollo
npm run dev
```

## 📝 Checklist de Deployment

- [ ] **Proyecto compila** sin errores
- [ ] **Variables de entorno** configuradas en Vercel
- [ ] **Webhook endpoint** accesible públicamente
- [ ] **Suscripción creada** en Reflector Network
- [ ] **Logs funcionando** correctamente
- [ ] **Pruebas realizadas** con datos reales

## 🔗 Enlaces Útiles

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Reflector Network**: https://reflector.network/
- **Crear Suscripción**: https://reflector.network/subscription/add
- **Documentación Vercel**: https://vercel.com/docs
- **Stellar Explorer**: https://stellar.expert/

## 🎯 Próximos Pasos

1. **Deploy en Vercel** ✅
2. **Configurar variables de entorno** ✅
3. **Crear suscripción en Reflector** ✅
4. **Probar webhook** con datos reales
5. **Monitorear** liquidaciones y alertas
6. **Optimizar** rendimiento si es necesario

¡Tu aplicación estará lista para recibir datos reales de precios de Reflector en mainnet! 🚀
