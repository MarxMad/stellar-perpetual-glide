import { useState, useEffect } from 'react';

export type NetworkType = 'mainnet' | 'testnet';

export const useNetwork = () => {
  const [network, setNetwork] = useState<NetworkType>('testnet');

  // Cargar la red guardada del localStorage al inicializar
  useEffect(() => {
    const savedNetwork = localStorage.getItem('stellar-network') as NetworkType;
    if (savedNetwork && (savedNetwork === 'mainnet' || savedNetwork === 'testnet')) {
      setNetwork(savedNetwork);
    }
  }, []);

  // Guardar la red en localStorage cuando cambie
  const changeNetwork = (newNetwork: NetworkType) => {
    setNetwork(newNetwork);
    localStorage.setItem('stellar-network', newNetwork);
    
    // Recargar la página para aplicar los cambios de red
    window.location.reload();
  };

  return {
    network,
    changeNetwork,
    isMainnet: network === 'mainnet',
    isTestnet: network === 'testnet'
  };
};
