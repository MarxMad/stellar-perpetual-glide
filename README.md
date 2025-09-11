# Stellar Perpetual Futures Platform

Una plataforma de trading de futuros perpetuos construida en Stellar usando Soroban, integrada con Reflector Oracle y KALE Rewards.

## 🚀 Características

- **Trading de Futuros Perpetuos** con funding rates dinámicos
- **Integración con Reflector Oracle** para precios en tiempo real
- **Sistema de Recompensas KALE** para staking y tareas
- **Conexión de Wallets** usando StellarWalletsKit
- **Smart Contracts** desplegados en Stellar Testnet
- **Interfaz Moderna** construida con React y Tailwind CSS

## 📋 Contratos Desplegados

### 🎯 Perpetual Trading Contract (Nuestro Contrato Principal)
- **Contract ID**: `CBCKPEPZZ6H66555PB7ZR3YQNX2GBHR4VFP7NZIV4KZ36345YFZXEZE2`
- **Red**: Stellar Testnet
- **Estado**: ✅ Activo y funcionando
- **Explorer**: https://stellar.expert/explorer/testnet/contract/CBCKPEPZZ6H66555PB7ZR3YQNX2GBHR4VFP7NZIV4KZ36345YFZXEZE2
- **Funciones principales**:
  - `initialize(admin_address)` - Inicializar contrato con admin
  - `deposit_xlm(trader, amount)` - Depositar XLM para margin
  - `open_position(trader, asset, margin, leverage, is_long)` - Abrir posición long/short
  - `close_position(trader, position_id)` - Cerrar posición y calcular PnL
  - `withdraw_xlm(amount)` - Retirar XLM del contrato
  - `get_trader_balance()` - Obtener balance del trader
  - `get_current_position()` - Obtener posición actual
  - `get_config()` - Obtener configuración del contrato
  - `pause_contract()` / `resume_contract()` - Pausar/reanudar contrato
  - `version()` - Obtener versión del contrato

### 🔮 Price Oracle Contract (Integración con Reflector)
- **Contract ID**: `CAYMTS6FAAYPCYUSMGRIIHSRBLTWB53EYPMANEV6UZMHE4VIBINF52TD`
- **Red**: Stellar Testnet
- **Estado**: ✅ Activo y funcionando
- **Explorer**: https://stellar.expert/explorer/testnet/contract/CAYMTS6FAAYPCYUSMGRIIHSRBLTWB53EYPMANEV6UZMHE4VIBINF52TD
- **Funciones principales**:
  - `initialize(oracle_address)` - Inicializar con Reflector Oracle
  - `get_xlm_price()` - Obtener precio de XLM desde Reflector
  - `get_btc_price()` - Obtener precio de BTC desde Reflector
  - `get_eth_price()` - Obtener precio de ETH desde Reflector
  - `get_xlm_twap(records)` - Obtener TWAP de XLM
  - `is_price_fresh(price)` - Verificar si el precio es fresco
  - `calculate_funding_rate(spot_price, futures_price)` - Calcular funding rate
  - `version()` - Obtener versión del contrato

### 🌐 Reflector Oracle Contract (Externo)
- **Contract ID**: `CAVLP5DH2GJPZMVO7IJY4CVOD5MWEFTJFVPD2YY2FQXOQHRGHK4D6HLP`
- **Red**: Stellar Testnet
- **Tipo**: Oracle de precios push-based
- **Documentación**: https://reflector.network/docs
- **Estado**: ✅ Activo con datos reales
- **Activos disponibles**: XLM, USDC, BTC, ETH, SOL, ADA
- **Funciones principales**:
  - `lastprice(asset)` - Último precio de un activo
  - `twap(asset, records)` - Precio promedio ponderado por tiempo
  - `x_last_price(base, quote)` - Precio cruzado entre activos
  - `decimals()` - Decimales del oráculo
  - `resolution()` - Resolución de tiempo (5 minutos)

