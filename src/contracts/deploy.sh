#!/bin/bash

# Script para desplegar el contrato de Perpetual Futures
# Asegúrate de tener Stellar CLI instalado y configurado

echo "🚀 Desplegando contrato de Perpetual Futures..."

# Verificar que Stellar CLI esté instalado
if ! command -v stellar &> /dev/null; then
    echo "❌ Stellar CLI no está instalado. Instálalo desde: https://github.com/stellar/stellar-cli"
    exit 1
fi

# Verificar que el archivo .env existe
if [ ! -f .env ]; then
    echo "❌ Archivo .env no encontrado. Copia contract-config.example a .env y configura las variables."
    exit 1
fi

# Cargar variables de entorno
source .env

# Compilar el contrato
echo "📦 Compilando contrato..."
cargo build --target wasm32-unknown-unknown --release

# Desplegar el contrato
echo "🌐 Desplegando a la red Stellar..."
CONTRACT_ID=$(stellar contract deploy \
    --rpc-url $STELLAR_RPC_URL \
    --network-passphrase "$STELLAR_NETWORK_PASSPHRASE" \
    --source-account $WALLET_SECRET_KEY \
    target/wasm32-unknown-unknown/release/perpetual_futures.wasm)

echo "✅ Contrato desplegado con ID: $CONTRACT_ID"

# Inicializar el contrato con la dirección del oráculo
echo "🔧 Inicializando contrato con Reflector Oracle..."
stellar contract invoke \
    --rpc-url $STELLAR_RPC_URL \
    --network-passphrase "$STELLAR_NETWORK_PASSPHRASE" \
    --source-account $WALLET_SECRET_KEY \
    --contract $CONTRACT_ID \
    --method initialize \
    --args $REFLECTOR_ORACLE_CONTRACT_ID

echo "🎉 ¡Contrato desplegado e inicializado exitosamente!"
echo "📝 Contract ID: $CONTRACT_ID"
echo "🔗 Oracle Address: $REFLECTOR_ORACLE_CONTRACT_ID"
