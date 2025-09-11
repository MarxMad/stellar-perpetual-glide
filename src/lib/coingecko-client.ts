// Cliente para obtener precios desde CoinGecko API
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export interface CoinGeckoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

export class CoinGeckoClient {
  private apiUrl: string;

  constructor() {
    this.apiUrl = COINGECKO_API_URL;
  }

  // Obtener precio de XLM desde CoinGecko
  async getXlmPrice(): Promise<number> {
    try {
      console.log('🔍 Obteniendo precio de XLM desde CoinGecko...');
      
      const response = await fetch(`${this.apiUrl}/simple/price?ids=stellar&vs_currencies=usd&include_24hr_change=true`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Respuesta de CoinGecko:', data);

      if (data.stellar && data.stellar.usd) {
        const price = data.stellar.usd;
        console.log('✅ Precio de XLM obtenido (CoinGecko):', price);
        return price;
      }

      throw new Error('No se encontró el precio de XLM en la respuesta');
    } catch (error) {
      console.error('❌ Error obteniendo precio de XLM desde CoinGecko:', error);
      throw error;
    }
  }

  // Obtener precio y cambio de 24h de XLM desde CoinGecko
  async getXlmPriceWithChange(): Promise<{ price: number; change24h: number }> {
    try {
      console.log('🔍 Obteniendo precio y cambio de XLM desde CoinGecko...');
      
      const response = await fetch(`${this.apiUrl}/simple/price?ids=stellar&vs_currencies=usd&include_24hr_change=true`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Respuesta de CoinGecko:', data);

      if (data.stellar && data.stellar.usd) {
        const price = data.stellar.usd;
        const change24h = data.stellar.usd_24h_change || 0;
        console.log('✅ Precio de XLM obtenido (CoinGecko):', price, 'Cambio 24h:', change24h);
        return { price, change24h };
      }

      throw new Error('No se encontró el precio de XLM en la respuesta');
    } catch (error) {
      console.error('❌ Error obteniendo precio de XLM desde CoinGecko:', error);
      throw error;
    }
  }

  // Obtener precio de cualquier criptomoneda
  async getPrice(coinId: string, vsCurrency: string = 'usd'): Promise<number> {
    try {
      console.log(`🔍 Obteniendo precio de ${coinId} desde CoinGecko...`);
      
      const response = await fetch(`${this.apiUrl}/simple/price?ids=${coinId}&vs_currencies=${vsCurrency}&include_24hr_change=true`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`📊 Respuesta de CoinGecko para ${coinId}:`, data);

      if (data[coinId] && data[coinId][vsCurrency]) {
        const price = data[coinId][vsCurrency];
        console.log(`✅ Precio de ${coinId} obtenido (CoinGecko):`, price);
        return price;
      }

      throw new Error(`No se encontró el precio de ${coinId} en la respuesta`);
    } catch (error) {
      console.error(`❌ Error obteniendo precio de ${coinId} desde CoinGecko:`, error);
      throw error;
    }
  }

  // Obtener múltiples precios a la vez
  async getMultiplePrices(coinIds: string[], vsCurrency: string = 'usd'): Promise<Record<string, number>> {
    try {
      console.log(`🔍 Obteniendo precios de ${coinIds.join(', ')} desde CoinGecko...`);
      
      const ids = coinIds.join(',');
      const response = await fetch(`${this.apiUrl}/simple/price?ids=${ids}&vs_currencies=${vsCurrency}&include_24hr_change=true`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Respuesta de CoinGecko (múltiples precios):', data);

      const prices: Record<string, number> = {};
      for (const coinId of coinIds) {
        if (data[coinId] && data[coinId][vsCurrency]) {
          prices[coinId] = data[coinId][vsCurrency];
        }
      }

      console.log('✅ Precios obtenidos (CoinGecko):', prices);
      return prices;
    } catch (error) {
      console.error('❌ Error obteniendo precios múltiples desde CoinGecko:', error);
      throw error;
    }
  }

  // Obtener información detallada de una criptomoneda
  async getCoinInfo(coinId: string): Promise<CoinGeckoPrice> {
    try {
      console.log(`🔍 Obteniendo información de ${coinId} desde CoinGecko...`);
      
      const response = await fetch(`${this.apiUrl}/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&per_page=1&page=1&sparkline=false`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`📊 Información de ${coinId} desde CoinGecko:`, data);

      if (data && data.length > 0) {
        console.log(`✅ Información de ${coinId} obtenida (CoinGecko):`, data[0]);
        return data[0];
      }

      throw new Error(`No se encontró información de ${coinId}`);
    } catch (error) {
      console.error(`❌ Error obteniendo información de ${coinId} desde CoinGecko:`, error);
      throw error;
    }
  }
}

// Instancia singleton
export const coinGeckoClient = new CoinGeckoClient();
