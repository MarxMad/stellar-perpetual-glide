import { Networks, Address, xdr, Contract, StrKey, Soroban } from '@stellar/stellar-sdk';
import { REFLECTOR_CONFIG } from './stellar';
import { getAvailableReflectorTickers } from '@reflector/subscription-client';

// Tipos basados en el contrato de Reflector
export interface Asset {
  Stellar?: string; // Address como string
  Other?: string; // Symbol como string
}

export interface PriceData {
  price: string; // i128 como string
  timestamp: string; // u64 como string
}

export interface ReflectorTicker {
  symbol: string;
  source: 'pubnet' | 'exchanges';
  available: boolean;
}

// Cliente mejorado para interactuar con Reflector
export class ReflectorEnhancedClient {
  private contractId: string;
  private rpcUrl: string;
  private contract: Contract | null = null;
  private rpc: Soroban.Server | null = null;
  private isMainnet: boolean;

  constructor(useMainnet: boolean = false) {
    this.isMainnet = useMainnet;
    this.contractId = useMainnet 
      ? 'CBNGTWIVRCD4FOJ24FGAKI6I5SDAXI7A4GWKSQS7E6UYSR4E4OHRI2JX' // Mainnet Reflector
      : REFLECTOR_CONFIG.contractId; // Testnet Reflector
    this.rpcUrl = useMainnet 
      ? 'https://soroban-mainnet.stellar.org:443'
      : REFLECTOR_CONFIG.rpcUrl;
  }

  // Inicializar conexión con el contrato
  private async initializeContract(): Promise<void> {
    if (this.contract && this.rpc) return;

    try {
      this.rpc = new Soroban.Server(this.rpcUrl);
      this.contract = new Contract(this.contractId);
      console.log(`🔗 ReflectorEnhancedClient: Conectado a ${this.isMainnet ? 'Mainnet' : 'Testnet'}`);
    } catch (error) {
      console.error('Error initializing Reflector contract:', error);
      throw error;
    }
  }

  // Obtener tickers disponibles
  async getAvailableTickers(): Promise<ReflectorTicker[]> {
    try {
      console.log('📊 Obteniendo tickers disponibles de Reflector...');
      
      const [pubnetTickers, exchangeTickers] = await Promise.all([
        getAvailableReflectorTickers('pubnet'),
        getAvailableReflectorTickers('exchanges')
      ]);

      const tickers: ReflectorTicker[] = [
        ...pubnetTickers.map(symbol => ({
          symbol,
          source: 'pubnet' as const,
          available: true
        })),
        ...exchangeTickers.map(symbol => ({
          symbol,
          source: 'exchanges' as const,
          available: true
        }))
      ];

      console.log(`✅ Tickers obtenidos: ${tickers.length} total`);
      return tickers;
    } catch (error) {
      console.error('Error getting available tickers:', error);
      return [];
    }
  }

