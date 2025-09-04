import { STELLAR_CONFIG, REFLECTOR_CONFIG } from './stellar';
import { reflectorClient } from './reflector-client';

// Interfaz para los datos de precio de Reflector
export interface ReflectorPriceData {
  asset: string;
  price: number;
  timestamp: number;
  source: string;
  confidence: number;
}

// Interfaz para la configuración del oráculo
export interface OracleConfig {
  asset: string;
  updateInterval: number;
  minConfidence: number;
}

// Clase principal para interactuar con Reflector
export class ReflectorService {
  private isInitialized: boolean = false;

  constructor() {
    // Constructor simplificado
  }

  // Inicializar el servicio
  async initialize(): Promise<void> {
    try {
      // Verificar si el contrato de Reflector está activo
      const contractInfo = await reflectorClient.getContractInfo();
      
      if (contractInfo.isActive) {
        this.isInitialized = true;
        console.log('Reflector service initialized successfully with real contract');
        console.log('Contract info:', contractInfo);
      } else {
        throw new Error('Reflector contract is not active');
      }
    } catch (error) {
      console.error('Failed to initialize Reflector service:', error);
      // Fallback a modo mock si hay error
      this.isInitialized = true;
      console.log('Reflector service initialized in fallback mode');
    }
  }

  // Obtener precio de un activo
  async getPrice(asset: string): Promise<ReflectorPriceData | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Intentar obtener precio real del contrato
      const priceData = await reflectorClient.getLastPrice(asset);
      
      return {
        asset,
        price: priceData.price,
        timestamp: priceData.timestamp,
        source: 'reflector-network',
        confidence: 0.98, // Alta confianza para datos reales
      };
    } catch (error) {
      console.error(`Error getting real price for ${asset}:`, error);
      
      // Fallback a precio simulado
      const mockPrice = this.getMockPrice(asset);
      return {
        asset,
        price: mockPrice,
        timestamp: Date.now(),
        source: 'reflector-mock',
        confidence: 0.85,
      };
    }
  }

  // Obtener precios de múltiples activos usando la API real de Reflector
  async getPrices(assets: string[]): Promise<ReflectorPriceData[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('🔍 ReflectorService: Obteniendo precios para activos:', assets);
      
      // Usar la nueva función para obtener múltiples precios en paralelo
      const priceData = await reflectorClient.getMultiplePrices(assets);
      
      console.log('📊 ReflectorService: Datos recibidos del cliente:', priceData);
      
      // Convertir a formato ReflectorPriceData
      const prices: ReflectorPriceData[] = Object.entries(priceData).map(([asset, data]) => ({
        asset,
        price: data.price,
        timestamp: data.timestamp,
        source: 'reflector-network',
        confidence: 0.98,
      }));
      
      console.log('✅ ReflectorService: Precios procesados:', prices);
      return prices;
    } catch (error) {
      console.error('Error getting multiple prices from Reflector:', error);
      
      // Fallback a obtener precios individuales
      const prices: ReflectorPriceData[] = [];
      for (const asset of assets) {
        const price = await this.getPrice(asset);
        if (price) {
          prices.push(price);
        }
      }
      
      return prices;
    }
  }

  // Obtener precio en tiempo real (con polling)
  async getRealTimePrice(asset: string, callback: (price: ReflectorPriceData) => void): Promise<() => void> {
    const interval = setInterval(async () => {
      const price = await this.getPrice(asset);
      if (price) {
        callback(price);
      }
    }, 5000); // Actualizar cada 5 segundos

    // Retornar función para limpiar el intervalo
    return () => clearInterval(interval);
  }

  // Verificar estado del oráculo usando datos reales de Reflector
  async getOracleStatus(): Promise<{
    isActive: boolean;
    lastUpdate: number;
    totalFeeds: number;
  }> {
    try {
      // Obtener información real del contrato de Reflector
      const contractInfo = await reflectorClient.getContractInfo();
      
      return {
        isActive: contractInfo.isActive,
        lastUpdate: Date.now(), // TODO: Obtener timestamp real del último update
        totalFeeds: 10, // TODO: Obtener número real de feeds disponibles
      };
    } catch (error) {
      console.error('Error getting oracle status from Reflector:', error);
      
      // Fallback a estado simulado
      return {
        isActive: true,
        lastUpdate: Date.now(),
        totalFeeds: 10,
      };
    }
  }

  // Obtener feeds de precios disponibles
  async getAvailableFeeds(): Promise<string[]> {
    return [
      'XLM/USDC',
      'BTC/USDC',
      'ETH/USDC',
      'SOL/USDC',
      'ADA/USDC',
      'DOT/USDC',
      'LINK/USDC',
      'MATIC/USDC',
      'AVAX/USDC',
      'UNI/USDC',
    ];
  }

  // Obtener TWAP (Time Weighted Average Price)
  async getTWAP(asset: string, period: number = 5): Promise<{
    asset: string;
    price: number;
    period: number;
    timestamp: number;
    source: string;
  }> {
    try {
      const twapData = await reflectorClient.getTWAP(asset, period);
      
      return {
        asset,
        price: twapData.price,
        period: twapData.period,
        timestamp: twapData.timestamp,
        source: 'reflector-network',
      };
    } catch (error) {
      console.error(`Error getting TWAP for ${asset}:`, error);
      
      // Fallback a precio normal
      const priceData = await this.getPrice(asset);
      return {
        asset,
        price: priceData?.price || 0,
        period,
        timestamp: Date.now(),
        source: 'reflector-mock',
      };
    }
  }

  // Obtener información del feed de precios
  async getPriceFeedInfo(asset: string): Promise<{
    asset: string;
    price: number;
    lastUpdate: number;
    confidence: number;
    source: string;
  }> {
    const priceData = await this.getPrice(asset);
    const price = priceData?.price || 0;
    
    return {
      asset,
      price,
      lastUpdate: priceData?.timestamp || Date.now(),
      confidence: priceData?.confidence || 0.85,
      source: priceData?.source || 'reflector-mock',
    };
  }

  // Precios simulados mejorados basados en datos reales de mercado
  private getMockPrice(asset: string): number {
    const basePrices: { [key: string]: number } = {
      'XLM': 0.1234,
      'BTC': 43250.50,
      'ETH': 2650.75,
      'SOL': 98.25,
      'ADA': 0.48,
      'USDC': 1.00,
    };

    const basePrice = basePrices[asset] || 0;
    
    // Simular volatilidad del mercado
    const volatility = 0.02; // 2% de volatilidad
    const randomChange = (Math.random() - 0.5) * volatility;
    
    return basePrice * (1 + randomChange);
  }

  // Calcular funding rate basado en la diferencia spot-futures
  calculateFundingRate(spotPrice: number, futuresPrice: number, volatility: number = 0.1): number {
    const priceDifference = (futuresPrice - spotPrice) / spotPrice;
    const baseRate = 0.0001; // 0.01% base rate
    const volatilityAdjustment = volatility * 0.001; // Ajuste por volatilidad
    
    return baseRate + (priceDifference * 0.1) + volatilityAdjustment;
  }
}
