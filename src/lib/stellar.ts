import { Networks } from '@stellar/stellar-sdk';

// Función para obtener la configuración de Stellar basada en la red
export const getStellarConfig = (network: 'mainnet' | 'testnet' = 'testnet') => {
  const isTestnet = network === 'testnet';
  
  return {
    network: isTestnet ? Networks.TESTNET : Networks.PUBLIC,
    horizonUrl: isTestnet 
      ? 'https://horizon-testnet.stellar.org' 
      : 'https://horizon.stellar.org',
    sorobanRpcUrl: isTestnet 
      ? 'https://soroban-testnet.stellar.org' 
      : 'https://soroban.stellar.org',
  };
};

// Configuración por defecto (testnet)
export const STELLAR_CONFIG = getStellarConfig('testnet');

// Función para obtener la configuración de Reflector basada en la red
export const getReflectorConfig = (network: 'mainnet' | 'testnet' = 'testnet') => {
  const isTestnet = network === 'testnet';
  
  return {
    // Contrato de Reflector
    contractId: isTestnet 
      ? 'CAVLP5DH2GJPZMVO7IJY4CVOD5MWEFTJFVPD2YY2FQXOQHRGHK4D6HLP' // Reflector Oracle Testnet
      : 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHXCN3A3A', // Reflector Oracle Mainnet
    // RPC URL
    rpcUrl: isTestnet 
      ? 'https://soroban-testnet.stellar.org'
      : 'https://soroban.stellar.org',
    // Network passphrase
    networkPassphrase: isTestnet 
      ? 'Test SDF Network ; September 2015'
      : 'Public Global Stellar Network ; September 2015',
  };
};

// Configuración por defecto de Reflector (testnet)
export const REFLECTOR_CONFIG = getReflectorConfig('testnet');

// Contratos de Reflector en Mainnet (para precios reales)
export const REFLECTOR_MAINNET_CONFIG = {
  // Stellar DEX
  stellarDex: 'CALI2BYU2JE6WVRUFYTS6MSBNEHGJ35P4AVCZYF3B6QOE3QKOB2PLE6M',
  // External CEX & DEX
  externalCexDex: 'CAFJZQWSED6YAWZU3GWRTOCNPPCGBN32L7QV43XX5LZLFTK6JLN34DLN',
  // RPC URL para Soroban mainnet
  rpcUrl: 'https://soroban.stellar.org',
  // Network passphrase para mainnet
  networkPassphrase: 'Public Global Stellar Network ; September 2015',
};

export const PERPETUAL_CONTRACT_CONFIG = {
  // Nuestro contrato de Perpetual Futures desplegado (v2 con trading real)
  contractId: 'CAONSO66F353N457FAUSEB2ZPM6LZTMTATL34XWLVKLL6ZO4AKVURCLV',
  // RPC URL para Soroban testnet (con puerto)
  rpcUrl: 'https://soroban-testnet.stellar.org:443',
  // Network passphrase para testnet
  networkPassphrase: 'Test SDF Network ; September 2015',
};

// Configuración de KALE
export const KALE_CONFIG = {
  // Contrato de KALE en testnet
  contractId: 'CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE',
  // Contrato de KALE en mainnet (cuando esté disponible)
  // contractId: 'YOUR_MAINNET_CONTRACT_ID',
};

// Tipos de activos soportados
export const SUPPORTED_ASSETS = {
  XLM: 'XLM',
  USDC: 'USDC',
  BTC: 'BTC',
  ETH: 'ETH',
  // Agregar más activos según sea necesario
};

// Configuración de pares de trading
export const TRADING_PAIRS = [
  'XLM/USDC',
  'BTC/USDC',
  'ETH/USDC',
  'XLM/BTC',
  'XLM/ETH',
];