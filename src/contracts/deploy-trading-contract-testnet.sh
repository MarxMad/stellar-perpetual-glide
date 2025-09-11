#!/bin/bash

# Deploy Perpetual Trading Contract to Stellar Testnet
# This contract handles real XLM trading with leverage

set -e

echo "🚀 Deploying Perpetual Trading Contract to Stellar Testnet"
echo "=================================================="

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

echo "📋 Configuration:"
echo "  Network: Testnet"
echo "  RPC URL: https://soroban-testnet.stellar.org"
echo "  Network Passphrase: Test SDF Network ; September 2015"
echo ""

echo "🔧 Deploying Perpetual Trading contract..."

# Deploy the contract
echo "📤 Uploading contract to testnet..."
DEPLOY_RESULT=$(stellar contract deploy \
    --wasm perpetual-trading-contract/target/wasm32-unknown-unknown/release/perpetual_trading_contract.optimized.wasm \
    --network testnet \
    --source-account testnet-wallet \
    --rpc-url "https://soroban-testnet.stellar.org" \
    --network-passphrase "Test SDF Network ; September 2015")

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
    --source-account testnet-wallet \
    --network testnet \
    --rpc-url "https://soroban-testnet.stellar.org" \
    --network-passphrase "Test SDF Network ; September 2015" \
    -- initialize \
    --admin "GB4UZ6VHOD6ZDCBHJPI3OSFHBXTFTD75YNVLO3YT7PLC3RZANKFROEMZ" \
    --price_oracle "CAYMTS6FAAYPCYUSMGRIIHSRBLTWB53EYPMANEV6UZMHE4VIBINF52TD")

echo "Initialize result: $INIT_RESULT"

echo "✅ Perpetual Trading Contract deployment complete!"
echo ""
echo "📋 Summary:"
echo "  Contract ID: $CONTRACT_ID"
echo "  Network: Testnet"
echo "  Admin: GB4UZ6VHOD6ZDCBHJPI3OSFHBXTFTD75YNVLO3YT7PLC3RZANKFROEMZ"
echo "  Price Oracle: CAYMTS6FAAYPCYUSMGRIIHSRBLTWB53EYPMANEV6UZMHE4VIBINF52TD"
echo ""
echo "🎉 Your Perpetual Trading contract is now live on Stellar Testnet!"
echo ""
echo "Available functions:"
echo "  - open_position(trader, margin, leverage, is_long) - Open leveraged position with XLM transfer"
echo "  - close_position(trader, position_id) - Close position and return XLM + PnL"
echo "  - get_current_position() - Get current position details"
echo "  - get_contract_stats() - Get contract statistics"
echo "  - get_contract_balance() - Get contract balance"
echo "  - withdraw_contract_balance(admin, amount) - Withdraw XLM from contract (admin only)"
echo ""
echo "🔗 View on Stellar Expert:"
echo "  https://stellar.expert/explorer/testnet/contract/$CONTRACT_ID"
