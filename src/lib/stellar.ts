import { Networks } from '@stellar/stellar-sdk';

// Configuración de Stellar
export const STELLAR_CONFIG = {
  // Testnet para desarrollo
  network: Networks.TESTNET,
  // Mainnet para producción
  // network: Networks.PUBLIC,
  
  // URLs de Horizon
  horizonUrl: Networks.TESTNET === Networks.TESTNET 
    ? 'https://horizon-testnet.stellar.org' 
    : 'https://horizon.stellar.org',
  
  // URLs de Soroban RPC
  sorobanRpcUrl: Networks.TESTNET === Networks.TESTNET 
    ? 'https://soroban-testnet.stellar.org' 
    : 'https://soroban.stellar.org',
};

// No necesitamos crear un cliente aquí, lo crearemos cuando sea necesario

// Configuración de Reflector
export const REFLECTOR_CONFIG = {
  // Contrato de Reflector en testnet (datos de prueba)
  contractId: 'CAVLP5DH2GJPZMVO7IJY4CVOD5MWEFTJFVPD2YY2FQXOQHRGHK4D6HLP', // Reflector Oracle Testnet (funciona)
  // RPC URL para Soroban testnet
  rpcUrl: 'https://soroban-testnet.stellar.org',
  // Network passphrase para testnet
  networkPassphrase: 'Test SDF Network ; September 2015',
};

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
