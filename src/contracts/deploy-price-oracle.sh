#!/bin/bash

# Deploy Price Oracle Contract to Stellar Mainnet
# This contract gets real prices from Reflector Oracle

set -e

echo "🚀 Deploying Price Oracle Contract to Stellar Mainnet"
echo "=================================================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found"
    echo "Please create .env file with your configuration"
    exit 1
fi

# Load environment variables
source .env

# Check if Stellar CLI is installed
if ! command -v stellar &> /dev/null; then
    echo "❌ Error: Stellar CLI not found"
    echo "Please install Stellar CLI: https://github.com/stellar/stellar-cli"
    exit 1
fi

# Check if contract is compiled
if [ ! -f "price-oracle-contract/target/wasm32-unknown-unknown/release/price_oracle_contract.optimized.wasm" ]; then
    echo "❌ Error: Contract not compiled"
    echo "Please run: cd price-oracle-contract && cargo build --target wasm32-unknown-unknown --release"
    exit 1
fi

echo "📋 Configuration:"
echo "  Network: $STELLAR_NETWORK"
echo "  RPC URL: $STELLAR_RPC_URL"
echo "  Admin: $ADMIN_ADDRESS"
echo ""

# Confirm deployment
echo "⚠️  WARNING: This will deploy to MAINNET and cost real XLM!"
echo "Are you sure you want to continue? (yes/no)"
read -r confirmation

if [ "$confirmation" != "yes" ]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

echo ""
echo "🔧 Deploying Price Oracle contract..."

# Deploy the contract
echo "📤 Uploading contract to mainnet..."
DEPLOY_RESULT=$(stellar contract deploy \
    --wasm price-oracle-contract/target/wasm32-unknown-unknown/release/price_oracle_contract.optimized.wasm \
    --network mainnet \
    --source-account mainnet-wallet \
    --rpc-url "$STELLAR_RPC_URL" \
    --network-passphrase "$STELLAR_NETWORK_PASSPHRASE")

echo "Deploy result: $DEPLOY_RESULT"

# Extract contract ID from deploy result
CONTRACT_ID=$(echo "$DEPLOY_RESULT" | grep -o 'Contract ID: [A-Za-z0-9]*' | cut -d' ' -f3)

if [ -z "$CONTRACT_ID" ]; then
    echo "❌ Error: Could not extract contract ID from deploy result"
    exit 1
fi

echo "✅ Price Oracle Contract deployed successfully!"
echo "📄 Contract ID: $CONTRACT_ID"

# Initialize the contract with Reflector Oracle address
echo ""
echo "🔧 Initializing contract with Reflector Oracle..."
INIT_RESULT=$(stellar contract invoke \
    --id "$CONTRACT_ID" \
    --source-account mainnet-wallet \
    --network mainnet \
    --rpc-url "$STELLAR_RPC_URL" \
    --network-passphrase "$STELLAR_NETWORK_PASSPHRASE" \
    -- initialize \
    --reflector_address "CALI2BYU2JE6WVRUFYTS6MSBNEHGJ35P4AVCZYF3B6QOE3QKOB2PLE6M")

echo "Initialize result: $INIT_RESULT"

# Update .env with contract ID
echo ""
echo "📝 Updating .env file with Price Oracle Contract ID..."
sed -i.bak "s/PRICE_ORACLE_CONTRACT_ID=.*/PRICE_ORACLE_CONTRACT_ID=$CONTRACT_ID/" .env

echo "✅ Price Oracle Contract deployment complete!"
echo ""
echo "📋 Summary:"
echo "  Contract ID: $CONTRACT_ID"
echo "  Network: Mainnet"
echo "  Reflector Oracle: CALI2BYU2JE6WVRUFYTS6MSBNEHGJ35P4AVCZYF3B6QOE3QKOB2PLE6M"
echo ""
echo "🎉 Your Price Oracle contract is now live on Stellar Mainnet!"
echo ""
echo "Available functions:"
echo "  - get_xlm_price() - Get XLM price from Reflector"
echo "  - get_btc_price() - Get BTC price from Reflector"
echo "  - get_eth_price() - Get ETH price from Reflector"
echo "  - get_xlm_twap(records) - Get TWAP for XLM"
echo "  - is_price_fresh() - Check if price is fresh"
echo "  - calculate_funding_rate(spot, futures) - Calculate funding rate"
