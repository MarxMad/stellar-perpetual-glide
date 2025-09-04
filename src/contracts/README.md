# Perpetual Futures Smart Contract

Este contrato inteligente implementa una plataforma de trading de futuros perpetuos en Stellar usando Reflector como oráculo de precios.

## 🏗️ Arquitectura

### Componentes principales:

1. **Reflector Oracle Interface** (`reflector.rs`)
   - Interfaz para interactuar con el contrato de Reflector
   - Implementa el estándar SEP-40 de Stellar
   - Proporciona acceso a precios on-chain

2. **Perpetual Futures Contract** (`perpetual_contract.rs`)
   - Contrato principal para trading de futuros
   - Calcula funding rates dinámicos
   - Integra con Reflector para precios en tiempo real

## 🚀 Deployment

### Prerrequisitos:

1. **Stellar CLI**: Instalar desde [GitHub](https://github.com/stellar/stellar-cli)
2. **Rust**: Versión 1.70+ con target `wasm32-unknown-unknown`
3. **Wallet**: Cuenta de Stellar con fondos para deployment

### Pasos de deployment:

1. **Configurar variables de entorno:**
   ```bash
   cp contract-config.example .env
   # Editar .env con tus configuraciones
   ```

2. **Compilar el contrato:**
   ```bash
   cargo build --target wasm32-unknown-unknown --release
   ```

3. **Desplegar:**
   ```bash
   ./deploy.sh
   ```

## 📊 Funcionalidades

### Métodos principales:

- `initialize(oracle_address)`: Inicializa el contrato con la dirección del oráculo
- `get_asset_price(asset_symbol)`: Obtiene el precio más reciente de un activo
- `calculate_funding_rate(base, quote, spot, futures)`: Calcula funding rate dinámico
- `get_twap_price(asset, records)`: Obtiene precio promedio ponderado por tiempo
- `get_cross_price(base, quote)`: Obtiene precio cruzado entre dos activos
- `is_price_fresh(asset)`: Verifica si el precio está actualizado
- `get_available_assets()`: Lista todos los activos disponibles
- `get_oracle_info()`: Obtiene información del oráculo

### Ejemplo de uso:

```rust
// Obtener precio de BTC
let btc_price = contract.get_asset_price("BTC".to_string());

// Calcular funding rate
let funding_rate = contract.calculate_funding_rate(
    "XLM".to_string(),
    "USDC".to_string(),
    1234000, // spot price en micro-units
    1235000  // futures price en micro-units
);

// Obtener TWAP de 5 períodos
let twap = contract.get_twap_price("XLM".to_string(), 5);
```

## 🔗 Integración con Frontend

El frontend puede interactuar con el contrato usando:

1. **Stellar SDK**: Para llamadas directas al contrato
2. **StellarWalletsKit**: Para firmar transacciones
3. **Soroban RPC**: Para consultas de estado

### Ejemplo de integración:

```typescript
import { Contract, SorobanRpc } from '@stellar/stellar-sdk';

const contract = new Contract(CONTRACT_ID);
const rpc = new SorobanRpc.Server(RPC_URL);

// Obtener precio
const price = await contract.call('get_asset_price', 'XLM');

// Calcular funding rate
const fundingRate = await contract.call('calculate_funding_rate', 
  'XLM', 'USDC', spotPrice, futuresPrice);
```

## 🛡️ Seguridad

### Mejores prácticas implementadas:

- ✅ Verificación de precios frescos (máximo 5 minutos)
- ✅ Límites en funding rates (±0.1%)
- ✅ Validación de datos del oráculo
- ✅ Manejo de errores robusto
- ✅ Prevención de overflow en cálculos

### Consideraciones de seguridad:

- 🔒 Siempre verificar que los precios estén actualizados
- 🔒 Implementar límites de tiempo para operaciones críticas
- 🔒 Usar múltiples oráculos para casos críticos
- 🔒 Validar permisos de usuario antes de operaciones

## 📈 Ventajas sobre API HTTP

### Smart Contract vs API HTTP:

| Característica | Smart Contract | API HTTP |
|----------------|----------------|----------|
| **On-chain** | ✅ Sí | ❌ No |
| **Verificación** | ✅ Consenso de nodos | ❌ Confianza en servidor |
| **Integración** | ✅ Nativa con Stellar | ❌ Externa |
| **Disponibilidad** | ✅ 24/7 descentralizada | ❌ Dependiente de servidor |
| **Transparencia** | ✅ Pública y verificable | ❌ Opaca |
| **Costos** | ✅ Solo gas fees | ❌ Límites de API |

## 🔄 Próximos pasos

1. **Testing**: Implementar tests unitarios y de integración
2. **Auditoría**: Revisión de seguridad del código
3. **Optimización**: Mejorar eficiencia de gas
4. **UI/UX**: Integrar completamente con el frontend
5. **Documentación**: Ampliar ejemplos y casos de uso

## 📞 Soporte

- **Discord**: [Reflector Community](https://discord.gg/2tWP5SX9dh)
- **Documentación**: [Reflector Docs](https://reflector.network/docs)
- **GitHub**: [Reflector Network](https://github.com/reflector-network)
