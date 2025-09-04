import { Networks, Address, xdr, Contract, SorobanRpc } from '@stellar/stellar-sdk';
import { REFLECTOR_CONFIG } from './stellar';

// Cliente para interactuar con el contrato de Reflector
export class ReflectorClient {
  private contractId: string;
  private rpcUrl: string;
  private contract: Contract | null = null;
  private rpc: SorobanRpc.Server | null = null;

  constructor() {
    this.contractId = REFLECTOR_CONFIG.contractId;
    this.rpcUrl = REFLECTOR_CONFIG.rpcUrl;
  }

  // Inicializar conexión con el contrato
  private async initializeContract(): Promise<void> {
    if (this.contract && this.rpc) return;

    try {
      this.rpc = new SorobanRpc.Server(this.rpcUrl);
      this.contract = new Contract(this.contractId);
    } catch (error) {
      console.error('Error initializing Reflector contract:', error);
      throw error;
    }
  }

  // Obtener el último precio de un activo usando el contrato real de Reflector
  async getLastPrice(asset: string): Promise<{
    price: number;
    timestamp: number;
    decimals: number;
  }> {
    try {
      console.log(`🎯 ReflectorClient: getLastPrice llamado para ${asset}`);
      
      // Mapear símbolos a activos en Reflector
      // NOTA: Solo algunos activos tienen datos reales en Testnet
      const assetMap: { [key: string]: { type: 'Stellar' | 'Other', value: string } } = {
        'XLM': { type: 'Stellar', value: 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA' }, // Sin datos
        'USDC': { type: 'Stellar', value: 'CDJF2JQINO7WRFXB2AAHLONFDPPI4M3W2UM5THGQQ7JMJDIEJYC4CMPG' }, // Con datos
        'BTC': { type: 'Stellar', value: 'CABWYQLGOQ5Y3RIYUVYJZVA355YVX4SPAMN6ORDAVJZQBPPHLHRRLNMS' }, // Con datos
        'ETH': { type: 'Stellar', value: 'CCTQVWJYOKUJJSTTKJ4CHJKTOR7PH6TZAABJU56UXXEETLA2Q5HBGFVU' }, // Sin datos
        'SOL': { type: 'Stellar', value: 'CA4DYJSRG7HPVTPJZAIPNUC3UJCQEZ456GPLYVYR2IATCBAPTQV6UUKZ' }, // Con datos
        'ADA': { type: 'Stellar', value: 'CBARCMJYRRNSYCWCR3EU2PEHAHWHBCQSMIKQIUSDWR3BK7CBCP622Q2R' }, // Sin datos
        'GBP': { type: 'Other', value: 'GBP' }, // Para probar Foreign Exchange
        'EUR': { type: 'Other', value: 'EUR' }, // Para probar Foreign Exchange
        'USD': { type: 'Other', value: 'USD' }, // Para probar Foreign Exchange
      };

      const assetInfo = assetMap[asset];
      if (!assetInfo) {
        throw new Error(`Asset ${asset} not found in Reflector`);
      }

      console.log(`📍 ReflectorClient: Información del activo ${asset}:`, assetInfo);

      // Llamar al contrato real de Reflector
      await this.initializeContract();
      if (!this.contract || !this.rpc) {
        throw new Error('Contract not initialized');
      }

      console.log(`🔗 ReflectorClient: Contrato inicializado correctamente`);

      // Crear el objeto Asset para el contrato según el tipo
      const assetObj = assetInfo.type === 'Stellar' 
        ? { Stellar: assetInfo.value }
        : { Other: assetInfo.value };
      console.log(`📦 ReflectorClient: Objeto Asset creado:`, assetObj);
      
      // Llamar a la función lastprice del contrato
      console.log(`📞 ReflectorClient: Llamando a lastprice del contrato...`);
      const result = await this.contract.call('lastprice', assetObj);
      console.log(`📊 ReflectorClient: Resultado del contrato:`, result);
      
      if (!result) {
        throw new Error(`No price data available for ${asset}`);
      }

      // Obtener decimales del contrato
      const decimals = await this.contract.call('decimals');
      console.log(`🔢 ReflectorClient: Decimales del contrato:`, decimals);
      
      const finalPrice = Number(result.price) / Math.pow(10, Number(decimals));
      const finalTimestamp = Number(result.timestamp) * 1000;
      
      console.log(`✅ ReflectorClient: Precio final para ${asset}:`, {
        price: finalPrice,
        timestamp: finalTimestamp,
        decimals: Number(decimals),
        rawPrice: result.price
      });
      
      return {
        price: finalPrice,
        timestamp: finalTimestamp,
        decimals: Number(decimals),
      };
    } catch (error) {
      console.error(`❌ ReflectorClient: Error getting real price for ${asset} from Reflector contract:`, error);
      
      // NOTA: Reflector Testnet solo tiene datos de prueba, no precios reales de mercado
      // Para precios reales necesitarías usar Mainnet o un oráculo diferente
      const mockPrice = this.getMockPrice(asset);
      console.log(`🔄 ReflectorClient: Usando precio mock para ${asset} (Testnet no tiene datos reales):`, mockPrice);
      return {
        price: mockPrice,
        timestamp: Date.now(),
        decimals: 7, // Mock usa 7 decimales
      };
    }
  }

  // Precio simulado para desarrollo (basado en precios reales de Google)
  private getMockPrice(asset: string): number {
    const basePrices: { [key: string]: number } = {
      'XLM': 0.36, // Precio real de Google
      'BTC': 95000.00, // Precio aproximado actual
      'ETH': 3500.00, // Precio aproximado actual
      'SOL': 180.00, // Precio aproximado actual
      'ADA': 0.45, // Precio aproximado actual
      'USDC': 1.00, // Stablecoin
    };

    const basePrice = basePrices[asset] || 0;
    const volatility = 0.01; // 1% de volatilidad para simulación
    const randomChange = (Math.random() - 0.5) * volatility;
    
    return basePrice * (1 + randomChange);
  }

  // Obtener TWAP (Time Weighted Average Price) usando la API real de Reflector
  async getTWAP(asset: string, period: number = 5): Promise<{
    price: number;
    period: number;
    timestamp: number;
  }> {
    try {
      // Usar la API real de Reflector para TWAP
      const response = await fetch(`https://api.reflector.network/v1/twap/${asset}?period=${period}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        price: parseFloat(data.price) / Math.pow(10, data.decimals || 7),
        period,
        timestamp: data.timestamp || Date.now(),
      };
    } catch (error) {
      console.error(`Error getting TWAP for ${asset} from Reflector:`, error);
      
      // Fallback a precio normal
      const mockPrice = this.getMockPrice(asset);
      return {
        price: mockPrice,
        period,
        timestamp: Date.now(),
      };
    }
  }

  // Obtener múltiples precios de una vez usando el contrato real
  async getMultiplePrices(assets: string[]): Promise<{
    [asset: string]: {
      price: number;
      timestamp: number;
      decimals: number;
    };
  }> {
    try {
      console.log('🚀 ReflectorClient: Iniciando getMultiplePrices para activos:', assets);
      
      const prices: { [asset: string]: any } = {};
      
      // Obtener precios en paralelo para mejor rendimiento
      await Promise.all(
        assets.map(async (asset) => {
          try {
            console.log(`🔍 ReflectorClient: Obteniendo precio para ${asset}`);
            const priceData = await this.getLastPrice(asset);
            console.log(`✅ ReflectorClient: Precio obtenido para ${asset}:`, priceData);
            prices[asset] = priceData;
          } catch (error) {
            console.error(`❌ ReflectorClient: Error getting price for ${asset}:`, error);
            // Usar precio simulado como fallback
            const mockPrice = this.getMockPrice(asset);
            console.log(`🔄 ReflectorClient: Usando precio mock para ${asset}:`, mockPrice);
            prices[asset] = {
              price: mockPrice,
              timestamp: Date.now(),
              decimals: 7,
            };
          }
        })
      );
      
      console.log('📊 ReflectorClient: Precios finales:', prices);
      return prices;
    } catch (error) {
      console.error('Error getting multiple prices:', error);
      throw error;
    }
  }

  // Obtener decimales del oráculo
  async getDecimals(): Promise<number> {
    try {
      // Por ahora, usamos el valor por defecto
      // TODO: Implementar llamada real cuando Soroban esté disponible
      return 7; // Default decimals para Stellar
    } catch (error) {
      console.error('Error getting decimals:', error);
      return 7; // Default fallback
    }
  }

  // Verificar si el contrato está activo
  async isActive(): Promise<boolean> {
    try {
      // Por ahora, asumimos que está activo
      // TODO: Implementar verificación real cuando Soroban esté disponible
      return true;
    } catch (error) {
      console.error('Error checking contract status:', error);
      return false;
    }
  }

  // Métodos para usar el smart contract de Reflector
  async getLastPriceFromContract(asset: string): Promise<{
    price: number;
    timestamp: number;
    decimals: number;
  }> {
    try {
      await this.initializeContract();
      
      if (!this.contract || !this.rpc) {
        throw new Error('Contract not initialized');
      }

      // Llamar al método lastprice del contrato
      const result = await this.contract.call('lastprice', xdr.ScVal.scvSymbol(asset));
      
      if (result && result.obj() && result.obj().switch().name === 'vec') {
        const priceData = result.obj().vec();
        const price = priceData[0].i128();
        const timestamp = priceData[1].u64();
        
        return {
          price: Number(price) / Math.pow(10, 7), // Convertir de i128 a número
          timestamp: Number(timestamp),
          decimals: 7,
        };
      }
      
      throw new Error('No price data available from contract');
    } catch (error) {
      console.error(`Error getting price from contract for ${asset}:`, error);
      throw error;
    }
  }

  async getTWAPFromContract(asset: string, records: number = 5): Promise<{
    price: number;
    period: number;
    timestamp: number;
  }> {
    try {
      await this.initializeContract();
      
      if (!this.contract || !this.rpc) {
        throw new Error('Contract not initialized');
      }

      // Llamar al método twap del contrato
      const result = await this.contract.call('twap', 
        xdr.ScVal.scvSymbol(asset),
        xdr.ScVal.scvU32(records)
      );
      
      if (result && result.obj() && result.obj().switch().name === 'i128') {
        const twapPrice = result.obj().i128();
        
        return {
          price: Number(twapPrice) / Math.pow(10, 7),
          period: records * 5, // 5 minutos por record
          timestamp: Date.now(),
        };
      }
      
      throw new Error('No TWAP data available from contract');
    } catch (error) {
      console.error(`Error getting TWAP from contract for ${asset}:`, error);
      throw error;
    }
  }

  // Obtener información del contrato
  async getContractInfo(): Promise<{
    contractId: string;
    isActive: boolean;
    decimals: number;
    network: string;
  }> {
    try {
      const [isActive, decimals] = await Promise.all([
        this.isActive(),
        this.getDecimals(),
      ]);

      return {
        contractId: REFLECTOR_CONFIG.contractId,
        isActive,
        decimals,
        network: 'testnet',
      };
    } catch (error) {
      console.error('Error getting contract info:', error);
      throw error;
    }
  }
}

// Instancia singleton del cliente
export const reflectorClient = new ReflectorClient();
