import { NFT } from "@/domain/entities/NFT";
import { NFTRepository } from "@/domain/ports/NFTRepository";

export async function getUserNFTs(repository: NFTRepository): Promise<NFT[]> {
    return await repository.getUserNFTs();
} 