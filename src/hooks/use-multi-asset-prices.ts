import { useState, useEffect, useCallback } from 'react';
import { coinGeckoClient } from '../lib/coingecko-client';

export interface MultiAssetPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: string;
  marketCap: string;
  lastUpdated: Date;
}

export interface MultiAssetPriceData {
  prices: MultiAssetPrice[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// Mapeo de símbolos a CoinGecko IDs
const ASSET_MAPPING: Record<string, string> = {
  'XLM': 'stellar',
  'USDC': 'usd-coin',
  'AQUA': 'aqua',
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'SOL': 'solana',
  'ADA': 'cardano',
  'DOT': 'polkadot',
  'MATIC': 'matic-network',
  'AVAX': 'avalanche-2',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'AAVE': 'aave',
  'SUSHI': 'sushi',
  'CRV': 'curve-dao-token',
  'COMP': 'compound-governance-token',
  'MKR': 'maker',
  'SNX': 'havven',
  'YFI': 'yearn-finance',
  '1INCH': '1inch',
  'BAT': 'basic-attention-token',
  'ZRX': '0x',
  'KNC': 'kyber-network-crystal',
  'REN': 'republic-protocol',
  'LRC': 'loopring',
  'OMG': 'omg',
  'REP': 'augur',
  'GNO': 'gnosis',
  'ANT': 'aragon',
  'STORJ': 'storj',
  'MANA': 'decentraland',
  'SAND': 'the-sandbox',
  'AXS': 'axie-infinity',
  'ENJ': 'enjincoin',
  'CHZ': 'chiliz',
  'FLOW': 'flow',
  'THETA': 'theta-token',
  'FIL': 'filecoin',
  'VET': 'vechain',
  'TRX': 'tron',
  'EOS': 'eos',
  'XTZ': 'tezos',
  'ATOM': 'cosmos',
  'ALGO': 'algorand',
  'NEAR': 'near',
  'FTM': 'fantom',
  'HBAR': 'hedera-hashgraph',
  'ICP': 'internet-computer',
  'APT': 'aptos',
  'SUI': 'sui',
  'SEI': 'sei-network',
  'TIA': 'celestia',
  'INJ': 'injective-protocol',
  'JUP': 'jupiter-exchange-solana',
  'WIF': 'dogwifcoin',
  'BONK': 'bonk',
  'PEPE': 'pepe',
  'SHIB': 'shiba-inu',
  'DOGE': 'dogecoin',
  'LTC': 'litecoin',
  'BCH': 'bitcoin-cash',
  'XRP': 'ripple',
  'USDT': 'tether',
  'DAI': 'dai',
  'BUSD': 'binance-usd',
  'TUSD': 'true-usd',
  'USDP': 'paxos-standard',
  'GUSD': 'gemini-dollar',
  'FRAX': 'frax',
  'LUSD': 'liquity-usd',
  'SUSD': 'nusd',
  'MIM': 'magic-internet-money',
  'UST': 'terrausd',
  'LUNC': 'terra-luna',
  'LUNA': 'terra-luna-2',
  'OSMO': 'osmosis',
  'JUNO': 'juno-network',
  'SCRT': 'secret',
  'AKT': 'akash-network',
  'REGEN': 'regen',
  'IOV': 'starname',
  'DVPN': 'sentinel',
  'BAND': 'band-protocol',
  'KAVA': 'kava',
  'BNB': 'binancecoin',
  'CAKE': 'pancakeswap-token',
  'BAKE': 'bakerytoken',
  'AUTO': 'auto',
  'ALPHA': 'alpha-finance',
  'BURGER': 'burger-swap',
  'DODO': 'dodo',
  'FOR': 'force-protocol',
  'HARD': 'hard-protocol',
  'KAVA': 'kava',
  'KEY': 'selfkey',
  'LINA': 'linear',
  'LIT': 'litentry',
  'LTO': 'lto-network',
  'MASK': 'mask-network',
  'MBOX': 'mobox',
  'MDX': 'mdex',
  'MIR': 'mirror-protocol',
  'MTL': 'metal',
  'NAFT': 'nafter',
  'NBS': 'new-bitshares',
  'NEAR': 'near',
  'NULS': 'nuls',
  'O3': 'o3-swap',
  'OM': 'mantra-dao',
  'ONE': 'harmony',
  'ONT': 'ontology',
  'OOKI': 'ooki',
  'PAXG': 'pax-gold',
  'POND': 'marlin',
  'POWR': 'power-ledger',
  'PROM': 'prometeus',
  'PSG': 'paris-saint-germain-fan-token',
  'QNT': 'quant-network',
  'QTUM': 'qtum',
  'RAD': 'radicle',
  'RARE': 'superrare',
  'REEF': 'reef',
  'REN': 'republic-protocol',
  'REQ': 'request-network',
  'RIF': 'rsk-infrastructure-framework',
  'RLC': 'iexec-rlc',
  'ROSE': 'oasis-network',
  'RSR': 'reserve-rights-token',
  'RUNE': 'thorchain',
  'RVN': 'ravencoin',
  'SAND': 'the-sandbox',
  'SFP': 'safemoon',
  'SKL': 'skale',
  'SLP': 'smooth-love-potion',
  'SNT': 'status',
  'SNX': 'havven',
  'SOL': 'solana',
  'SPELL': 'spell-token',
  'SRM': 'serum',
  'STG': 'stargate-finance',
  'STMX': 'storm',
  'STORJ': 'storj',
  'STPT': 'stpt',
  'STRAX': 'stratis',
  'STX': 'stacks',
  'SUN': 'sun-token',
  'SUPER': 'superfarm',
  'SUSHI': 'sushi',
  'SXP': 'swipe',
  'SYS': 'syscoin',
  'T': 'threshold-network-token',
  'TCT': 'tokenclub',
  'TFUEL': 'theta-fuel',
  'THETA': 'theta-token',
  'TKO': 'tokocrypto',
  'TLM': 'alien-worlds',
  'TNT': 'tierion',
  'TROY': 'troy',
  'TRU': 'truefi',
  'TRX': 'tron',
  'TRY': 'tryhards',
  'TUSD': 'true-usd',
  'TWT': 'trust-wallet-token',
  'UMA': 'uma',
  'UNFI': 'unifi-protocol-dao',
  'UNI': 'uniswap',
  'USDC': 'usd-coin',
  'USDP': 'paxos-standard',
  'USDT': 'tether',
  'UTK': 'utrust',
  'VAI': 'vai',
  'VET': 'vechain',
  'VIDT': 'vidt-dao',
  'VITE': 'vite',
  'VTHO': 'vethor-token',
  'WAXP': 'wax',
  'WBTC': 'wrapped-bitcoin',
  'WIN': 'wink',
  'WING': 'wing-finance',
  'WNXM': 'wrapped-nxm',
  'WOO': 'woo-network',
  'WRX': 'wazirx',
  'WTC': 'waltonchain',
  'XEM': 'nem',
  'XLM': 'stellar',
  'XMR': 'monero',
  'XRP': 'ripple',
  'XTZ': 'tezos',
  'XVG': 'verge',
  'XVS': 'venus',
  'XZC': 'zcoin',
  'YFI': 'yearn-finance',
  'YFII': 'yfii-finance',
  'YGG': 'yield-guild-games',
  'ZEC': 'zcash',
  'ZEN': 'horizen',
  'ZIL': 'zilliqa',
  'ZRX': '0x'
};

export const useMultiAssetPrices = (
  symbols: string[],
  autoRefresh: boolean = true,
  refreshInterval: number = 300000 // 5 minutos para evitar rate limiting
) => {
  const [priceData, setPriceData] = useState<MultiAssetPriceData>({
    prices: [],
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const getMultiAssetPrices = useCallback(async () => {
    try {
      setPriceData(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Limitar a los primeros 10 activos para evitar rate limiting
      const limitedSymbols = symbols.slice(0, 10);
      
      // Obtener IDs de CoinGecko para los símbolos
      const coinIds = limitedSymbols
        .map(symbol => ASSET_MAPPING[symbol.toUpperCase()])
        .filter(Boolean);
      
      if (coinIds.length === 0) {
        throw new Error('No se encontraron IDs de CoinGecko para los símbolos solicitados');
      }

      console.log('🔍 Obteniendo precios de múltiples activos desde CoinGecko:', coinIds);
      
      // Agregar delay para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Llamar a la API de CoinGecko
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          // Agregar timeout
          signal: AbortSignal.timeout(10000) // 10 segundos timeout
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Convertir respuesta a formato MultiAssetPrice
      const prices: MultiAssetPrice[] = limitedSymbols.map(symbol => {
        const coinId = ASSET_MAPPING[symbol.toUpperCase()];
        const coinData = data[coinId];
        
        if (coinData) {
          return {
            symbol: symbol.toUpperCase(),
            name: symbol.toUpperCase(), // Podríamos mapear nombres más descriptivos
            price: coinData.usd || 0,
            change24h: coinData.usd_24h_change || 0,
            volume24h: coinData.usd_24h_vol ? `$${(coinData.usd_24h_vol / 1000000).toFixed(1)}M` : '$0M',
            marketCap: coinData.usd_market_cap ? `$${(coinData.usd_market_cap / 1000000000).toFixed(1)}B` : '$0B',
            lastUpdated: new Date(),
          };
        }
        
        // Fallback si no se encuentra el precio
        return {
          symbol: symbol.toUpperCase(),
          name: symbol.toUpperCase(),
          price: 0,
          change24h: 0,
          volume24h: '$0M',
          marketCap: '$0B',
          lastUpdated: new Date(),
        };
      });

      console.log('✅ Precios de múltiples activos obtenidos:', prices);
      
      setPriceData({
        prices,
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
      });
      
      // Reset retry count on success
      setRetryCount(0);
      
    } catch (error) {
      console.error('❌ Error obteniendo precios de múltiples activos:', error);
      
      // Si es un error de rate limiting o recursos insuficientes, intentar retry
      if (retryCount < maxRetries && (
        error instanceof Error && (
          error.message.includes('ERR_INSUFFICIENT_RESOURCES') ||
          error.message.includes('429') ||
          error.message.includes('rate limit')
        )
      )) {
        const delay = Math.pow(2, retryCount) * 1000; // Backoff exponencial
        console.log(`🔄 Reintentando en ${delay}ms (intento ${retryCount + 1}/${maxRetries})`);
        
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          getMultiAssetPrices();
        }, delay);
        return;
      }
      
      setPriceData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      }));
      setRetryCount(0); // Reset retry count on final failure
    }
  }, [symbols, retryCount, maxRetries]);

  useEffect(() => {
    if (autoRefresh && symbols.length > 0) {
      getMultiAssetPrices();
      const interval = setInterval(() => {
        getMultiAssetPrices();
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, getMultiAssetPrices]);

  return {
    ...priceData,
    getMultiAssetPrices,
    clearError: () => setPriceData(prev => ({ ...prev, error: null })),
  };
};
