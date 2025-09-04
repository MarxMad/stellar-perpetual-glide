#!/bin/bash

# Script para desplegar el contrato de Perpetual Futures en Testnet
# Basado en la documentación oficial de Stellar

echo "🚀 Desplegando contrato de Perpetual Futures en Testnet..."

# Verificar que Stellar CLI esté instalado
if ! command -v stellar &> /dev/null; then
    echo "❌ Stellar CLI no está instalado. Instálalo desde: https://github.com/stellar/stellar-cli"
    exit 1
fi

# Verificar que el archivo WASM existe
WASM_FILE="target/wasm32-unknown-unknown/release/perpetual_futures.optimized.wasm"
if [ ! -f "$WASM_FILE" ]; then
    echo "❌ Archivo WASM no encontrado. Compilando primero..."
    cargo build --target wasm32-unknown-unknown --release
    stellar contract optimize --wasm target/wasm32-unknown-unknown/release/perpetual_futures.wasm
fi

# Configuración para Testnet
RPC_URL="https://soroban-testnet.stellar.org"
NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
REFLECTOR_ORACLE_ID="CAFJZQWSED6YAWZU3GWRTOCNPPCGBN32L7QV43XX5LZLFTK6JLN34DLN"

echo "📦 Desplegando contrato a Testnet..."
echo "🔗 RPC URL: $RPC_URL"
echo "🌐 Network: Testnet"

# Desplegar el contrato
echo "⏳ Desplegando contrato (esto puede tomar unos minutos)..."
CONTRACT_ID=$(stellar contract deploy \
    --wasm "$WASM_FILE" \
    --source-account alice \
    --rpc-url "$RPC_URL" \
    --network-passphrase "$NETWORK_PASSPHRASE" \
    --alias perpetual_futures)

if [ $? -eq 0 ]; then
    echo "✅ Contrato desplegado exitosamente!"
    echo "📝 Contract ID: $CONTRACT_ID"
    
    # Inicializar el contrato con la dirección del oráculo
    echo "🔧 Inicializando contrato con Reflector Oracle..."
    stellar contract invoke \
        --id "$CONTRACT_ID" \
        --source-account alice \
        --rpc-url "$RPC_URL" \
        --network-passphrase "$NETWORK_PASSPHRASE" \
        -- \
        initialize \
        --oracle_address "$REFLECTOR_ORACLE_ID"
    
    if [ $? -eq 0 ]; then
        echo "🎉 ¡Contrato desplegado e inicializado exitosamente!"
        echo ""
        echo "📋 Información del Deployment:"
        echo "   Contract ID: $CONTRACT_ID"
        echo "   Oracle Address: $REFLECTOR_ORACLE_ID"
        echo "   Network: Testnet"
        echo "   RPC URL: $RPC_URL"
        echo ""
        echo "🔗 Puedes verificar el contrato en:"
        echo "   https://testnet.stellar.org/transactions/$CONTRACT_ID"
        echo ""
        echo "📝 Para usar en tu frontend, actualiza:"
        echo "   REFLECTOR_CONFIG.contractId = '$CONTRACT_ID'"
    else
        echo "❌ Error al inicializar el contrato"
        exit 1
    fi
else
    echo "❌ Error al desplegar el contrato"
    exit 1
fi
