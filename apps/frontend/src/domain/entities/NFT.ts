export interface NFT {
  id: string;
  name: string;
  image: string;
  collection: string;
  platform: string;
  mintedAt: string;
  description?: string;
  traits?: {
    trait_type: string;
    value: string;
  }[];
  floorPrice?: number;
  currency?: string;
} 