// Perpetual Futures Contract using Reflector Oracle
// This contract demonstrates how to use Reflector for perpetual trading

use crate::reflector::{ReflectorClient, Asset as ReflectorAsset, PriceData};
use soroban_sdk::{contract, contractimpl, Address, Env, String, Symbol, Vec};

#[contract]
pub struct PerpetualFuturesContract;

#[contractimpl]
impl PerpetualFuturesContract {
    // Initialize the contract with Reflector oracle address
    pub fn initialize(e: Env, oracle_address: Address) {
        // Store oracle address in contract storage
        e.storage().instance().set(&Symbol::new(&e, "oracle"), &oracle_address);
    }

    // Get the most recent price for an asset using Reflector
    pub fn get_asset_price(e: Env, asset_symbol: &str) -> Option<PriceData> {
        // Get oracle address from storage
        let oracle_address: Address = e.storage().instance().get(&Symbol::new(&e, "oracle"))
            .expect("Oracle not initialized");
        
        // Create Reflector client
        let reflector_client = ReflectorClient::new(&e, &oracle_address);
        
        // Convert string to Reflector asset
        let asset = ReflectorAsset::Other(Symbol::new(&e, &asset_symbol));
        
        // Get the most recent price
        reflector_client.lastprice(&asset)
    }

    // Calculate funding rate based on spot-futures price difference
    pub fn calculate_funding_rate(
        e: Env, 
        base_asset: String, 
        quote_asset: String,
        spot_price: i128,
        futures_price: i128
    ) -> i128 {
        // Get current prices from Reflector for validation
        let base_price = Self::get_asset_price(e.clone(), &base_asset);
        let quote_price = Self::get_asset_price(e.clone(), &quote_asset);
        
        if base_price.is_none() || quote_price.is_none() {
            panic!("Price data not available from Reflector");
        }
        
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

    // Get TWAP (Time Weighted Average Price) for an asset
    pub fn get_twap_price(e: Env, asset_symbol: &str, records: u32) -> Option<i128> {
        let oracle_address: Address = e.storage().instance().get(&Symbol::new(&e, "oracle"))
            .expect("Oracle not initialized");
        
        let reflector_client = ReflectorClient::new(&e, &oracle_address);
        let asset = ReflectorAsset::Other(Symbol::new(&e, &asset_symbol));
        
        reflector_client.twap(&asset, &records)
    }

    // Get cross-price between two assets
    pub fn get_cross_price(
        e: Env, 
        base_asset: &str, 
        quote_asset: &str
    ) -> Option<PriceData> {
        let oracle_address: Address = e.storage().instance().get(&Symbol::new(&e, "oracle"))
            .expect("Oracle not initialized");
        
        let reflector_client = ReflectorClient::new(&e, &oracle_address);
        let base = ReflectorAsset::Other(Symbol::new(&e, &base_asset));
        let quote = ReflectorAsset::Other(Symbol::new(&e, &quote_asset));
        
        reflector_client.x_last_price(&base, &quote)
    }

    // Check if price data is fresh (within last 5 minutes)
    pub fn is_price_fresh(e: Env, asset_symbol: &str) -> bool {
        let price_data = Self::get_asset_price(e.clone(), asset_symbol);
        
        if let Some(price) = price_data {
            let current_time = e.ledger().timestamp();
            let time_diff = current_time - price.timestamp;
            
            // Check if price is within 5 minutes (300 seconds)
            time_diff <= 300
        } else {
            false
        }
    }

    // Get all available assets from Reflector
    pub fn get_available_assets(e: Env) -> Vec<ReflectorAsset> {
        let oracle_address: Address = e.storage().instance().get(&Symbol::new(&e, "oracle"))
            .expect("Oracle not initialized");
        
        let reflector_client = ReflectorClient::new(&e, &oracle_address);
        reflector_client.assets()
    }

    // Get oracle information
    pub fn get_oracle_info(e: Env) -> (String, u32, u32, u64) {
        let oracle_address: Address = e.storage().instance().get(&Symbol::new(&e, "oracle"))
            .expect("Oracle not initialized");
        
        let reflector_client = ReflectorClient::new(&e, &oracle_address);
        
        let base_asset = reflector_client.base();
        let decimals = reflector_client.decimals();
        let resolution = reflector_client.resolution();
        let last_timestamp = reflector_client.last_timestamp();
        
        // Convert base asset to string for return
        let base_string = match base_asset {
            ReflectorAsset::Stellar(_addr) => String::from_str(&e, "Stellar"),
            ReflectorAsset::Other(_symbol) => String::from_str(&e, "Other"),
        };
        
        (base_string, decimals, resolution, last_timestamp)
    }
}