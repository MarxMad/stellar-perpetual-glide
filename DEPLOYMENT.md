# 🚀 Guía de Deployment - Stellar Perpetual Futures

Esta guía contiene todos los comandos y pasos necesarios para desplegar y mantener los contratos.

## 📋 Resumen de Contratos

| Contrato | ID | Estado | Función |
|----------|----|---------|---------| 
| **Perpetual Futures** | `CAIYZITU25T7GBSKO6WZWOTN72U4EB4FWFRJKP56ASWCE6QN7HIRQG5R` | ✅ Activo | Nuestro contrato principal |
| **Reflector Oracle** | `CAFJZQWSED6YAWZU3GWRTOCNPPCGBN32L7QV43XX5LZLFTK6JLN34DLN` | ✅ Activo | Oracle de precios |
| **KALE Rewards** | `CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE` | ✅ Activo | Sistema de recompensas |

## 🛠️ Comandos de Deployment

### 1. Compilar Contrato
```bash
cd src/contracts
cargo build --target wasm32-unknown-unknown --release
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/perpetual_futures.wasm
```

### 2. Desplegar en Testnet
```bash
# Usar el script automatizado
./deploy-testnet.sh

# O manualmente:
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/perpetual_futures.optimized.wasm \
  --source-account alice \
  --network testnet \
  --alias perpetual_futures
```

### 3. Inicializar Contrato
```bash
stellar contract invoke \
  --id CAIYZITU25T7GBSKO6WZWOTN72U4EB4FWFRJKP56ASWCE6QN7HIRQG5R \
  --source-account alice \
  --network testnet \
  -- initialize \
  --oracle_address CAFJZQWSED6YAWZU3GWRTOCNPPCGBN32L7QV43XX5LZLFTK6JLN34DLN
```

## 🧪 Comandos de Prueba

### Probar Nuestro Contrato
```bash
# Obtener información del contrato
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

### Probar Reflector Oracle
```bash
# Obtener último precio de XLM
stellar contract invoke \
  --id CAFJZQWSED6YAWZU3GWRTOCNPPCGBN32L7QV43XX5LZLFTK6JLN34DLN \
  --source-account alice \
  --network testnet \
  -- lastprice \
  --asset "XLM"

# Obtener TWAP
stellar contract invoke \
  --id CAFJZQWSED6YAWZU3GWRTOCNPPCGBN32L7QV43XX5LZLFTK6JLN34DLN \
  --source-account alice \
  --network testnet \
  -- twap \
  --asset "XLM" \
  --records 5
```

## 🔧 Configuración de Cuenta

### Crear Identidad
```bash
stellar keys generate --global alice --network testnet
```

### Obtener Fondos (Friendbot)
```bash
curl "https://friendbot.stellar.org/?addr=GCDRKNJ6EDXQOKH7UQJ2FGGPHJ2NKHKAQHQRZKC4DFDZOKRAN4TF6NPE"
```

### Verificar Balance
```bash
stellar account get GCDRKNJ6EDXQOKH7UQJ2FGGPHJ2NKHKAQHQRZKC4DFDZOKRAN4TF6NPE --network testnet
```

## 📊 Monitoreo

### Exploradores
- **Stellar Expert**: https://stellar.expert/explorer/testnet/contract/CAIYZITU25T7GBSKO6WZWOTN72U4EB4FWFRJKP56ASWCE6QN7HIRQG5R
- **Testnet Explorer**: https://testnet.stellar.org/

### Logs de Transacciones
- **Deployment**: https://stellar.expert/explorer/testnet/tx/e522ecc5b22f1f01e5b2466023aaea66891e6ee7b539d978f50380d5c1137ffb
- **Inicialización**: Ver en Stellar Expert

## 🔄 Actualización de Contrato

### 1. Compilar Nueva Versión
```bash
cd src/contracts
cargo build --target wasm32-unknown-unknown --release
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/perpetual_futures.wasm
```

### 2. Desplegar Nueva Versión
```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/perpetual_futures.optimized.wasm \
  --source-account alice \
  --network testnet \
  --alias perpetual_futures_v2
```

### 3. Actualizar Configuración
```typescript
// En src/lib/stellar.ts
export const PERPETUAL_CONTRACT_CONFIG = {
  contractId: 'NUEVO_CONTRACT_ID',
  // ... resto de configuración
};
```

## 🚨 Troubleshooting

### Error: Account not found
```bash
# Obtener fondos via Friendbot
curl "https://friendbot.stellar.org/?addr=TU_DIRECCION"
```

### Error: Contract not found
```bash
# Verificar que el contrato existe
stellar contract info --id CONTRACT_ID --network testnet
```

### Error: Insufficient funds
```bash
# Verificar balance
stellar account get TU_DIRECCION --network testnet
```

## 📝 Notas Importantes

1. **Siempre usar Testnet** para desarrollo
2. **Verificar fondos** antes de deployment
3. **Guardar Contract IDs** en configuración
4. **Probar funciones** después de deployment
5. **Documentar cambios** en CONTRACTS.md

## 🔗 Enlaces Útiles

- **Stellar CLI Docs**: https://github.com/stellar/stellar-cli
- **Soroban Docs**: https://soroban.stellar.org/docs
- **Reflector Docs**: https://reflector.network/docs
- **KALE Docs**: https://kaleonstellar.com/
