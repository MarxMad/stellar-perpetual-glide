// Cliente para el Perpetual Trading Contract modificado
import { SorobanRpc, Address, xdr, Contract, Networks } from '@stellar/stellar-sdk';

// Configuración del contrato en testnet
const PERPETUAL_CONTRACT_ID = 'CAPQ332GONME6T2EKRWQG4PEASJL6362KSFU33W7U4EEMOZC5CK6MNAI';
const RPC_URL = 'https://soroban-testnet.stellar.org:443';
const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';

export interface Position {
  trader: string;
  margin: number;
  leverage: number;
  size: number;
  side: number; // 1 = long, -1 = short
  entryPrice: number;
  timestamp: number;
  isActive: number;
}

export interface ContractStats {
  totalBalance: number;
  nextPositionId: number;
  isActive: boolean;
}

export class PerpetualTradingClient {
  private rpcUrl: string;
  private contractId: string;
  private networkPassphrase: string;

  constructor() {
    this.rpcUrl = RPC_URL;
    this.contractId = PERPETUAL_CONTRACT_ID;
    this.networkPassphrase = NETWORK_PASSPHRASE;
  }

  // Inicializar el contrato
  async initialize(adminAddress: string, priceOracleAddress: string): Promise<boolean> {
    try {
      console.log('🔧 Inicializando contrato de trading...');
      
      const server = new SorobanRpc.Server(this.rpcUrl);
      const contract = new Contract(this.contractId);
      
      const result = await contract.call(
        server,
        'initialize',
        Address.fromString(adminAddress).toScVal(),
        Address.fromString(priceOracleAddress).toScVal()
      );

      console.log('✅ Contrato inicializado:', result);
      return true;
    } catch (error) {
      console.error('❌ Error inicializando contrato:', error);
      throw error;
    }
  }

  // Abrir posición con transferencia directa de XLM
  async openPosition(
    traderAddress: string,
    marginAmount: number, // en stroops (1 XLM = 10,000,000 stroops)
    leverage: number,
    isLong: boolean
  ): Promise<number> {
    try {
      console.log(`🚀 Abriendo posición: ${marginAmount / 10_000_000} XLM, ${leverage}x, ${isLong ? 'LONG' : 'SHORT'}`);
      
      const server = new SorobanRpc.Server(this.rpcUrl);
      const contract = new Contract(this.contractId);
      
      const result = await contract.call(
        server,
        'open_position',
        Address.fromString(traderAddress).toScVal(),
        xdr.ScVal.scvI128(xdr.Int128Parts.fromString(marginAmount.toString())),
        xdr.ScVal.scvU32(leverage),
        xdr.ScVal.scvBool(isLong)
      );

      const positionId = this.parseU64(result);
      console.log('✅ Posición abierta con ID:', positionId);
      return positionId;
    } catch (error) {
      console.error('❌ Error abriendo posición:', error);
      throw error;
    }
  }

  // Cerrar posición y recibir XLM + PnL
  async closePosition(traderAddress: string, positionId: number): Promise<number> {
    try {
      console.log(`🔒 Cerrando posición ${positionId}...`);
      
      const server = new SorobanRpc.Server(this.rpcUrl);
      const contract = new Contract(this.contractId);
      
      const result = await contract.call(
        server,
        'close_position',
        Address.fromString(traderAddress).toScVal(),
        xdr.ScVal.scvU64(xdr.Uint64.fromString(positionId.toString()))
      );

      const pnl = this.parseI128(result);
      console.log('✅ Posición cerrada, PnL:', pnl / 10_000_000, 'XLM');
      return pnl;
    } catch (error) {
      console.error('❌ Error cerrando posición:', error);
      throw error;
    }
  }

  // Obtener posición actual
  async getCurrentPosition(): Promise<Position> {
    try {
      console.log('📊 Obteniendo posición actual...');
      
      const server = new SorobanRpc.Server(this.rpcUrl);
      const contract = new Contract(this.contractId);
      
      const result = await contract.call(server, 'get_current_position');
      
      // Parsear resultado como tupla
      const values = this.parseTuple(result);
      const position: Position = {
        trader: this.parseAddress(values[0]),
        margin: this.parseI128(values[1]),
        leverage: this.parseI128(values[2]),
        size: this.parseI128(values[3]),
        side: this.parseI128(values[4]),
        entryPrice: this.parseI128(values[5]),
        timestamp: this.parseI128(values[6]),
        isActive: this.parseI128(values[7])
      };

      console.log('✅ Posición actual obtenida:', position);
      return position;
    } catch (error) {
      console.error('❌ Error obteniendo posición actual:', error);
      throw error;
    }
  }

