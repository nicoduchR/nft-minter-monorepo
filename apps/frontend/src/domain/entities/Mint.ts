export type Mint = {
  id: number,
  name: string,
  description: string,
  mintPrice: number,
  totalSupply: number,
  mintedCount: number,
  mintDate: string,
  whitelist: boolean,
  status: MintStatus
};

export type MintStatus = 'active' | 'upcoming' | 'completed';
