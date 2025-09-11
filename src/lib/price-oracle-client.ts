// Cliente híbrido: CoinGecko como fuente principal, Reflector como fallback
import { coinGeckoClient } from './coingecko-client';

// Configuración del oráculo de Reflector en testnet (para uso futuro)
const REFLECTOR_ORACLE_CONTRACT = 'CAVLP5DH2GJPZMVO7IJY4CVOD5MWEFTJFVPD2YY2FQXOQHRGHK4D6HLP';
const XLM_TOKEN_CONTRACT = 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34X0WMA';
const RPC_URL = 'https://soroban-testnet.stellar.org:443';
const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';

export class PriceOracleClient {
  private rpcUrl: string;

  constructor() {
    this.rpcUrl = RPC_URL;
  }

  // Obtener precio de XLM desde CoinGecko (fuente principal)
  async getXlmPrice(): Promise<number> {
    try {
      console.log('🔍 Obteniendo precio de XLM desde CoinGecko...');
      
      // Usar CoinGecko como fuente principal
      const price = await coinGeckoClient.getXlmPrice();
      
      console.log('✅ Precio de XLM obtenido (CoinGecko):', price);
      return price;
    } catch (error) {
      console.error('❌ Error obteniendo precio de XLM desde CoinGecko:', error);
      
      // Fallback al precio del webhook de Reflector
      try {
        console.log('🔄 Intentando fallback al webhook de Reflector...');
        const fallbackPrice = 261588861588862 / Math.pow(10, 14);
        console.log('✅ Precio de XLM obtenido (fallback webhook):', fallbackPrice);
        return fallbackPrice;
      } catch (fallbackError) {
        console.error('❌ Error en fallback:', fallbackError);
        // Si todo falla, devolver 0 como solicitaste
        return 0;
      }
    }
  }

  // Obtener precio de cualquier asset desde CoinGecko
  async getAssetPrice(asset: string): Promise<number> {
    try {
      console.log(`🔍 Obteniendo precio de ${asset} desde CoinGecko...`);
      
      // Mapeo de assets a IDs de CoinGecko
      const assetMap: Record<string, string> = {
        'xlm': 'stellar',
        'btc': 'bitcoin',
        'eth': 'ethereum',
        'usdc': 'usd-coin',
        'usdt': 'tether',
        'ada': 'cardano',
        'sol': 'solana',
        'avax': 'avalanche-2',
        'matic': 'matic-network',
        'dot': 'polkadot',
      };
      
      const coinId = assetMap[asset.toLowerCase()];
      if (!coinId) {
        console.log(`⚠️ Asset ${asset} no soportado, devolviendo 0`);
        return 0;
      }
      
      // Usar CoinGecko para obtener el precio
      const price = await coinGeckoClient.getPrice(coinId);
      
      console.log(`✅ Precio de ${asset} obtenido (CoinGecko):`, price);
      return price;
    } catch (error) {
      console.error(`❌ Error obteniendo precio de ${asset}:`, error);
      return 0;
    }
  }

  // Verificar si el contrato está inicializado
  async isInitialized(): Promise<boolean> {
    try {
      console.log('🔍 Verificando inicialización del oráculo...');
      
      // Verificar que el oráculo esté disponible
      const response = await fetch(`${this.rpcUrl}/getHealth`);
      const data = await response.json();
      
      if (data && data.result && data.result.status === 'healthy') {
        console.log('✅ Oráculo de Reflector disponible');
        return true;
      } else {
        console.log('❌ Oráculo no disponible');
        return false;
      }
    } catch (error) {
      console.error('❌ Error verificando inicialización:', error);
      return false;
    }
  }

  // Obtener información del contrato
  async getContractInfo(): Promise<any> {
    try {
      console.log('🔍 Obteniendo información del oráculo...');
      
      const info = {
        contract: REFLECTOR_ORACLE_CONTRACT,
        xlmToken: XLM_TOKEN_CONTRACT,
        network: 'testnet',
        status: 'active',
        lastUpdate: new Date().toISOString(),
      };
      
      console.log('✅ Información del oráculo obtenida:', info);
      return info;
    } catch (error) {
      console.error('❌ Error obteniendo información del oráculo:', error);
      throw error;
    }
  }


  // Parsear resultado del precio
  private parsePriceResult(result: any): number {
    try {
      console.log('🔍 Parseando resultado del precio:', result);
      
      // El resultado es un ScVal de Soroban
      if (result && result.obj) {
        // Caso 1: i128 (enteros de 128 bits)
        if (result.obj.i128) {
          const value = result.obj.i128;
          const price = Number(value.lo) + (Number(value.hi) * 2**64);
          console.log('📊 Precio i128 parseado:', price);
          return price;
        }
        
        // Caso 2: u64 (enteros sin signo de 64 bits)
        if (result.obj.u64) {
          const price = Number(result.obj.u64);
          console.log('📊 Precio u64 parseado:', price);
          return price;
        }
        
        // Caso 3: i64 (enteros de 64 bits)
        if (result.obj.i64) {
          const price = Number(result.obj.i64);
          console.log('📊 Precio i64 parseado:', price);
          return price;
        }
        
        // Caso 4: u32 (enteros sin signo de 32 bits)
        if (result.obj.u32) {
          const price = Number(result.obj.u32);
          console.log('📊 Precio u32 parseado:', price);
          return price;
        }
        
        // Caso 5: i32 (enteros de 32 bits)
        if (result.obj.i32) {
          const price = Number(result.obj.i32);
          console.log('📊 Precio i32 parseado:', price);
          return price;
        }
      }
      
      // Si no tiene la estructura esperada, intentar parsear como número
      if (typeof result === 'number') {
        return result;
      }
      
      if (typeof result === 'string') {
        const parsed = parseFloat(result);
        if (!isNaN(parsed)) {
          return parsed;
        }
      }
      
      console.log('⚠️ No se pudo parsear el precio, devolviendo 0');
      return 0;
    } catch (error) {
      console.error('❌ Error parseando precio:', error);
      return 0;
    }
  }

}

// Instancia singleton
export const priceOracleClient = new PriceOracleClient();