#![no_std]

use soroban_sdk::{contract, contractimpl, Address, Env, Symbol, Map, Vec};

#[contract]
pub struct PerpetualTradingContract;

#[contractimpl]
impl PerpetualTradingContract {
    // Initialize the contract
    pub fn initialize(e: Env, admin: Address, price_oracle: Address) {
        e.storage().instance().set(&Symbol::new(&e, "admin"), &admin);
        e.storage().instance().set(&Symbol::new(&e, "price_oracle"), &price_oracle);
        e.storage().instance().set(&Symbol::new(&e, "next_position_id"), &1u64);
        e.storage().instance().set(&Symbol::new(&e, "is_active"), &true);
        e.storage().instance().set(&Symbol::new(&e, "total_xlm_balance"), &0i128);
    }

    // Transfer XLM from user to contract (internal function)
    fn transfer_xlm_to_contract(e: &Env, from: &Address, amount: i128) {
        // This would need to be implemented with actual XLM transfers
        // For now, we'll simulate the transfer by updating balances
        // In a real implementation, this would use env.invoke_contract or similar
        
        // Update total contract balance (simulating XLM received)
        let total_balance: i128 = e.storage().instance()
            .get(&Symbol::new(e, "total_xlm_balance"))
            .unwrap_or(0);
        e.storage().instance().set(&Symbol::new(e, "total_xlm_balance"), &(total_balance + amount));
    }

    // Transfer XLM from contract to user (internal function)
    fn transfer_xlm_from_contract(e: &Env, to: &Address, amount: i128) {
        // This would need to be implemented with actual XLM transfers
        // For now, we'll simulate the transfer by updating balances
        // In a real implementation, this would use env.invoke_contract or similar
        
        // Update total contract balance (simulating XLM sent)
        let total_balance: i128 = e.storage().instance()
            .get(&Symbol::new(e, "total_xlm_balance"))
            .unwrap_or(0);
        e.storage().instance().set(&Symbol::new(e, "total_xlm_balance"), &(total_balance - amount));
    }

    // Open a leveraged position with direct XLM transfer
    pub fn open_position(
        e: Env,
        trader: Address,
        margin_amount: i128,
        leverage: u32,
        is_long: bool
    ) -> u64 {
        // Validate leverage (1x to 10x)
        if leverage < 1 || leverage > 10 {
            panic!("Invalid leverage (1-10x only)");
        }

        // Validate margin amount
        if margin_amount < 10_000_000 { // Minimum 1 XLM
            panic!("Minimum margin is 1 XLM");
        }

        // Transfer XLM from user to contract as margin
        Self::transfer_xlm_to_contract(&e, &trader, margin_amount);

        // Calculate position size
        let position_size = margin_amount * leverage as i128;

        // Get current price (mock for now)
        let current_price = Self::get_mock_price();

        // Generate position ID
        let position_id: u64 = e.storage().instance()
            .get(&Symbol::new(&e, "next_position_id"))
            .unwrap_or(0) + 1;
        e.storage().instance().set(&Symbol::new(&e, "next_position_id"), &position_id);

        // Store position data in simple storage
        e.storage().instance().set(&Symbol::new(&e, "current_trader"), &trader);
        e.storage().instance().set(&Symbol::new(&e, "current_margin"), &margin_amount);
        e.storage().instance().set(&Symbol::new(&e, "current_leverage"), &(leverage as i128));
        e.storage().instance().set(&Symbol::new(&e, "current_size"), &position_size);
        e.storage().instance().set(&Symbol::new(&e, "current_side"), &(if is_long { 1i128 } else { -1i128 }));
        e.storage().instance().set(&Symbol::new(&e, "current_entry_price"), &current_price);
        e.storage().instance().set(&Symbol::new(&e, "current_timestamp"), &(e.ledger().timestamp() as i128));
        e.storage().instance().set(&Symbol::new(&e, "current_is_active"), &1i128);

        // Update trader positions
        let trader_positions_key = Symbol::new(&e, "trader_positions");
        let mut trader_positions: Map<Address, Vec<u64>> = e.storage().instance()
            .get(&trader_positions_key)
            .unwrap_or(Map::new(&e));
        
        let mut positions_list = trader_positions.get(trader.clone()).unwrap_or(Vec::new(&e));
        positions_list.push_back(position_id);
        trader_positions.set(trader.clone(), positions_list);
        e.storage().instance().set(&trader_positions_key, &trader_positions);

        position_id
    }

