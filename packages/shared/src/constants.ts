/**
 * Shared constants for both frontend and backend
 */

export const DEFAULT_GAS_LIMIT = 300000;
export const DEFAULT_GAS_PRICE = 20; // in gwei

export const API_ENDPOINTS = {
  NFT: {
    MINT: '/api/nft/mint',
    GET_ALL: '/api/nft',
    GET_BY_ID: '/api/nft/:id',
  },
  USER: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PROFILE: '/api/user/profile',
  }
};

export const EVENT_NAMES = {
  NFT_MINTED: 'nft.minted',
  NFT_MINT_FAILED: 'nft.mint-failed',
};

export const SUPPORTED_NETWORKS = {
  ETHEREUM: {
    id: 1,
    name: 'Ethereum Mainnet',
  },
  SEPOLIA: {
    id: 11155111,
    name: 'Sepolia Testnet',
  },
  GOERLI: {
    id: 5,
    name: 'Goerli Testnet',
  },
  POLYGON: {
    id: 137,
    name: 'Polygon Mainnet',
  },
  MUMBAI: {
    id: 80001,
    name: 'Mumbai Testnet',
  },
}; 