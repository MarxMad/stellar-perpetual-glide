import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface WalletInfo {
  publicKey: string;
  walletId: string;
  network: string;
  balance?: number;
}

interface WalletContextType {
  walletInfo: WalletInfo | null;
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnecting: boolean;
  error: string | null;
  kitLoaded: boolean;
  kit: any;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  updateBalance: () => Promise<void>;
  clearError: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kitLoaded, setKitLoaded] = useState(false);
  const [kit, setKit] = useState<any>(null);

  // Cargar el kit de forma segura
  useEffect(() => {
    let isMounted = true;
    
    const loadKit = async () => {
      try {
        const kitModule = await import("@creit.tech/stellar-wallets-kit");
        if (isMounted) {
          setKit(kitModule);
          setKitLoaded(true);
        }
      } catch (error) {
        console.error('Error loading StellarWalletsKit:', error);
        if (isMounted) {
          setError('Error loading wallet kit');
        }
      }
    };

    loadKit();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Obtener balance de XLM
  const getBalance = useCallback(async (publicKey: string) => {
    try {
      const response = await fetch(`https://horizon-testnet.stellar.org/accounts/${publicKey}`);
      const data = await response.json();
      const xlmBalance = data.balances.find((b: any) => b.asset_type === 'native');
      return xlmBalance ? parseFloat(xlmBalance.balance) : 0;
    } catch (error) {
      console.error('Error getting balance:', error);
      return 0;
    }
  }, []);

  // Conectar wallet real
  const connect = useCallback(async () => {
    if (!kit || isConnecting) {
      console.log('Kit not loaded or already connecting');
      return;
    }
    
    try {
      console.log('Starting wallet connection...');
      setIsConnecting(true);
      setError(null);
      
      // Usar StellarWalletsKit real
      const { StellarWalletsKit, allowAllModules, FREIGHTER_ID, WalletNetwork } = kit;
      
      const kitInstance = new StellarWalletsKit({
        network: WalletNetwork.TESTNET,
        selectedWalletId: FREIGHTER_ID,
        modules: allowAllModules(),
      });

      console.log('Kit instance created, opening modal...');

      // Conectar con Freighter - usar el método correcto
      await kitInstance.openModal({
        onWalletSelected: async (option: any) => {
          try {
            console.log('Wallet selected:', option);
            
            // Establecer la wallet seleccionada
            await kitInstance.setWallet(option.id);
            
            // Obtener la dirección pública usando la API correcta
            const { address } = await kitInstance.getAddress();
            
            console.log('Wallet connected, address:', address);
            
            // Obtener balance
            const balance = await getBalance(address);
            
            setWalletInfo({
              publicKey: address,
              walletId: option.id,
              network: 'testnet',
              balance
            });
            
            // Cerrar el modal después de conectar exitosamente
            kitInstance.closeModal();
            
          } catch (err) {
            console.error('Error in wallet selection:', err);
            setError(err instanceof Error ? err.message : 'Error connecting wallet');
          }
        }
      });

      console.log('Modal opened successfully');

    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err instanceof Error ? err.message : 'Error connecting wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [kit, isConnecting, getBalance]);

  // Desconectar wallet
  const disconnect = useCallback(async () => {
    if (isDisconnecting) return;
    
    try {
      setIsDisconnecting(true);
      setError(null);
      setWalletInfo(null);
      console.log('Wallet disconnected');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error disconnecting wallet');
    } finally {
      setIsDisconnecting(false);
    }
  }, [isDisconnecting]);

  // Actualizar balance
  const updateBalance = useCallback(async () => {
    if (!walletInfo?.publicKey) return;
    
    try {
      const balance = await getBalance(walletInfo.publicKey);
      setWalletInfo(prev => prev ? { ...prev, balance } : null);
    } catch (err) {
      console.error('Error updating balance:', err);
    }
  }, [walletInfo?.publicKey, getBalance]);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isConnected = !!walletInfo;
  
  console.log('WalletContext state:', { 
    walletInfo, 
    isConnected, 
    hasPublicKey: !!walletInfo?.publicKey,
    hasBalance: !!walletInfo?.balance 
  });

  const value: WalletContextType = {
    walletInfo,
    isConnected,
    isConnecting,
    isDisconnecting,
    error,
    kitLoaded,
    kit,
    connect,
    disconnect,
    updateBalance,
    clearError,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