  // Obtener el último precio de un activo usando el contrato real de Reflector
  async getLastPrice(asset: string): Promise<{
    price: number;
    timestamp: number;
    decimals: number;
    source: 'contract' | 'mock';
  }> {
    try {
      console.log(`🎯 ReflectorEnhancedClient: getLastPrice llamado para ${asset} en ${this.isMainnet ? 'Mainnet' : 'Testnet'}`);
      
      // Mapear símbolos a activos en Reflector
      const assetMap: { [key: string]: { type: 'Stellar' | 'Other', value: string } } = {
        'XLM': { type: 'Stellar', value: 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA' },
        'USDC': { type: 'Stellar', value: 'CDJF2JQINO7WRFXB2AAHLONFDPPI4M3W2UM5THGQQ7JMJDIEJYC4CMPG' },
        'BTC': { type: 'Other', value: 'BTC' },
        'ETH': { type: 'Other', value: 'ETH' },
        'SOL': { type: 'Other', value: 'SOL' },
        'ADA': { type: 'Other', value: 'ADA' },
        'GBP': { type: 'Other', value: 'GBP' },
        'EUR': { type: 'Other', value: 'EUR' },
        'USD': { type: 'Other', value: 'USD' },
      };

      const assetInfo = assetMap[asset];
      if (!assetInfo) {
        throw new Error(`Asset ${asset} not found in Reflector`);
      }

      console.log(`📍 ReflectorEnhancedClient: Información del activo ${asset}:`, assetInfo);

      // Llamar al contrato real de Reflector
      await this.initializeContract();
      if (!this.contract || !this.rpc) {
        throw new Error('Contract not initialized');
      }

      console.log(`🔗 ReflectorEnhancedClient: Contrato inicializado correctamente`);

      // Crear el objeto Asset para el contrato según el tipo
      let assetScVal: xdr.ScVal;
      if (assetInfo.type === 'Stellar') {
        assetScVal = xdr.ScVal.scvMap([
          new xdr.ScMapEntry({
            key: xdr.ScVal.scvSymbol('Stellar'),
            val: xdr.ScVal.scvAddress(xdr.ScAddress.contract(StrKey.decodeContract(assetInfo.value).toString()))
          })
        ]);
      } else {
        assetScVal = xdr.ScVal.scvMap([
          new xdr.ScMapEntry({
            key: xdr.ScVal.scvSymbol('Other'),
            val: xdr.ScVal.scvSymbol(assetInfo.value)
          })
        ]);
      }
      console.log(`📦 ReflectorEnhancedClient: Asset ScVal creado para ${asset}`);
      
      // Llamar a la función lastprice del contrato
      console.log(`📞 ReflectorEnhancedClient: Llamando a lastprice del contrato...`);
      const result = await this.rpc.simulateTransaction(
        this.contract.call('lastprice', assetScVal)
      );
      console.log(`📊 ReflectorEnhancedClient: Resultado del contrato:`, result);
      
      if (!result || !result.result || result.result.switch().name === 'void') {
        throw new Error(`No price data available for ${asset}`);
      }

      // Procesar el resultado del contrato
      const resultObj = result.result;
      if (!resultObj || resultObj.switch().name !== 'vec') {
        throw new Error(`Invalid price data format for ${asset}`);
      }

      const priceData = resultObj.vec();
      if (priceData.length < 2) {
        throw new Error(`Incomplete price data for ${asset}`);
      }

      // Obtener decimales del contrato
      const decimalsResult = await this.rpc.simulateTransaction(
        this.contract.call('decimals')
      );
      const decimals = decimalsResult.result?.obj()?.u32() || 14;
      console.log(`🔢 ReflectorEnhancedClient: Decimales del contrato:`, decimals);
      
      // Extraer precio y timestamp del resultado
      const rawPrice = priceData[0].i128();
      const rawTimestamp = priceData[1].u64();
      
      const finalPrice = Number(rawPrice) / Math.pow(10, decimals);
      const finalTimestamp = Number(rawTimestamp) * 1000; // Convertir a milisegundos
      
      console.log(`✅ ReflectorEnhancedClient: Precio real obtenido para ${asset}:`, {
        price: finalPrice,
        timestamp: finalTimestamp,
        decimals: Number(decimals),
        rawPrice: rawPrice.toString(),
        source: 'contract'
      });
      
      return {
        price: finalPrice,
        timestamp: finalTimestamp,
        decimals: Number(decimals),
        source: 'contract'
      };
    } catch (error) {
      console.error(`❌ ReflectorEnhancedClient: Error getting real price for ${asset} from Reflector contract:`, error);
      
      // Fallback a precio simulado
      const mockPrice = this.getMockPrice(asset);
      console.log(`🔄 ReflectorEnhancedClient: Usando precio mock para ${asset}:`, mockPrice);
      return {
        price: mockPrice,
        timestamp: Date.now(),
        decimals: 14,
        source: 'mock'
      };
    }
  }

  // Precio simulado para desarrollo (basado en precios reales)
  private getMockPrice(asset: string): number {
    const basePrices: { [key: string]: number } = {
      'XLM': 0.36,
      'BTC': 95000.00,
      'ETH': 3500.00,
      'SOL': 180.00,
      'ADA': 0.45,
      'USDC': 1.00,
    };

    const basePrice = basePrices[asset] || 0;
    const volatility = 0.01; // 1% de volatilidad para simulación
    const randomChange = (Math.random() - 0.5) * volatility;
    
    return basePrice * (1 + randomChange);
  }

  // Obtener información del contrato
  async getContractInfo(): Promise<{
    contractId: string;
    isActive: boolean;
    decimals: number;
    network: string;
    version: number;
  }> {
    try {
      await this.initializeContract();
      
      if (!this.contract || !this.rpc) {
        throw new Error('Contract not initialized');
      }

      const [isActive, decimals, version] = await Promise.all([
        this.isActive(),
        this.getDecimals(),
        this.getVersion()
      ]);

      return {
        contractId: this.contractId,
        isActive,
        decimals,
        network: this.isMainnet ? 'mainnet' : 'testnet',
        version
      };
    } catch (error) {
      console.error('Error getting contract info:', error);
      throw error;
    }
  }

  // Obtener decimales del oráculo
  async getDecimals(): Promise<number> {
    try {
      await this.initializeContract();
      
      if (!this.contract || !this.rpc) {
        throw new Error('Contract not initialized');
      }

      const result = await this.rpc.simulateTransaction(
        this.contract.call('decimals')
      );
      const decimals = result.result?.obj()?.u32() || 14;
      
      console.log(`🔢 ReflectorEnhancedClient: Decimales obtenidos del contrato:`, decimals);
      return decimals;
    } catch (error) {
      console.error('Error getting decimals:', error);
      return 14; // Default fallback
    }
  }

  // Obtener versión del contrato
  async getVersion(): Promise<number> {
    try {
      await this.initializeContract();
      
      if (!this.contract || !this.rpc) {
        throw new Error('Contract not initialized');
      }

      const result = await this.rpc.simulateTransaction(
        this.contract.call('version')
      );
      const version = result.result?.obj()?.u32() || 0;
      
      console.log(`📋 ReflectorEnhancedClient: Versión del contrato:`, version);
      return version;
    } catch (error) {
      console.error('Error getting version:', error);
      return 0;
    }
  }

  // Verificar si el contrato está activo
  async isActive(): Promise<boolean> {
    try {
      await this.initializeContract();
      
      if (!this.contract || !this.rpc) {
        return false;
      }

      // Verificar si podemos obtener información básica del contrato
      const result = await this.rpc.simulateTransaction(
        this.contract.call('version')
      );
      const version = result.result?.obj()?.u32();
      
      console.log(`📋 ReflectorEnhancedClient: Versión del contrato:`, version);
      return version !== undefined && version > 0;
    } catch (error) {
      console.error('Error checking contract status:', error);
      return false;
    }
  }

  // Obtener múltiples precios de una vez
  async getMultiplePrices(assets: string[]): Promise<{
    [asset: string]: {
      price: number;
      timestamp: number;
      decimals: number;
      source: 'contract' | 'mock';
    };
  }> {
    try {
      console.log('🚀 ReflectorEnhancedClient: Iniciando getMultiplePrices para activos:', assets);
      
      const prices: { [asset: string]: any } = {};
      
      // Obtener precios en paralelo para mejor rendimiento
      await Promise.all(
        assets.map(async (asset) => {
          try {
            console.log(`🔍 ReflectorEnhancedClient: Obteniendo precio para ${asset}`);
            const priceData = await this.getLastPrice(asset);
            console.log(`✅ ReflectorEnhancedClient: Precio obtenido para ${asset}:`, priceData);
            prices[asset] = priceData;
          } catch (error) {
            console.error(`❌ ReflectorEnhancedClient: Error getting price for ${asset}:`, error);
            // Usar precio simulado como fallback
            const mockPrice = this.getMockPrice(asset);
            console.log(`🔄 ReflectorEnhancedClient: Usando precio mock para ${asset}:`, mockPrice);
            prices[asset] = {
              price: mockPrice,
              timestamp: Date.now(),
              decimals: 14,
              source: 'mock'
            };
          }
        })
      );
      
      console.log('📊 ReflectorEnhancedClient: Precios finales:', prices);
      return prices;
    } catch (error) {
      console.error('Error getting multiple prices:', error);
      throw error;
    }
  }
}

// Instancias singleton del cliente
export const reflectorTestnetClient = new ReflectorEnhancedClient(false);
export const reflectorMainnetClient = new ReflectorEnhancedClient(true);
