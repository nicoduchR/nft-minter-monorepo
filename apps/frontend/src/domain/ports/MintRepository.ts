import { Mint } from "../entities/Mint";

export interface MintRepository {
  getMints(): Promise<Mint[]>;
  getMintById(id: number): Promise<Mint>;
  createMint(mint: Mint): Promise<Mint>;
  updateMint(mint: Partial<Mint>): Promise<Mint>;
  deleteMint(id: number): Promise<void>;
}