    // Close a position and calculate PnL
    pub fn close_position(e: Env, trader: Address, _position_id: u64) -> i128 {
        // Check if position is active
        let is_active: i128 = e.storage().instance()
            .get(&Symbol::new(&e, "current_is_active"))
            .unwrap_or(0);
        
        if is_active == 0 {
            panic!("Position already closed");
        }

        // Verify trader owns this position
        let position_trader: Address = e.storage().instance()
            .get(&Symbol::new(&e, "current_trader"))
            .expect("No active position");
        
        if position_trader != trader {
            panic!("Unauthorized");
        }

        // Get position details
        let margin: i128 = e.storage().instance()
            .get(&Symbol::new(&e, "current_margin"))
            .unwrap_or(0);
        let leverage: i128 = e.storage().instance()
            .get(&Symbol::new(&e, "current_leverage"))
            .unwrap_or(1);
        let position_size: i128 = e.storage().instance()
            .get(&Symbol::new(&e, "current_size"))
            .unwrap_or(0);
        let side: i128 = e.storage().instance()
            .get(&Symbol::new(&e, "current_side"))
            .unwrap_or(1);
        let entry_price: i128 = e.storage().instance()
            .get(&Symbol::new(&e, "current_entry_price"))
            .unwrap_or(0);

        // Get current price (mock for now)
        let current_price = Self::get_mock_price();

        // Calculate PnL
        let price_diff = current_price - entry_price;
        let pnl = if side > 0 { // long position
            (price_diff * position_size) / entry_price
        } else { // short position
            (-price_diff * position_size) / entry_price
        };

        let total_payout = margin + pnl;

        // Mark position as closed
        e.storage().instance().set(&Symbol::new(&e, "current_is_active"), &0i128);
        e.storage().instance().set(&Symbol::new(&e, "current_close_price"), &current_price);
        e.storage().instance().set(&Symbol::new(&e, "current_close_timestamp"), &(e.ledger().timestamp() as i128));
        e.storage().instance().set(&Symbol::new(&e, "current_pnl"), &pnl);

        // Transfer XLM back to trader (margin + PnL)
        let payout_amount = if total_payout > 0 {
            total_payout
        } else {
            margin // Return at least the margin if PnL is negative
        };
        
        Self::transfer_xlm_from_contract(&e, &trader, payout_amount);

        pnl
    }

    // Withdraw XLM from contract (admin only)
    pub fn withdraw_contract_balance(e: Env, admin: Address, amount: i128) -> bool {
        // Verify admin
        let stored_admin: Address = e.storage().instance()
            .get(&Symbol::new(&e, "admin"))
            .expect("Contract not initialized");
        
        if stored_admin != admin {
            panic!("Unauthorized - admin only");
        }

        // Check contract balance
        let total_balance: i128 = e.storage().instance()
            .get(&Symbol::new(&e, "total_xlm_balance"))
            .unwrap_or(0);
        
        if total_balance < amount {
            panic!("Insufficient contract balance");
        }

        // Transfer XLM from contract to admin
        Self::transfer_xlm_from_contract(&e, &admin, amount);

        true
    }

    // Get contract balance
    pub fn get_contract_balance(e: Env) -> i128 {
        e.storage().instance()
            .get(&Symbol::new(&e, "total_xlm_balance"))
            .unwrap_or(0)
    }

    // Get current position details
    pub fn get_current_position(e: Env) -> (Address, i128, i128, i128, i128, i128, i128, i128) {
        let trader: Address = e.storage().instance()
            .get(&Symbol::new(&e, "current_trader"))
            .expect("No active position");
        let margin: i128 = e.storage().instance()
            .get(&Symbol::new(&e, "current_margin"))
            .unwrap_or(0);
        let leverage: i128 = e.storage().instance()
            .get(&Symbol::new(&e, "current_leverage"))
            .unwrap_or(0);
        let size: i128 = e.storage().instance()
            .get(&Symbol::new(&e, "current_size"))
            .unwrap_or(0);
        let side: i128 = e.storage().instance()
            .get(&Symbol::new(&e, "current_side"))
            .unwrap_or(0);
        let entry_price: i128 = e.storage().instance()
            .get(&Symbol::new(&e, "current_entry_price"))
            .unwrap_or(0);
        let timestamp: i128 = e.storage().instance()
            .get(&Symbol::new(&e, "current_timestamp"))
            .unwrap_or(0);
        let is_active: i128 = e.storage().instance()
            .get(&Symbol::new(&e, "current_is_active"))
            .unwrap_or(0);

        (trader, margin, leverage, size, side, entry_price, timestamp, is_active)
    }

    // Get trader positions
    pub fn get_trader_positions(e: Env, trader: Address) -> Vec<u64> {
        let trader_positions_key = Symbol::new(&e, "trader_positions");
        let trader_positions: Map<Address, Vec<u64>> = e.storage().instance()
            .get(&trader_positions_key)
            .unwrap_or(Map::new(&e));
        
        trader_positions.get(trader).unwrap_or(Vec::new(&e))
    }

    // Get contract stats
    pub fn get_contract_stats(e: Env) -> (i128, u64, bool) {
        let total_balance: i128 = e.storage().instance()
            .get(&Symbol::new(&e, "total_xlm_balance"))
            .unwrap_or(0);
        let next_position_id: u64 = e.storage().instance()
            .get(&Symbol::new(&e, "next_position_id"))
            .unwrap_or(0);
        let is_active: bool = e.storage().instance()
            .get(&Symbol::new(&e, "is_active"))
            .unwrap_or(false);
        
        (total_balance, next_position_id, is_active)
    }

    // Mock price function (will be replaced with real oracle integration)
    fn get_mock_price() -> i128 {
        10_000_000i128 // $1.00 XLM in stroops
    }

    // Admin functions
    pub fn pause_contract(e: Env, admin: Address) {
        let stored_admin: Address = e.storage().instance()
            .get(&Symbol::new(&e, "admin"))
            .expect("Contract not initialized");
        
        if stored_admin != admin {
            panic!("Unauthorized");
        }

        e.storage().instance().set(&Symbol::new(&e, "is_active"), &false);
    }

    pub fn resume_contract(e: Env, admin: Address) {
        let stored_admin: Address = e.storage().instance()
            .get(&Symbol::new(&e, "admin"))
            .expect("Contract not initialized");
        
        if stored_admin != admin {
            panic!("Unauthorized");
        }

        e.storage().instance().set(&Symbol::new(&e, "is_active"), &true);
    }
}