#!/bin/bash

# Deploy Perpetual Futures Contract to Stellar Mainnet
# This script deploys a functional contract with real XLM transfers

set -e

echo "🚀 Deploying Perpetual Futures Contract to Stellar Mainnet"
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
if [ ! -f "my-awesome-contract/target/wasm32-unknown-unknown/release/my_awesome_contract.optimized.wasm" ]; then
    echo "❌ Error: Contract not compiled"
    echo "Please run: cd my-awesome-contract && cargo build --target wasm32-unknown-unknown --release"
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
echo "🔧 Deploying contract..."

# Deploy the contract
echo "📤 Uploading contract to mainnet..."
DEPLOY_RESULT=$(stellar contract deploy \
    --wasm my-awesome-contract/target/wasm32-unknown-unknown/release/my_awesome_contract.optimized.wasm \
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

echo "✅ Contract deployed successfully!"
echo "📄 Contract ID: $CONTRACT_ID"

# Initialize the contract (no initialization needed for my-awesome-contract)
echo ""
echo "🔧 Contract deployed successfully (no initialization required)"

# Update .env with contract ID
echo ""
echo "📝 Updating .env file with contract ID..."
sed -i.bak "s/PERPETUAL_CONTRACT_ID=.*/PERPETUAL_CONTRACT_ID=$CONTRACT_ID/" .env

echo "✅ Contract deployment complete!"
echo ""
echo "📋 Summary:"
echo "  Contract ID: $CONTRACT_ID"
echo "  Network: Mainnet"
echo "  Admin: $ADMIN_ADDRESS"
echo ""
echo "🎉 Your perpetual futures contract is now live on Stellar Mainnet!"
echo ""
echo "Next steps:"
echo "  1. Update your frontend with the contract ID: $CONTRACT_ID"
echo "  2. Test lets_rock() function"
echo "  3. Test get_xlm_price() function"
echo "  4. Test calculate_trade_value() function"
echo "  5. Integrate with Reflector Oracle for real prices"
echo ""
echo "Demo functions available:"
echo "  - lets_rock() - Demo function with Reflector integration"
echo "  - get_xlm_price() - Get XLM price from Reflector"
echo "  - calculate_trade_value(amount, is_buy) - Calculate trade value"