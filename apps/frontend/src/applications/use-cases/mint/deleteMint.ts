import { MintRepository } from "@/domain/ports/MintRepository";

export async function deleteMint(id: number, repository: MintRepository): Promise<void> {
    return await repository.deleteMint(id);
}

