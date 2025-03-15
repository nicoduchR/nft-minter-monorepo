import { NFT } from "@/domain/entities/NFT";
import { NFTRepository } from "@/domain/ports/NFTRepository";
import { ApiClient } from "../api/ApiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { authService } from "../../services/AuthService";

export class ApiNFTRepository implements NFTRepository {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;

    // Initialize with auth token if available - only in browser environment
    if (typeof window !== 'undefined') { // Check if running in browser
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.apiClient.setAuthToken(token);
      }
    }
  }

  async getUserNFTs(): Promise<NFT[]> {
    try {
      const response = await this.apiClient.get<{ data: NFT[] }>(API_ENDPOINTS.NFT.GET_USER_NFTS);
      // Check if response.data exists, otherwise return empty array
      return response?.data || [];
    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      // Return empty array on error
      return [];
    }
  }

  async getNFTById(id: string): Promise<NFT> {
    const url = API_ENDPOINTS.NFT.GET_NFT_BY_ID.replace(':id', id);
    const response = await this.apiClient.get<{ data: NFT }>(url);
    return response.data;
  }

  async getAllNFTs(): Promise<NFT[]> {
    const response = await this.apiClient.get<{ data: NFT[] }>(API_ENDPOINTS.NFT.GET_ALL_NFTS);
    return response.data;
  }
}

// Use the shared API client instance from the auth service
// This ensures all requests use the same ApiClient with token
export const apiNFTRepository = new ApiNFTRepository(authService.getApiClient()); 