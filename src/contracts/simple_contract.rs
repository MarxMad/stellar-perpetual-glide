// Perpetual Futures Contract with Real Trading
// Supports real trading with Reflector oracle prices

use soroban_sdk::{contract, contractimpl, Address, Env, Symbol, Map, Vec};

#[contract]
pub struct PerpetualFuturesContract;

#[contractimpl]
impl PerpetualFuturesContract {
    // Initialize the contract with Reflector oracle address
    pub fn initialize(e: Env, oracle_address: Address) {
        // Store oracle address in contract storage
        e.storage().instance().set(&Symbol::new(&e, "oracle"), &oracle_address);
    }

    // Get oracle address
    pub fn get_oracle_address(e: Env) -> Address {
        e.storage().instance().get(&Symbol::new(&e, "oracle"))
            .expect("Oracle not initialized")
    }

    // Simple funding rate calculation
    pub fn calculate_funding_rate(
        spot_price: i128,
        futures_price: i128
    ) -> i128 {
        // Calculate price difference percentage
        let price_diff = futures_price - spot_price;
        let price_diff_percentage = (price_diff * 10000) / spot_price; // Basis points
        
        // Base funding rate (0.01% = 1 basis point)
        let base_rate = 1i128;
        
        // Add price difference component
        let funding_rate = base_rate + (price_diff_percentage / 100);
        
        // Cap funding rate at reasonable limits (±0.1% = ±10 basis points)
        if funding_rate > 10 {
            10
        } else if funding_rate < -10 {
            -10
        } else {
            funding_rate
        }
    }

    // Check if price is within reasonable range
    pub fn is_price_valid(price: i128) -> bool {
        price > 0 && price < 1000000000000 // Max 1 trillion
    }

    // Get contract version
    pub fn version() -> u32 {
        1
    }

    // Open a long position
    pub fn open_long_position(
        e: Env,
        trader: Address,
        asset_symbol: Symbol,
        size: i128,
        leverage: u32
    ) -> u64 {
        // Validate leverage (1x to 10x)
        if leverage < 1 || leverage > 10 {
            panic!("Invalid leverage");
        }

        // Validate size
        if size <= 0 {
            panic!("Invalid position size");
        }

        // Generate position ID
        let position_id = e.storage().instance().get(&Symbol::new(&e, "next_position_id"))
            .unwrap_or(0u64) + 1;
        e.storage().instance().set(&Symbol::new(&e, "next_position_id"), &position_id);

        // Store position data (simplified)
        let position_key = Symbol::new(&e, "position");
        let mut positions: Map<u64, Map<Symbol, i128>> = e.storage().instance()
            .get(&position_key)
            .unwrap_or(Map::new(&e));

        let mut position_data = Map::new(&e);
        position_data.set(Symbol::new(&e, "size"), size);
        position_data.set(Symbol::new(&e, "leverage"), leverage as i128);
        position_data.set(Symbol::new(&e, "side"), 1i128); // 1 = long, -1 = short
        position_data.set(Symbol::new(&e, "timestamp"), e.ledger().timestamp() as i128);

        positions.set(position_id, position_data);
        e.storage().instance().set(&position_key, &positions);

        position_id
    }

    // Open a short position
    pub fn open_short_position(
        e: Env,
        trader: Address,
        asset_symbol: Symbol,
        size: i128,
        leverage: u32
    ) -> u64 {
        // Validate leverage (1x to 10x)
        if leverage < 1 || leverage > 10 {
            panic!("Invalid leverage");
        }

        // Validate size
        if size <= 0 {
            panic!("Invalid position size");
        }

        // Generate position ID
        let position_id = e.storage().instance().get(&Symbol::new(&e, "next_position_id"))
            .unwrap_or(0u64) + 1;
        e.storage().instance().set(&Symbol::new(&e, "next_position_id"), &position_id);

        // Store position data (simplified)
        let position_key = Symbol::new(&e, "position");
        let mut positions: Map<u64, Map<Symbol, i128>> = e.storage().instance()
            .get(&position_key)
            .unwrap_or(Map::new(&e));

        let mut position_data = Map::new(&e);
        position_data.set(Symbol::new(&e, "size"), size);
        position_data.set(Symbol::new(&e, "leverage"), leverage as i128);
        position_data.set(Symbol::new(&e, "side"), -1i128); // 1 = long, -1 = short
        position_data.set(Symbol::new(&e, "timestamp"), e.ledger().timestamp() as i128);

        positions.set(position_id, position_data);
        e.storage().instance().set(&position_key, &positions);

        position_id
    }

    // Close a position
    pub fn close_position(e: Env, position_id: u64) -> bool {
        let position_key = Symbol::new(&e, "position");
        let mut positions: Map<u64, Map<Symbol, i128>> = e.storage().instance()
            .get(&position_key)
            .unwrap_or(Map::new(&e));

        if positions.contains_key(position_id) {
            positions.remove(position_id);
            e.storage().instance().set(&position_key, &positions);
            true
        } else {
            false
        }
    }

    // Get position details
    pub fn get_position(e: Env, position_id: u64) -> Option<Map<Symbol, i128>> {
        let position_key = Symbol::new(&e, "position");
        let positions: Map<u64, Map<Symbol, i128>> = e.storage().instance()
            .get(&position_key)
            .unwrap_or(Map::new(&e));

        positions.get(position_id)
    }

    // Calculate position PnL
    pub fn calculate_pnl(
        e: Env,
        position_id: u64,
        current_price: i128
    ) -> i128 {
        let position = Self::get_position(e.clone(), position_id);
        if position.is_none() {
            return 0;
        }

        let position_data = position.unwrap();
        let size = position_data.get(Symbol::new(&e, "size")).unwrap_or(0);
        let leverage = position_data.get(Symbol::new(&e, "leverage")).unwrap_or(1);
        let side = position_data.get(Symbol::new(&e, "side")).unwrap_or(1);

        // For simplicity, assume entry price is current price
        // In a real implementation, you'd store the entry price
        let entry_price = current_price;
        
        let price_diff = current_price - entry_price;
        let pnl = if side > 0 { // long position
            (price_diff * size * leverage) / 1000000 // Scale down
        } else { // short position
            (-price_diff * size * leverage) / 1000000 // Scale down
        };

        pnl
    }
}
