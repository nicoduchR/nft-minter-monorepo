import { Mint } from "@/domain/entities/Mint";
import { MintRepository } from "@/domain/ports/MintRepository";

export async function updateMint(mint: Mint, repository: MintRepository): Promise<Mint> {
    return await repository.updateMint(mint);
}
