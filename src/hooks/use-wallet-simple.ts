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

// Variable global para evitar múltiples instancias
let globalKit: any = null;
let globalKitLoaded = false;
let globalLoading = false;

export const useWalletSimple = () => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kitLoaded, setKitLoaded] = useState(globalKitLoaded);
  const [kit, setKit] = useState<any>(globalKit);

  // Cargar el kit al montar el componente (solo una vez)
  useEffect(() => {
    let isMounted = true;
    
    const loadKit = async () => {
      // Prevenir múltiples cargas
      if (globalKitLoaded || globalLoading) {
        if (globalKitLoaded && isMounted) {
          setKit(globalKit);
          setKitLoaded(true);
          await checkConnection(globalKit);
        }
        return;
      }
      
      globalLoading = true;
      const loaded = await loadStellarWalletsKit();
      
      if (loaded && isMounted) {
        try {
          const kitInstance = new StellarWalletsKit({
            modules: allowAllModules(),
            network: "Test SDF Network ; September 2015",
            selectedWalletId: FREIGHTER_ID,
          });
          
          globalKit = kitInstance;
          globalKitLoaded = true;
          globalLoading = false;
          
          setKit(kitInstance);
          setKitLoaded(true);
          
          // Verificar si hay una wallet conectada
          await checkConnection(kitInstance);
        } catch (err) {
          console.error('Error initializing StellarWalletsKit:', err);
          globalLoading = false;
          if (isMounted) {
            setError('Error initializing wallet kit');
          }
        }
      } else if (isMounted) {
        globalLoading = false;
        setError('Error loading wallet library');
      }
    };

    loadKit();
    
    return () => {
      isMounted = false;
    };
  }, []); // Dependencias vacías para que solo se ejecute una vez

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
    // Prevenir múltiples llamadas simultáneas
    if (isConnecting || !kitLoaded || !kit) {
      if (isConnecting) {
        console.log('🔄 Wallet connection already in progress, skipping...');
        return;
      }
      if (!kitLoaded) {
        console.log('🔄 Wallet kit not loaded yet, skipping...');
        return;
      }
      setError('Wallet kit not loaded');
      return;
    }

    // Verificar si ya está conectado
    if (walletInfo) {
      console.log('🔄 Wallet already connected, skipping...');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);
      
      console.log('🔗 Opening wallet modal...');

      await kit.openModal({
        onWalletSelected: async (option: any) => {
          try {
            console.log('✅ Wallet selected:', option.id);
            
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
            console.log('✅ Wallet connected successfully:', walletInfo);
          } catch (e) {
            console.error('❌ Error setting wallet:', e);
            setError('Error connecting to wallet');
          }
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error opening wallet modal';
      setError(errorMessage);
      console.error('❌ Error connecting wallet:', err);
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
    kitLoaded,
    connect,
    disconnect,
    clearError,
  };
};
