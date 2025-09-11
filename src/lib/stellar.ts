// Configuración de Stellar
export const STELLAR_NETWORKS = {
  testnet: {
    rpcUrl: 'https://soroban-testnet.stellar.org:443',
    networkPassphrase: 'Test SDF Network ; September 2015',
    horizonUrl: 'https://horizon-testnet.stellar.org'
  },
  mainnet: {
    rpcUrl: 'https://soroban-mainnet.stellar.org:443',
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
    horizonUrl: 'https://horizon.stellar.org'
  }
};

// Configuración de Reflector
export const REFLECTOR_CONFIG = {
  contractId: 'CBNGTWIVRCD4FOJ24FGAKI6I5SDAXI7A4GWKSQS7E6UYSR4E4OHRI2JX', // Testnet Reflector
  rpcUrl: 'https://soroban-testnet.stellar.org:443',
  networkPassphrase: 'Test SDF Network ; September 2015'
};

// Configuración de contratos desplegados
export const DEPLOYED_CONTRACTS = {
  testnet: {
    priceOracle: 'CAYMTS6FAAYPCYUSMGRIIHSRBLTWB53EYPMANEV6UZMHE4VIBINF52TD',
    perpetualTrading: 'CBCKPEPZZ6H66555PB7ZR3YQNX2GBHR4VFP7NZIV4KZ36345YFZXEZE2'
  }
};