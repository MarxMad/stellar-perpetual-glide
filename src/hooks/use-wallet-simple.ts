import { useState, useEffect } from 'react';

export interface WalletInfo {
  publicKey: string;
  walletId: string;
  network: string;
}

// Importar StellarWalletsKit de forma segura
let StellarWalletsKit: any = null;
let allowAllModules: any = null;
let FREIGHTER_ID: any = null;

// Cargar el kit de forma asíncrona
const loadStellarWalletsKit = async () => {
  try {
    const kit = await import("@creit.tech/stellar-wallets-kit");
    StellarWalletsKit = kit.StellarWalletsKit;
    allowAllModules = kit.allowAllModules;
    FREIGHTER_ID = kit.FREIGHTER_ID;
    return true;
  } catch (error) {
    console.error('Error loading StellarWalletsKit:', error);
    return false;
  }
};

export const useWalletSimple = () => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kitLoaded, setKitLoaded] = useState(false);
  const [kit, setKit] = useState<any>(null);

  // Cargar el kit al montar el componente
  useEffect(() => {
    const loadKit = async () => {
      const loaded = await loadStellarWalletsKit();
      if (loaded) {
        try {
          const kitInstance = new StellarWalletsKit({
            modules: allowAllModules(),
            network: "Test SDF Network ; September 2015",
            selectedWalletId: FREIGHTER_ID,
          });
          setKit(kitInstance);
          setKitLoaded(true);
          
          // Verificar si hay una wallet conectada
          await checkConnection(kitInstance);
        } catch (err) {
          console.error('Error initializing StellarWalletsKit:', err);
          setError('Error initializing wallet kit');
        }
      } else {
        setError('Error loading wallet library');
      }
    };

    loadKit();
  }, []);

  // Verificar conexión existente
  const checkConnection = async (kitInstance: any) => {
    try {
      const selectedWalletId = localStorage.getItem('selectedWalletId');
      if (selectedWalletId) {
        kitInstance.setWallet(selectedWalletId);
        const { address } = await kitInstance.getAddress();
        if (address) {
          setWalletInfo({
            publicKey: address,
            walletId: selectedWalletId,
            network: 'testnet',
          });
        }
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
    }
  };

  // Conectar wallet
  const connect = async () => {
    if (!kitLoaded || !kit) {
      setError('Wallet kit not loaded');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      await kit.openModal({
        onWalletSelected: async (option: any) => {
          try {
            // Guardar la wallet seleccionada
            localStorage.setItem('selectedWalletId', option.id);
            kit.setWallet(option.id);
            
            // Obtener la dirección de la wallet
            const { address } = await kit.getAddress();
            
            const walletInfo: WalletInfo = {
              publicKey: address,
              walletId: option.id,
              network: 'testnet',
            };
            
            setWalletInfo(walletInfo);
          } catch (e) {
            console.error('Error setting wallet:', e);
            setError('Error connecting to wallet');
          }
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error opening wallet modal';
      setError(errorMessage);
      console.error('Error connecting wallet:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  // Desconectar wallet
  const disconnect = async () => {
    try {
      setIsDisconnecting(true);
      setError(null);

      if (kit) {
        kit.disconnect();
      }
      
      // Limpiar localStorage
      localStorage.removeItem('selectedWalletId');
      localStorage.removeItem('walletPublicKey');
      
      setWalletInfo(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error disconnecting wallet';
      setError(errorMessage);
      console.error('Error disconnecting wallet:', err);
    } finally {
      setIsDisconnecting(false);
    }
  };

  // Limpiar error
  const clearError = () => {
    setError(null);
  };

  return {
    walletInfo,
    isConnecting,
    isDisconnecting,
    error,
    isConnected: !!walletInfo,
    connect,
    disconnect,
    clearError,
  };
};
