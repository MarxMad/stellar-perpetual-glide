# 📋 Información de Contratos - Stellar Perpetual Futures

Este archivo contiene toda la información importante de los contratos desplegados para referencia rápida.

## 🎯 Nuestro Contrato: Perpetual Futures

### Información Básica
- **Contract ID**: `CAIYZITU25T7GBSKO6WZWOTN72U4EB4FWFRJKP56ASWCE6QN7HIRQG5R`
- **Red**: Stellar Testnet
- **Estado**: ✅ Activo y funcionando
- **Fecha de Deployment**: 4 de Septiembre, 2025
- **Explorer**: https://stellar.expert/explorer/testnet/contract/CAIYZITU25T7GBSKO6WZWOTN72U4EB4FWFRJKP56ASWCE6QN7HIRQG5R

### Funciones Disponibles

#### `initialize(oracle_address: Address)`
- **Descripción**: Inicializa el contrato con la dirección del oráculo de Reflector
- **Parámetros**: 
  - `oracle_address`: Dirección del contrato de Reflector Oracle
- **Estado**: ✅ Inicializado con Reflector Oracle

#### `get_oracle_address() -> Address`
- **Descripción**: Obtiene la dirección del oráculo configurado
- **Retorna**: Dirección del contrato de Reflector
- **Valor actual**: `CAFJZQWSED6YAWZU3GWRTOCNPPCGBN32L7QV43XX5LZLFTK6JLN34DLN`

#### `calculate_funding_rate(spot_price: i128, futures_price: i128) -> i128`
- **Descripción**: Calcula el funding rate basado en la diferencia de precios
- **Parámetros**:
  - `spot_price`: Precio spot en micro-units (ej: 1234000 para $1.234)
  - `futures_price`: Precio futures en micro-units
- **Retorna**: Funding rate en basis points
- **Ejemplo**: `calculate_funding_rate(1234000, 1235000)` retorna `1` (0.01%)

#### `is_price_valid(price: i128) -> bool`
- **Descripción**: Valida si un precio está dentro del rango aceptable
- **Parámetros**: `price` en micro-units
- **Retorna**: `true` si el precio es válido (0 < price < 1,000,000,000,000)

#### `version() -> u32`
- **Descripción**: Obtiene la versión del contrato
- **Retorna**: Versión actual (1)

### Comandos de Prueba

```bash
# Obtener dirección del oráculo
stellar contract invoke \
  --id CAIYZITU25T7GBSKO6WZWOTN72U4EB4FWFRJKP56ASWCE6QN7HIRQG5R \
  --source-account alice \
  --network testnet \
  -- get_oracle_address

# Calcular funding rate
stellar contract invoke \
  --id CAIYZITU25T7GBSKO6WZWOTN72U4EB4FWFRJKP56ASWCE6QN7HIRQG5R \
  --source-account alice \
  --network testnet \
  -- calculate_funding_rate \
  --spot_price 1234000 \
  --futures_price 1235000

# Verificar versión
stellar contract invoke \
  --id CAIYZITU25T7GBSKO6WZWOTN72U4EB4FWFRJKP56ASWCE6QN7HIRQG5R \
  --source-account alice \
  --network testnet \
  -- version
```

---

## 🔮 Reflector Oracle Contract

### Información Básica
- **Contract ID**: `CAVLP5DH2GJPZMVO7IJY4CVOD5MWEFTJFVPD2YY2FQXOQHRGHK4D6HLP`
- **Red**: Stellar Testnet
- **Tipo**: Oracle de precios push-based
- **Documentación**: https://reflector.network/docs
- **Estado**: ✅ Activo con datos reales
- **Explorer**: https://stellar.expert/explorer/testnet/contract/CAVLP5DH2GJPZMVO7IJY4CVOD5MWEFTJFVPD2YY2FQXOQHRGHK4D6HLP

### Funciones Principales

#### `lastprice(asset: Asset) -> Option<PriceData>`
- **Descripción**: Obtiene el último precio de un activo
- **Parámetros**: `asset` - Símbolo del activo (ej: "XLM", "BTC")
- **Retorna**: `PriceData` con precio y timestamp

#### `twap(asset: Asset, records: u32) -> Option<i128>`
- **Descripción**: Precio promedio ponderado por tiempo
- **Parámetros**: 
  - `asset`: Símbolo del activo
  - `records`: Número de registros a promediar
- **Retorna**: TWAP en micro-units

#### `x_last_price(base_asset: Asset, quote_asset: Asset) -> Option<PriceData>`
- **Descripción**: Precio cruzado entre dos activos
- **Parámetros**: 
  - `base_asset`: Activo base
  - `quote_asset`: Activo cotizado
