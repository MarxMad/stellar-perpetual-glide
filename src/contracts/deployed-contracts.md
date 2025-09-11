# Contratos Desplegados - Stellar Perpetual Trading Platform

## Testnet (Stellar Testnet)

### 1. Price Oracle Contract
- **Contract ID:** `CAYMTS6FAAYPCYUSMGRIIHSRBLTWB53EYPMANEV6UZMHE4VIBINF52TD`
- **Función:** Obtener precios en tiempo real desde Reflector Oracle
- **Network:** Testnet
- **RPC:** `https://soroban-testnet.stellar.org`
- **Passphrase:** `Test SDF Network ; September 2015`
- **Status:** ✅ Desplegado
- **Fecha:** 10 de Septiembre, 2025

### 2. Perpetual Trading Contract (MODIFICADO)
- **Contract ID:** `CAPQ332GONME6T2EKRWQG4PEASJL6362KSFU33W7U4EEMOZC5CK6MNAI`
- **Función:** Trading de perpetuos con transferencias directas de XLM
- **Network:** Testnet
- **RPC:** `https://soroban-testnet.stellar.org`
- **Passphrase:** `Test SDF Network ; September 2015`
- **Status:** ✅ Desplegado e Inicializado
- **Fecha:** 10 de Septiembre, 2025
- **Características:**
  - ✅ Transferencias directas de XLM (sin deposit_xlm)
  - ✅ open_position transfiere XLM real del usuario
  - ✅ close_position devuelve XLM + PnL real
  - ✅ withdraw_contract_balance para admin
  - ✅ get_contract_balance para ver balance del contrato

## Mainnet (Stellar Mainnet)

### 1. Price Oracle Contract
- **Contract ID:** `PENDIENTE`
- **Status:** ⏳ Por desplegar

### 2. Perpetual Trading Contract
- **Contract ID:** `PENDIENTE`
- **Status:** ⏳ Por desplegar

## Información de Wallets

### Testnet Wallet
- **Public Key:** `GB4UZ6VHOD6ZDCBHJPI3OSFHBXTFTD75YNVLO3YT7PLC3RZANKFROEMZ`
- **Alias:** `testnet-wallet`
- **Status:** ✅ Fondeada

### Mainnet Wallet
- **Public Key:** `GCUPLN5Y2N4UNZ76WZLDMVA2MUGWAOWCVPRBU4AJKJFXZLLJCCXI256P`
- **Alias:** `mainnet-wallet`
- **Balance:** 12.0000000 XLM
- **Status:** ✅ Fondeada

## Próximos Pasos

1. ✅ Desplegar contratos en testnet
2. ⏳ Probar funcionalidad de contratos
3. ⏳ Crear clientes TypeScript
4. ⏳ Integrar con frontend
5. ⏳ Desplegar en mainnet
6. ⏳ Configurar Reflector Oracle en mainnet
