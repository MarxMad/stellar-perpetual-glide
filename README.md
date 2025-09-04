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

### 🎯 Perpetual Futures Contract (Nuestro Contrato)
- **Contract ID**: `CAIYZITU25T7GBSKO6WZWOTN72U4EB4FWFRJKP56ASWCE6QN7HIRQG5R`
- **Red**: Stellar Testnet
- **Estado**: ✅ Activo y funcionando
- **Explorer**: https://stellar.expert/explorer/testnet/contract/CAIYZITU25T7GBSKO6WZWOTN72U4EB4FWFRJKP56ASWCE6QN7HIRQG5R
- **Funciones**:
  - `initialize(oracle_address)` - Inicializar con Reflector Oracle
  - `get_oracle_address()` - Obtener dirección del oráculo
  - `calculate_funding_rate(spot_price, futures_price)` - Calcular funding rate
  - `is_price_valid(price)` - Validar precio
  - `version()` - Obtener versión del contrato

### 🔮 Reflector Oracle Contract
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
│   ├── ReflectorOracle.tsx
│   ├── FundingRates.tsx
│   ├── KaleRewards.tsx
│   └── ui/             # Componentes de shadcn/ui
├── contracts/          # Smart contracts en Rust
│   ├── lib.rs
│   ├── simple_contract.rs
│   ├── reflector.rs
│   └── deploy-testnet.sh
├── hooks/              # Custom React hooks
│   ├── use-wallet-simple.ts
│   └── use-stellar-services.ts
├── lib/                # Utilidades y clientes
│   ├── stellar.ts
│   ├── reflector-client.ts
│   ├── perpetual-contract-client.ts
│   ├── reflector.ts
│   └── kale.ts
└── pages/              # Páginas de la aplicación
    └── Index.tsx
```

## 🧪 Testing

### Probar Integración Completa
1. Ve a la pestaña **"Test"** en la aplicación
2. Haz clic en **"Ejecutar Pruebas"**
3. Verifica que todos los tests pasen:
   - ✅ Reflector Oracle funcionando
   - ✅ Nuestro contrato desplegado
   - ✅ Cálculo de funding rates
   - ✅ Conexión de wallet

### Probar Funciones del Contrato
```bash
# Obtener información del contrato
stellar contract invoke --id CAIYZITU25T7GBSKO6WZWOTN72U4EB4FWFRJKP56ASWCE6QN7HIRQG5R --source-account alice --network testnet -- get_oracle_address

# Calcular funding rate
stellar contract invoke --id CAIYZITU25T7GBSKO6WZWOTN72U4EB4FWFRJKP56ASWCE6QN7HIRQG5R --source-account alice --network testnet -- calculate_funding_rate --spot_price 1234000 --futures_price 1235000
```

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

1. **Implementar más funciones** en el smart contract
2. **Agregar validaciones** de seguridad adicionales
3. **Optimizar gas fees** y rendimiento
4. **Preparar para Mainnet** deployment
5. **Implementar más activos** y pares de trading
6. **Agregar analytics** y métricas

---

