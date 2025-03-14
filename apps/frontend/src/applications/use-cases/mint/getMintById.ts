import { Mint } from "@/domain/entities/Mint";
import { MintRepository } from "@/domain/ports/MintRepository";

export async function getMintById(id: number, repository: MintRepository): Promise<Mint> {
    return await repository.getMintById(id);
}
