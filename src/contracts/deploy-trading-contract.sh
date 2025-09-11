#!/bin/bash

# Deploy Perpetual Trading Contract to Stellar Mainnet
# This contract handles real XLM trading with leverage

set -e

echo "🚀 Deploying Perpetual Trading Contract to Stellar Mainnet"
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
if [ ! -f "perpetual-trading-contract/target/wasm32-unknown-unknown/release/perpetual_trading_contract.optimized.wasm" ]; then
    echo "❌ Error: Contract not compiled"
    echo "Please run: cd perpetual-trading-contract && cargo build --target wasm32-unknown-unknown --release"
    exit 1
fi

# Check if Price Oracle Contract ID is set
if [ -z "$PRICE_ORACLE_CONTRACT_ID" ]; then
    echo "❌ Error: PRICE_ORACLE_CONTRACT_ID not set in .env"
    echo "Please deploy Price Oracle Contract first"
    exit 1
fi

echo "📋 Configuration:"
echo "  Network: $STELLAR_NETWORK"
echo "  RPC URL: $STELLAR_RPC_URL"
echo "  Admin: $ADMIN_ADDRESS"
echo "  Price Oracle: $PRICE_ORACLE_CONTRACT_ID"
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
echo "🔧 Deploying Perpetual Trading contract..."

# Deploy the contract
echo "📤 Uploading contract to mainnet..."
DEPLOY_RESULT=$(stellar contract deploy \
    --wasm perpetual-trading-contract/target/wasm32-unknown-unknown/release/perpetual_trading_contract.optimized.wasm \
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

echo "✅ Perpetual Trading Contract deployed successfully!"
echo "📄 Contract ID: $CONTRACT_ID"

# Initialize the contract with admin and price oracle
echo ""
echo "🔧 Initializing contract with admin and price oracle..."
INIT_RESULT=$(stellar contract invoke \
    --id "$CONTRACT_ID" \
    --source-account mainnet-wallet \
    --network mainnet \
    --rpc-url "$STELLAR_RPC_URL" \
    --network-passphrase "$STELLAR_NETWORK_PASSPHRASE" \
    -- initialize \
    --admin "$ADMIN_ADDRESS" \
    --price_oracle "$PRICE_ORACLE_CONTRACT_ID")

echo "Initialize result: $INIT_RESULT"

# Update .env with contract ID
echo ""
echo "📝 Updating .env file with Trading Contract ID..."
sed -i.bak "s/TRADING_CONTRACT_ID=.*/TRADING_CONTRACT_ID=$CONTRACT_ID/" .env

echo "✅ Perpetual Trading Contract deployment complete!"
echo ""
echo "📋 Summary:"
echo "  Contract ID: $CONTRACT_ID"
echo "  Network: Mainnet"
echo "  Admin: $ADMIN_ADDRESS"
echo "  Price Oracle: $PRICE_ORACLE_CONTRACT_ID"
echo ""
echo "🎉 Your Perpetual Trading contract is now live on Stellar Mainnet!"
echo ""
echo "Available functions:"
echo "  - deposit_xlm(trader, amount) - Deposit XLM for margin"
echo "  - open_position(trader, margin, leverage, is_long) - Open leveraged position"
echo "  - close_position(trader, position_id) - Close position and calculate PnL"
echo "  - withdraw_xlm(trader, amount) - Withdraw XLM from contract"
echo "  - get_trader_balance(trader) - Get trader's balance"
echo "  - get_current_position() - Get current position details"
echo "  - get_contract_stats() - Get contract statistics"