  // Obtener posiciones del trader
  async getTraderPositions(traderAddress: string): Promise<number[]> {
    try {
      console.log(`📋 Obteniendo posiciones de ${traderAddress}...`);
      
      const server = new SorobanRpc.Server(this.rpcUrl);
      const contract = new Contract(this.contractId);
      
      const result = await contract.call(
        server,
        'get_trader_positions',
        Address.fromString(traderAddress).toScVal()
      );

      const positions = this.parseVecU64(result);
      console.log('✅ Posiciones obtenidas:', positions);
      return positions;
    } catch (error) {
      console.error('❌ Error obteniendo posiciones:', error);
      throw error;
    }
  }

  // Obtener estadísticas del contrato
  async getContractStats(): Promise<ContractStats> {
    try {
      console.log('📈 Obteniendo estadísticas del contrato...');
      
      const server = new SorobanRpc.Server(this.rpcUrl);
      const contract = new Contract(this.contractId);
      
      const result = await contract.call(server, 'get_contract_stats');
      
      const values = this.parseTuple(result);
      const stats: ContractStats = {
        totalBalance: this.parseI128(values[0]),
        nextPositionId: this.parseU64(values[1]),
        isActive: this.parseBool(values[2])
      };

      console.log('✅ Estadísticas obtenidas:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  // Obtener balance del contrato
  async getContractBalance(): Promise<number> {
    try {
      console.log('💰 Obteniendo balance del contrato...');
      
      const server = new SorobanRpc.Server(this.rpcUrl);
      const contract = new Contract(this.contractId);
      
      const result = await contract.call(server, 'get_contract_balance');
      const balance = this.parseI128(result);
      
      console.log('✅ Balance del contrato:', balance / 10_000_000, 'XLM');
      return balance;
    } catch (error) {
      console.error('❌ Error obteniendo balance:', error);
      throw error;
    }
  }

  // Retirar balance del contrato (solo admin)
  async withdrawContractBalance(adminAddress: string, amount: number): Promise<boolean> {
    try {
      console.log(`💸 Retirando ${amount / 10_000_000} XLM del contrato...`);
      
      const server = new SorobanRpc.Server(this.rpcUrl);
      const contract = new Contract(this.contractId);
      
      const result = await contract.call(
        server,
        'withdraw_contract_balance',
        Address.fromString(adminAddress).toScVal(),
        xdr.ScVal.scvI128(xdr.Int128Parts.fromString(amount.toString()))
      );

      const success = this.parseBool(result);
      console.log('✅ Retiro exitoso:', success);
      return success;
    } catch (error) {
      console.error('❌ Error retirando balance:', error);
      throw error;
    }
  }

  // Pausar contrato (solo admin)
  async pauseContract(adminAddress: string): Promise<boolean> {
    try {
      console.log('⏸️ Pausando contrato...');
      
      const server = new SorobanRpc.Server(this.rpcUrl);
      const contract = new Contract(this.contractId);
      
      await contract.call(server, 'pause_contract', Address.fromString(adminAddress).toScVal());
      
      console.log('✅ Contrato pausado');
      return true;
    } catch (error) {
      console.error('❌ Error pausando contrato:', error);
      throw error;
    }
  }

  // Reanudar contrato (solo admin)
  async resumeContract(adminAddress: string): Promise<boolean> {
    try {
      console.log('▶️ Reanudando contrato...');
      
      const server = new SorobanRpc.Server(this.rpcUrl);
      const contract = new Contract(this.contractId);
      
      await contract.call(server, 'resume_contract', Address.fromString(adminAddress).toScVal());
      
      console.log('✅ Contrato reanudado');
      return true;
    } catch (error) {
      console.error('❌ Error reanudando contrato:', error);
      throw error;
    }
  }

  // Funciones auxiliares para parsear resultados
  private parseU64(scVal: xdr.ScVal): number {
    return parseInt(scVal.u64().toString());
  }

  private parseI128(scVal: xdr.ScVal): number {
    return parseInt(scVal.i128().toString());
  }

  private parseBool(scVal: xdr.ScVal): boolean {
    return scVal.b();
  }

  private parseAddress(scVal: xdr.ScVal): string {
    return scVal.address().toString();
  }

  private parseTuple(scVal: xdr.ScVal): xdr.ScVal[] {
    return scVal.vec();
  }

  private parseVecU64(scVal: xdr.ScVal): number[] {
    return scVal.vec().map(v => this.parseU64(v));
  }
}

// Instancia singleton
export const perpetualTradingClient = new PerpetualTradingClient();
