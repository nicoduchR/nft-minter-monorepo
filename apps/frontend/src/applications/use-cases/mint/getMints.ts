import { Mint } from "@/domain/entities/Mint";
import { MintRepository } from "@/domain/ports/MintRepository";

export async function getMints(repository: MintRepository): Promise<Mint[]> {
    return await repository.getMints();
}


