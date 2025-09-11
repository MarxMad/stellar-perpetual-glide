# Integración de Stellar: Reflector y KALE

Esta plataforma de perpetuos en Stellar integra dos proyectos clave del ecosistema:

## 🟢 Reflector - Oracle de Precios

### Descripción
Reflector es un oráculo push-based nativo de Stellar que proporciona feeds de precios para:
- Activos clásicos
- Tasas FX
- CEXs/DEXs

### Características Implementadas
- **Monitoreo en Tiempo Real**: Precios actualizados cada 5 segundos
- **Múltiples Activos**: XLM, BTC, ETH, SOL, ADA, USDC
- **Indicadores de Confianza**: Nivel de confianza del oráculo
- **Estado del Sistema**: Monitoreo del estado operativo

### Uso en la Plataforma
- Precios para cálculo de funding rates
- Referencia para trades de perpetuos
- Monitoreo de volatilidad del mercado

## 🟡 KALE - Sistema de Recompensas

### Descripción
KALE es un token de prueba de trabajo en equipo donde los participantes:
- Hacen stake de tokens
- Completan tareas
- Cosechan recompensas

### Características Implementadas
- **Staking**: Stake/unstake de tokens KALE
- **Sistema de Tareas**: Tareas diarias y por volumen
- **Recompensas**: Harvest automático de recompensas
- **Leaderboard**: Ranking de usuarios por contribuciones
- **Sistema de Niveles**: Progresión basada en actividad

### Tipos de Tareas
1. **Daily Login** - Conectarse diariamente (5 KALE)
2. **Trade Completion** - Completar 5 trades (15 KALE)
3. **Volume Milestone** - Alcanzar $1000 en volumen (25 KALE)
4. **Referral Bonus** - Invitar usuarios nuevos (20 KALE)

## 🔧 Implementación Técnica

### Arquitectura
```
src/
├── lib/
│   ├── stellar.ts          # Configuración de Stellar/Soroban
│   ├── reflector.ts        # Servicio del oráculo Reflector
│   └── kale.ts            # Servicio del sistema KALE
├── hooks/
│   └── use-stellar-services.ts  # Hook principal para servicios
└── components/
    ├── ReflectorOracle.tsx      # UI del oráculo
    ├── KaleRewards.tsx          # UI de recompensas
    └── FundingRates.tsx         # Calculadora de funding rates
```

### Dependencias
- `@stellar/stellar-sdk`: SDK oficial de Stellar
- `soroban-client`: Cliente para contratos inteligentes
- React + TypeScript para la interfaz

### Configuración
- **Testnet**: Para desarrollo y pruebas
- **Mainnet**: Para producción (cuando esté disponible)
- URLs configurables para Horizon y Soroban RPC

## 📊 Funding Rates Dinámicos

### Cálculo
Los funding rates se calculan usando la fórmula:
```
Funding Rate = Base Rate + (Price Difference × 0.1) + (Volatility × 0.001)
```

Donde:
- **Base Rate**: 0.01% mínimo
- **Price Difference**: Diferencia entre precios spot y futures
- **Volatility**: Ajuste por volatilidad del mercado

### Frecuencia
- Se aplican cada 8 horas (00:00, 08:00, 16:00 UTC)
- Actualización automática de precios desde Reflector
- Cálculo en tiempo real

## 🚀 Uso de la Plataforma

### 1. Trading (Tab Principal)
- Gráficos de precios en tiempo real
- Order book y formularios de trading
- Gestión de posiciones

### 2. Oracle (Tab Reflector)
- Monitoreo de precios de activos
- Estado del oráculo
- Feeds disponibles

### 3. Funding (Tab Funding Rates)
- Calculadora de funding rates
- Configuración de parámetros
- Resultados en tiempo real

### 4. Rewards (Tab KALE)
- Sistema de staking
- Completar tareas
- Ver estadísticas y ranking

## 🔐 Seguridad y Consideraciones

### Testnet vs Mainnet
- **Desarrollo**: Usar testnet para pruebas
- **Producción**: Cambiar a mainnet cuando esté disponible
- **Contratos**: Verificar IDs de contratos en cada red

### Manejo de Errores
- Validación de inputs
- Manejo de fallos de red
- Fallbacks para datos del oráculo

### Privacidad
- No se almacenan claves privadas
- Conexión a wallet externa
- Transacciones firmadas por el usuario

## 📈 Roadmap

### Fase 1 (Actual)
- ✅ Integración básica de Reflector
- ✅ Sistema de recompensas KALE
- ✅ Calculadora de funding rates
- ✅ UI responsive

### Fase 2 (Próxima)
- 🔄 Integración real con contratos
- 🔄 Wallet connection con Stellar
- 🔄 Transacciones reales
- 🔄 Más pares de trading

### Fase 3 (Futura)
- 📋 Integración con más oráculos
- 📋 Sistema de liquidaciones
- 📋 Trading algorítmico
- 📋 Mobile app

## 🆘 Soporte y Recursos

### Documentación
- [Reflector Network](https://reflector.network/docs)
- [KALE on Stellar](https://kaleonstellar.com/)
- [Stellar Documentation](https://developers.stellar.org/)

### Comunidad
- [Reflector Discord](https://discord.gg/2tWP5SX9dh)
- [KALE Telegram](https://t.me/kaleonstellar)
- [Stellar Community](https://community.stellar.org/)

### Código Fuente
- [Reflector GitHub](https://github.com/reflector-network)
- [KALE GitHub](https://github.com/kalepail/KALE-sc)

## 🤝 Contribuciones

Para contribuir al proyecto:

1. Fork del repositorio
2. Crear rama para feature
3. Implementar cambios
4. Crear pull request
5. Revisión y merge

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

---

**Nota**: Esta implementación está en desarrollo y puede contener funcionalidades simuladas para demostración. Para uso en producción, verificar la integración real con los contratos de Stellar.
