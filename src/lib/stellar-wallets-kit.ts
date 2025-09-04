import {
  allowAllModules,
  FREIGHTER_ID,
  StellarWalletsKit,
} from "@creit.tech/stellar-wallets-kit";
import { STELLAR_CONFIG } from "./stellar";

const SELECTED_WALLET_ID = "selectedWalletId";

function getSelectedWalletId() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(SELECTED_WALLET_ID);
  }
  return null;
}

let kit: StellarWalletsKit | null = null;

function getKit() {
  if (!kit && typeof window !== 'undefined') {
    kit = new StellarWalletsKit({
      modules: allowAllModules(),
      network: 'testnet' as any, // Usar testnet por defecto
      // StellarWalletsKit forces you to specify a wallet, even if the user didn't
      // select one yet, so we default to Freighter.
      // We'll work around this later in `getPublicKey`.
      selectedWalletId: getSelectedWalletId() ?? FREIGHTER_ID,
    });
  }
  return kit;
}

export const signTransaction = (transaction: any) => {
  const kitInstance = getKit();
  if (!kitInstance) throw new Error('StellarWalletsKit not initialized');
  return kitInstance.signTransaction(transaction);
};

export async function getPublicKey() {
  if (!getSelectedWalletId()) return null;
  try {
    const kitInstance = getKit();
    if (!kitInstance) return null;
    const { address } = await kitInstance.getAddress();
    return address;
  } catch (error) {
    console.error('Error getting public key:', error);
    return null;
  }
}

export async function setWallet(walletId: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SELECTED_WALLET_ID, walletId);
  }
  const kitInstance = getKit();
  if (kitInstance) {
    kitInstance.setWallet(walletId);
  }
}

export async function disconnect(callback?: () => Promise<void>) {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SELECTED_WALLET_ID);
  }
  const kitInstance = getKit();
  if (kitInstance) {
    kitInstance.disconnect();
  }
  if (callback) await callback();
}

export async function connect(callback?: () => Promise<void>) {
  try {
    const kitInstance = getKit();
    if (!kitInstance) throw new Error('StellarWalletsKit not initialized');
    
    await kitInstance.openModal({
      onWalletSelected: async (option) => {
        try {
          await setWallet(option.id);
          if (callback) await callback();
        } catch (e) {
          console.error('Error setting wallet:', e);
        }
        return option.id;
      },
    });
  } catch (error) {
    console.error('Error connecting wallet:', error);
  }
}

export async function isConnected(): Promise<boolean> {
  try {
    const publicKey = await getPublicKey();
    return publicKey !== null;
  } catch {
    return false;
  }
}

export async function getWalletInfo() {
  try {
    const publicKey = await getPublicKey();
    if (!publicKey) return null;
    
    const selectedWalletId = getSelectedWalletId();
    if (!selectedWalletId) return null;
    
    return {
      publicKey,
      walletId: selectedWalletId,
      network: 'testnet', // Por ahora hardcodeado a testnet
    };
  } catch (error) {
    console.error('Error getting wallet info:', error);
    return null;
  }
}



export { getKit };
