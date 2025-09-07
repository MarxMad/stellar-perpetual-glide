import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNetwork } from "@/hooks/use-network";
import { Network, TestTube } from "lucide-react";

export const NetworkToggle = () => {
  const { network, changeNetwork, isMainnet, isTestnet } = useNetwork();

  const handleNetworkChange = () => {
    const newNetwork = isMainnet ? 'testnet' : 'mainnet';
    changeNetwork(newNetwork);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleNetworkChange}
      className={`
        border transition-all duration-300 hover:shadow-lg
        ${isMainnet 
          ? 'border-green-500/50 text-green-400 bg-green-500/10 hover:bg-green-500/20 hover:border-green-400/70' 
          : 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 hover:border-yellow-400/70'
        }
      `}
    >
      {isMainnet ? (
        <Network className="w-3 h-3 mr-1" />
      ) : (
        <TestTube className="w-3 h-3 mr-1" />
      )}
      <span className="text-xs font-medium">
        {isMainnet ? 'Mainnet' : 'Testnet'}
      </span>
    </Button>
  );
};
