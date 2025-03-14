import { Mint } from "@/domain/entities/Mint";
import { MintRepository } from "@/domain/ports/MintRepository";

export class InMemoryMintRepository implements MintRepository {
  private mints: Mint[] = [
    {
      id: 1,
      name: "Mint 1",
      description: "Description 1",
      mintPrice: 0.1,
      totalSupply: 1000,
      mintedCount: 500,
      mintDate: "2023-01-01",
      whitelist: false,
      status: "active"
    },
    {
      id: 2,
      name: "Mint 2",
      description: "Description 2",
      mintPrice: 0.2,
      totalSupply: 2000,
      mintedCount: 1000,
      mintDate: "2023-02-01",
      whitelist: true,
      status: "upcoming"
    },
    {
      id: 3,
      name: "Mint 3",
      description: "Description 3",
      mintPrice: 0.3,
      totalSupply: 3000,
      mintedCount: 3000,
      mintDate: "2022-12-01",
      whitelist: false,
      status: "completed"
    },
  ];

  async getMints(): Promise<Mint[]> {
    return this.mints;
  }

  async getMintById(id: number): Promise<Mint> {
    const mint = this.mints.find((mint) => mint.id === id);
    if (!mint) {
      throw new Error("Mint not found");
    }
    return mint;
  }

  async createMint(mint: Mint): Promise<Mint> {
    this.mints.push(mint);
    return mint;
  }

  async updateMint(mint: Partial<Mint>): Promise<Mint> {
    const index = this.mints.findIndex((m) => m.id === mint.id);
    if (index === -1) throw new Error("Mint not found");
    this.mints[index] = { ...this.mints[index], ...mint };
    return this.mints[index];
  }

  async deleteMint(id: number): Promise<void> {
    const index = this.mints.findIndex((mint) => mint.id === id);
    if (index === -1) throw new Error("Mint not found");
    this.mints.splice(index, 1);
  }
}

export const mintRepositoryInstance = new InMemoryMintRepository();