- **Retorna**: Precio cruzado

#### `decimals() -> u32`
- **Descripción**: Número de decimales del oráculo
- **Retorna**: `7` (estándar de Stellar)

#### `resolution() -> u32`
- **Descripción**: Resolución de tiempo en segundos
- **Retorna**: `300` (5 minutos)

### Comandos de Prueba

```bash
# Obtener último precio de USDC (activo con datos reales)
stellar contract invoke \
  --id CAVLP5DH2GJPZMVO7IJY4CVOD5MWEFTJFVPD2YY2FQXOQHRGHK4D6HLP \
  --source-account alice \
  --network testnet \
  -- lastprice \
  --asset '{"Stellar":"CDJF2JQINO7WRFXB2AAHLONFDPPI4M3W2UM5THGQQ7JMJDIEJYC4CMPG"}'

# Obtener TWAP de 5 períodos
stellar contract invoke \
  --id CAVLP5DH2GJPZMVO7IJY4CVOD5MWEFTJFVPD2YY2FQXOQHRGHK4D6HLP \
  --source-account alice \
  --network testnet \
  -- twap \
  --asset '{"Stellar":"CDJF2JQINO7WRFXB2AAHLONFDPPI4M3W2UM5THGQQ7JMJDIEJYC4CMPG"}' \
  --records 5

# Obtener decimales
stellar contract invoke \
  --id CAVLP5DH2GJPZMVO7IJY4CVOD5MWEFTJFVPD2YY2FQXOQHRGHK4D6HLP \
  --source-account alice \
  --network testnet \
  -- decimals

# Ver activos disponibles
stellar contract invoke \
  --id CAVLP5DH2GJPZMVO7IJY4CVOD5MWEFTJFVPD2YY2FQXOQHRGHK4D6HLP \
  --source-account alice \
  --network testnet \
  -- assets
```

---

## 🌿 KALE Rewards Contract

### Información Básica
- **Contract ID**: `CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE`
- **Red**: Stellar Testnet
- **Tipo**: Sistema de recompensas proof-of-teamwork
- **Documentación**: https://kaleonstellar.com/
- **Explorer**: https://stellar.expert/explorer/testnet/contract/CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE

### Funciones Principales
- **Staking**: Stake tokens KALE para obtener recompensas
- **Tareas**: Completar tareas para ganar tokens
- **Leaderboard**: Sistema de ranking de usuarios
- **Harvest**: Cosechar recompensas acumuladas

---

## 🔧 Configuración de Red

### Testnet
```typescript
export const STELLAR_CONFIG = {
  network: Networks.TESTNET,
  horizonUrl: 'https://horizon-testnet.stellar.org',
  sorobanRpcUrl: 'https://soroban-testnet.stellar.org',
  networkPassphrase: 'Test SDF Network ; September 2015',
};
```

### URLs Importantes
- **Horizon Testnet**: https://horizon-testnet.stellar.org
- **Soroban RPC Testnet**: https://soroban-testnet.stellar.org
- **Stellar Explorer**: https://stellar.expert/
- **Testnet Explorer**: https://testnet.stellar.org/

---

## 📝 Notas de Deployment

### Transacciones Importantes
- **Deployment**: https://stellar.expert/explorer/testnet/tx/e522ecc5b22f1f01e5b2466023aaea66891e6ee7b539d978f50380d5c1137ffb
- **Inicialización**: Contrato inicializado con Reflector Oracle

### Cuenta de Deployment
- **Identidad**: `alice`
- **Clave Pública**: `GCDRKNJ6EDXQOKH7UQJ2FGGPHJ2NKHKAQHQRZKC4DFDZOKRAN4TF6NPE`
- **Red**: Testnet
- **Fondos**: Obtenidos via Friendbot

### Archivos de Configuración
- **Alias**: `perpetual_futures` (configurado en Stellar CLI)
- **WASM**: `target/wasm32-unknown-unknown/release/perpetual_futures.optimized.wasm`
- **Tamaño**: 3,315 bytes (optimizado)

---

## 🚀 Próximos Pasos

1. **Implementar más funciones** en el smart contract
2. **Agregar validaciones** de seguridad adicionales
3. **Optimizar gas fees** y rendimiento
4. **Preparar para Mainnet** deployment
5. **Implementar más activos** y pares de trading
6. **Agregar analytics** y métricas

---

## 📞 Soporte

- **Stellar Discord**: https://discord.gg/stellar
- **Reflector Discord**: https://discord.gg/2tWP5SX9dh
- **KALE Telegram**: https://t.me/kaleonstellar
- **Documentación Stellar**: https://developers.stellar.org/