### 🌿 KALE Rewards Contract
- **Contract ID**: `CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE`
- **Red**: Stellar Testnet
- **Tipo**: Sistema de recompensas proof-of-teamwork
- **Documentación**: https://kaleonstellar.com/
- **Funciones**:
  - Staking de tokens KALE
  - Completar tareas para recompensas
  - Sistema de leaderboard
  - Harvest de recompensas

## 🛠️ Configuración de Red

```typescript
// Configuración para Testnet
export const STELLAR_CONFIG = {
  network: Networks.TESTNET,
  horizonUrl: 'https://horizon-testnet.stellar.org',
  sorobanRpcUrl: 'https://soroban-testnet.stellar.org',
  networkPassphrase: 'Test SDF Network ; September 2015',
};
```

## 📦 Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Stellar CLI (para deployment de contratos)
- Rust (para compilar smart contracts)

### Instalación
```bash
# Clonar el repositorio
git clone <YOUR_GIT_URL>
cd stellar-perpetual-glide

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Compilar Smart Contracts
```bash
cd src/contracts
cargo build --target wasm32-unknown-unknown --release
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/perpetual_futures.wasm
```

### Desplegar en Testnet
```bash
cd src/contracts
./deploy-testnet.sh
```

## 🔧 Tecnologías Utilizadas

### Frontend
- **React 18** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **shadcn/ui** - Componentes de UI
- **StellarWalletsKit** - Integración de wallets

### Smart Contracts
- **Rust** - Lenguaje de programación
- **Soroban SDK** - SDK para contratos inteligentes
- **Stellar CLI** - Herramientas de deployment

### Integraciones
- **Reflector Oracle** - Precios en tiempo real (Testnet: datos de prueba, Mainnet: precios reales)
- **KALE Protocol** - Sistema de recompensas
- **Stellar Testnet** - Red de pruebas

## 📊 Estructura del Proyecto

```
src/
├── components/          # Componentes de React
│   ├── TradingDashboard.tsx
│   ├── ContractTester.tsx      # 🆕 Tester para contratos desplegados
│   ├── ReflectorOracle.tsx
│   ├── FundingRates.tsx
│   ├── KaleRewards.tsx
│   └── ui/             # Componentes de shadcn/ui
├── contracts/          # Smart contracts en Rust
│   ├── price-oracle-contract/  # 🆕 Contrato de precios
│   │   ├── src/lib.rs
│   │   ├── Cargo.toml
│   │   └── .cargo/config.toml
│   ├── perpetual-trading-contract/ # 🆕 Contrato de trading
│   │   ├── src/lib.rs
│   │   ├── Cargo.toml
│   │   └── .cargo/config.toml
│   ├── reflector.rs            # Interfaz de Reflector
│   ├── deploy-price-oracle.sh  # 🆕 Script de deployment
│   ├── deploy-trading-contract.sh # 🆕 Script de deployment
│   └── contract-config.json    # 🆕 Configuración de contratos
├── hooks/              # Custom React hooks
│   ├── use-wallet-simple.ts
│   ├── use-reflector-enhanced.ts # 🆕 Hook mejorado para Reflector
│   ├── use-trading-real.ts     # 🆕 Hook para trading real
│   └── use-network.ts
├── lib/                # Utilidades y clientes
│   ├── stellar.ts
│   ├── perpetual-contract-client.ts # 🆕 Cliente para trading
│   ├── reflector-enhanced-client.ts # 🆕 Cliente mejorado
│   └── utils.ts
└── pages/              # Páginas de la aplicación
    └── Index.tsx
