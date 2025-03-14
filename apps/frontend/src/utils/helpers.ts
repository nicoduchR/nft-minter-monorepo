import { truncateAddress, formatDate, NFTStatus, SUPPORTED_NETWORKS } from '@nft-minter/shared';

/**
 * Formats an NFT's status with proper styling
 * @param status The NFT status
 * @returns Object with text and color for the status
 */
export const formatNFTStatus = (status: NFTStatus) => {
  switch (status) {
    case NFTStatus.MINTED:
      return { text: 'Minted', color: 'text-green-500' };
    case NFTStatus.MINTING:
      return { text: 'Minting...', color: 'text-orange-500' };
    case NFTStatus.PENDING:
      return { text: 'Pending', color: 'text-blue-500' };
    case NFTStatus.FAILED:
      return { text: 'Failed', color: 'text-red-500' };
    default:
      return { text: 'Unknown', color: 'text-gray-500' };
  }
};

/**
 * Gets the supported network name from chain ID
 * @param chainId The blockchain network ID
 * @returns The human-readable network name
 */
export const getNetworkName = (chainId: number): string => {
  type Network = {
    id: number;
    name: string;
  };
  
  for (const [_, network] of Object.entries(SUPPORTED_NETWORKS)) {
    const typedNetwork = network as Network;
    if (typedNetwork.id === chainId) {
      return typedNetwork.name;
    }
  }
  return 'Unknown Network';
};

// Re-export shared utilities with our application-specific utilities
export { truncateAddress, formatDate }; 