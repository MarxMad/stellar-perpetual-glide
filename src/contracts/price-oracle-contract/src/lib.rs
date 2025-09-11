#![no_std]

use soroban_sdk::{contract, contractimpl, Address, Env, String, Symbol, Vec};

// Reflector Oracle interface
mod reflector {
    use soroban_sdk::{contracttype, Address, Env, Symbol, Vec};

    // Oracle contract interface exported as ReflectorClient
    #[soroban_sdk::contractclient(name = "ReflectorClient")]
    pub trait Contract {
        fn base(e: Env) -> Asset;
        fn assets(e: Env) -> Vec<Asset>;
        fn decimals(e: Env) -> u32;
        fn lastprice(e: Env, asset: Asset) -> Option<PriceData>;
        fn twap(e: Env, asset: Asset, records: u32) -> Option<i128>;
        fn resolution(e: Env) -> u32;
        fn last_timestamp(e: Env) -> u64;
        fn version(e: Env) -> u32;
    }

    #[contracttype(export = false)]
    #[derive(Debug, Clone, Eq, PartialEq, Ord, PartialOrd)]
    pub enum Asset {
        Stellar(Address),
        Other(Symbol)
    }

    #[contracttype(export = false)]
    #[derive(Debug, Clone, Eq, PartialEq, Ord, PartialOrd)]
    pub struct PriceData {
        pub price: i128,
        pub timestamp: u64
    }
}

#[contract]
pub struct PriceOracleContract;

#[contractimpl]
impl PriceOracleContract {
    // Initialize with Reflector Oracle address
    pub fn initialize(e: Env, reflector_address: Address) {
        e.storage().instance().set(&Symbol::new(&e, "reflector"), &reflector_address);
    }

    // Get XLM price from Reflector
    pub fn get_xlm_price(e: Env) -> i128 {
        let reflector_address: Address = e.storage().instance()
            .get(&Symbol::new(&e, "reflector"))
            .expect("Reflector not initialized");
        
        let reflector_client = reflector::ReflectorClient::new(&e, &reflector_address);
        let xlm_asset = reflector::Asset::Stellar(Address::from_string(&String::from_str(&e, "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA")));
        
        if let Some(price_data) = reflector_client.lastprice(&xlm_asset) {
            price_data.price
        } else {
            0
        }
    }

    // Get BTC price from Reflector
    pub fn get_btc_price(e: Env) -> i128 {
        let reflector_address: Address = e.storage().instance()
            .get(&Symbol::new(&e, "reflector"))
            .expect("Reflector not initialized");
        
        let reflector_client = reflector::ReflectorClient::new(&e, &reflector_address);
        let btc_asset = reflector::Asset::Other(Symbol::new(&e, "BTC"));
        
        if let Some(price_data) = reflector_client.lastprice(&btc_asset) {
            price_data.price
        } else {
            0
        }
    }

    // Get ETH price from Reflector
    pub fn get_eth_price(e: Env) -> i128 {
        let reflector_address: Address = e.storage().instance()
            .get(&Symbol::new(&e, "reflector"))
            .expect("Reflector not initialized");
        
        let reflector_client = reflector::ReflectorClient::new(&e, &reflector_address);
        let eth_asset = reflector::Asset::Other(Symbol::new(&e, "ETH"));
        
        if let Some(price_data) = reflector_client.lastprice(&eth_asset) {
            price_data.price
        } else {
            0
        }
    }

    // Get TWAP (Time Weighted Average Price) for XLM
    pub fn get_xlm_twap(e: Env, records: u32) -> i128 {
        let reflector_address: Address = e.storage().instance()
            .get(&Symbol::new(&e, "reflector"))
            .expect("Reflector not initialized");
        
        let reflector_client = reflector::ReflectorClient::new(&e, &reflector_address);
        let xlm_asset = reflector::Asset::Stellar(Address::from_string(&String::from_str(&e, "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA")));
        
        reflector_client.twap(&xlm_asset, &records).unwrap_or(0)
    }

    // Check if price is fresh (within last 5 minutes)
    pub fn is_price_fresh(e: Env) -> bool {
        let reflector_address: Address = e.storage().instance()
            .get(&Symbol::new(&e, "reflector"))
            .expect("Reflector not initialized");
        
        let reflector_client = reflector::ReflectorClient::new(&e, &reflector_address);
        let current_time = e.ledger().timestamp();
        let last_timestamp = reflector_client.last_timestamp();
        
        current_time - last_timestamp <= 300 // 5 minutes
    }

    // Get all available assets from Reflector
    pub fn get_available_assets(e: Env) -> Vec<reflector::Asset> {
        let reflector_address: Address = e.storage().instance()
            .get(&Symbol::new(&e, "reflector"))
            .expect("Reflector not initialized");
        
        let reflector_client = reflector::ReflectorClient::new(&e, &reflector_address);
        reflector_client.assets()
    }

    // Get price decimals from Reflector
    pub fn get_price_decimals(e: Env) -> u32 {
        let reflector_address: Address = e.storage().instance()
            .get(&Symbol::new(&e, "reflector"))
            .expect("Reflector not initialized");
        
        let reflector_client = reflector::ReflectorClient::new(&e, &reflector_address);
        reflector_client.decimals()
    }

    // Get Reflector Oracle info
    pub fn get_oracle_info(e: Env) -> (u32, u32, u64) {
        let reflector_address: Address = e.storage().instance()
            .get(&Symbol::new(&e, "reflector"))
            .expect("Reflector not initialized");
        
        let reflector_client = reflector::ReflectorClient::new(&e, &reflector_address);
        
        let decimals = reflector_client.decimals();
        let resolution = reflector_client.resolution();
        let last_timestamp = reflector_client.last_timestamp();
        
        (decimals, resolution, last_timestamp)
    }

    // Calculate funding rate based on spot-futures price difference
    pub fn calculate_funding_rate(e: Env, spot_price: i128, futures_price: i128) -> i128 {
        let price_diff = futures_price - spot_price;
        let price_diff_percentage = (price_diff * 10000) / spot_price; // Basis points
        
        let base_rate = 1i128; // 0.01% base rate
        let funding_rate = base_rate + (price_diff_percentage / 100);
        
        // Cap at ±0.1% (±10 basis points)
        if funding_rate > 10 {
            10
        } else if funding_rate < -10 {
            -10
        } else {
            funding_rate
        }
    }
}
