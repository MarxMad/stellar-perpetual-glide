// Perpetual Futures Contract Client
// Handles interaction with the deployed Stellar smart contract

import { Contract, Soroban, Address, xdr } from '@stellar/stellar-sdk';

export interface PositionData {
  margin: number;
  leverage: number;
  positionSize: number;
  isLong: boolean;
  entryPrice: number;
  timestamp: number;
  isActive: boolean;
}

export interface ContractConfig {
  contractId: string;
  rpcUrl: string;
  networkPassphrase: string;
  contractBalance: number;
}

export class PerpetualContractClient {
  private contract: Contract;
  private rpc: any;
  private networkPassphrase: string;

  constructor(
    contractId: string,
    rpcUrl: string,
    networkPassphrase: string
  ) {
    this.contract = new Contract(contractId);
    this.rpc = new Soroban.Server(rpcUrl);
    this.networkPassphrase = networkPassphrase;
  }

  // Deposit XLM to the contract for margin
  async depositXlm(traderAddress: string, amount: number): Promise<boolean> {
    try {
      const trader = Address.fromString(traderAddress);
      const amountStroops = Math.floor(amount * 10_000_000); // Convert XLM to stroops

      const operation = this.contract.call(
        'deposit_xlm',
        xdr.ScVal.scvAddress(trader.toScAddress()),
        xdr.ScVal.scvI128(xdr.Int128.fromString(amountStroops.toString()))
      );

      const result = await this.rpc.sendTransaction(operation, {
        networkPassphrase: this.networkPassphrase,
      });

      return result.successful;
    } catch (error) {
      console.error('Error depositing XLM:', error);
      return false;
    }
  }

  // Open a new position
  async openPosition(
    traderAddress: string,
    assetSymbol: string,
    marginAmount: number,
    leverage: number,
    isLong: boolean
  ): Promise<number> {
    try {
      const trader = Address.fromString(traderAddress);
      const asset = xdr.ScVal.scvSymbol(assetSymbol);
      const marginStroops = Math.floor(marginAmount * 10_000_000);
      const leverageVal = xdr.ScVal.scvU32(leverage);
      const isLongVal = xdr.ScVal.scvBool(isLong);

      const operation = this.contract.call(
        'open_position',
        xdr.ScVal.scvAddress(trader.toScAddress()),
        asset,
        xdr.ScVal.scvI128(xdr.Int128.fromString(marginStroops.toString())),
        leverageVal,
        isLongVal
      );

      const result = await this.rpc.sendTransaction(operation, {
        networkPassphrase: this.networkPassphrase,
      });

      if (result.successful) {
        // Extract position ID from result
        return 1; // Placeholder - would extract from result
      }
      return 0;
    } catch (error) {
      console.error('Error opening position:', error);
      return 0;
    }
  }

  // Close an existing position
  async closePosition(traderAddress: string, positionId: number): Promise<number> {
    try {
      const trader = Address.fromString(traderAddress);
      const positionIdVal = xdr.ScVal.scvU64(xdr.Uint64.fromString(positionId.toString()));

      const operation = this.contract.call(
        'close_position',
        xdr.ScVal.scvAddress(trader.toScAddress()),
        positionIdVal
      );

      const result = await this.rpc.sendTransaction(operation, {
        networkPassphrase: this.networkPassphrase,
      });

      if (result.successful) {
        // Extract PnL from result
        return 0; // Placeholder - would extract from result
      }
      return 0;
    } catch (error) {
      console.error('Error closing position:', error);
      return 0;
    }
  }

  // Withdraw XLM from the contract
  async withdrawXlm(traderAddress: string, amount: number): Promise<boolean> {
    try {
      const trader = Address.fromString(traderAddress);
      const amountStroops = Math.floor(amount * 10_000_000);

      const operation = this.contract.call(
        'withdraw_xlm',
        xdr.ScVal.scvAddress(trader.toScAddress()),
        xdr.ScVal.scvI128(xdr.Int128.fromString(amountStroops.toString()))
      );

      const result = await this.rpc.sendTransaction(operation, {
        networkPassphrase: this.networkPassphrase,
      });

      return result.successful;
    } catch (error) {
      console.error('Error withdrawing XLM:', error);
      return false;
    }
  }

  // Get trader's XLM balance
  async getTraderBalance(traderAddress: string): Promise<number> {
    try {
      const trader = Address.fromString(traderAddress);
      
      const result = await this.contract.call(
        'get_trader_balance',
        xdr.ScVal.scvAddress(trader.toScAddress())
      );

      // Extract balance from result
      return 0; // Placeholder - would extract from result
    } catch (error) {
      console.error('Error getting trader balance:', error);
      return 0;
    }
  }

  // Get current position data
  async getCurrentPosition(traderAddress: string): Promise<PositionData | null> {
    try {
      const trader = Address.fromString(traderAddress);
      
      const result = await this.contract.call(
        'get_current_position',
        xdr.ScVal.scvAddress(trader.toScAddress())
      );

      // Extract position data from result
      return null; // Placeholder - would extract from result
    } catch (error) {
      console.error('Error getting current position:', error);
      return null;
    }
  }

  // Get contract configuration
  async getConfig(): Promise<ContractConfig> {
    try {
      const result = await this.contract.call('get_config');

      // Extract config from result
      return {
        contractId: this.contract.contractId,
        rpcUrl: this.rpc.serverURL,
        networkPassphrase: this.networkPassphrase,
        contractBalance: 0 // Placeholder
      };
    } catch (error) {
      console.error('Error getting config:', error);
      return {
        contractId: this.contract.contractId,
        rpcUrl: this.rpc.serverURL,
        networkPassphrase: this.networkPassphrase,
        contractBalance: 0
      };
    }
  }
}

// Testnet configuration
export const TESTNET_CONFIG = {
  priceOracleContractId: 'CAYMTS6FAAYPCYUSMGRIIHSRBLTWB53EYPMANEV6UZMHE4VIBINF52TD',
  perpetualTradingContractId: 'CBCKPEPZZ6H66555PB7ZR3YQNX2GBHR4VFP7NZIV4KZ36345YFZXEZE2',
  rpcUrl: 'https://soroban-testnet.stellar.org:443',
  networkPassphrase: 'Test SDF Network ; September 2015'
};

// Create testnet trading client
export const testnetTradingClient = new PerpetualContractClient(
  TESTNET_CONFIG.perpetualTradingContractId,
  TESTNET_CONFIG.rpcUrl,
  TESTNET_CONFIG.networkPassphrase
);

// Factory function to create client
export function createPerpetualContractClient(
  contractId: string,
  rpcUrl: string,
  networkPassphrase: string
): PerpetualContractClient {
  return new PerpetualContractClient(contractId, rpcUrl, networkPassphrase);
}