```

## 🧪 Testing

### Probar Integración Completa
1. Ve a la pestaña **"Contract Tester"** en la aplicación
2. Conecta tu wallet de testnet
3. Verifica que todos los tests pasen:
   - ✅ Price Oracle Contract funcionando
   - ✅ Perpetual Trading Contract desplegado
   - ✅ Reflector Oracle integrado
   - ✅ Conexión de wallet
   - ✅ Depósito/retiro de XLM
   - ✅ Apertura/cierre de posiciones

### Probar Funciones del Contrato

#### Price Oracle Contract
```bash
# Obtener precio de XLM
stellar contract invoke --id CAYMTS6FAAYPCYUSMGRIIHSRBLTWB53EYPMANEV6UZMHE4VIBINF52TD --source-account testnet-wallet --network testnet -- get_xlm_price

# Obtener precio de BTC
stellar contract invoke --id CAYMTS6FAAYPCYUSMGRIIHSRBLTWB53EYPMANEV6UZMHE4VIBINF52TD --source-account testnet-wallet --network testnet -- get_btc_price

# Calcular funding rate
stellar contract invoke --id CAYMTS6FAAYPCYUSMGRIIHSRBLTWB53EYPMANEV6UZMHE4VIBINF52TD --source-account testnet-wallet --network testnet -- calculate_funding_rate --spot_price 1234000 --futures_price 1235000
```

#### Perpetual Trading Contract
```bash
# Obtener configuración del contrato
stellar contract invoke --id CBCKPEPZZ6H66555PB7ZR3YQNX2GBHR4VFP7NZIV4KZ36345YFZXEZE2 --source-account testnet-wallet --network testnet -- get_config

# Obtener balance del trader
stellar contract invoke --id CBCKPEPZZ6H66555PB7ZR3YQNX2GBHR4VFP7NZIV4KZ36345YFZXEZE2 --source-account testnet-wallet --network testnet -- get_trader_balance

# Obtener versión del contrato
stellar contract invoke --id CBCKPEPZZ6H66555PB7ZR3YQNX2GBHR4VFP7NZIV4KZ36345YFZXEZE2 --source-account testnet-wallet --network testnet -- version
```

### Usar Contract Tester en Frontend
```tsx
import { ContractTester } from '@/components/ContractTester';

// En tu componente
<ContractTester />
```

**Funcionalidades disponibles:**
- 💰 Depositar/retirar XLM
- 📈 Abrir posiciones long/short
- 📊 Cerrar posiciones
- 💳 Ver balance del trader
- ⚙️ Ver configuración del contrato
- 📈 Obtener precios de Reflector
- 📊 Ver posición actual

## 🔗 Enlaces Útiles

- **Stellar Docs**: https://developers.stellar.org/
- **Soroban Docs**: https://soroban.stellar.org/docs
- **Reflector Network**: https://reflector.network/
- **KALE Protocol**: https://kaleonstellar.com/
- **Stellar Explorer**: https://stellar.expert/
- **Testnet Explorer**: https://testnet.stellar.org/

## 📝 Notas de Deployment

### Transacciones Importantes
- **Deployment**: https://stellar.expert/explorer/testnet/tx/e522ecc5b22f1f01e5b2466023aaea66891e6ee7b539d978f50380d5c1137ffb
- **Inicialización**: Contrato inicializado con Reflector Oracle

### Cuenta de Deployment
- **Identidad**: `alice`
- **Red**: Testnet
- **Fondos**: Obtenidos via Friendbot

## 🚀 Próximos Pasos

1. **✅ Completado**: Desplegar contratos en testnet
2. **✅ Completado**: Crear clientes TypeScript para frontend
3. **✅ Completado**: Implementar Contract Tester
4. **🔄 En progreso**: Integrar Contract Tester en dashboard principal
5. **⏳ Pendiente**: Probar todas las funcionalidades de trading
6. **⏳ Pendiente**: Desplegar en mainnet
7. **⏳ Pendiente**: Implementar más activos y pares de trading
8. **⏳ Pendiente**: Agregar analytics y métricas
9. **⏳ Pendiente**: Implementar sistema de liquidación
10. **⏳ Pendiente**: Optimizar gas fees y rendimiento

---

