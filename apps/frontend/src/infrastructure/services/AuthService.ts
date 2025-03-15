import { ApiClient } from "../adapters/api/ApiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  wallet?: {
    address: string;
    balance: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterDetails {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export class AuthService {
  private apiClient: ApiClient;
  
  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Attempt to login with provided credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      // Make actual API call to login endpoint
      const response = await this.apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN, 
        credentials
      );
      
      // Extract token and user from response
      const { access_token, user } = response;
      
      // Store authentication data
      this.setAuthData(user, access_token);
      
      // Set the token in ApiClient
      this.apiClient.setAuthToken(access_token);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  /**
   * Register a new user
   */
  async register(details: RegisterDetails): Promise<AuthUser> {
    try {
      // Make actual API call to register endpoint
      const response = await this.apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER, 
        details
      );
      
      // Extract token and user from response
      const { access_token, user } = response;
      
      // Store authentication data
      this.setAuthData(user, access_token);
      
      // Set the token in ApiClient
      this.apiClient.setAuthToken(access_token);
      
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed. Please try again.');
    }
  }

  /**
   * Log the user out
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get current user data
   */
  getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (e) {
        console.error('Error parsing user data', e);
        return null;
      }
    }
    return null;
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  /**
   * Store authentication data
   */
  private setAuthData(user: AuthUser, token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
    }
  }

  /**
   * Initialize auth state on app startup
   * Returns the current user if authenticated
   */
  initializeAuth(): AuthUser | null {
    const token = this.getToken();
    const user = this.getCurrentUser();
    
    if (token && user) {
      // Set the token in ApiClient for future requests
      this.apiClient.setAuthToken(token);
      return user;
    }
    
    return null;
  }

  /**
   * Get the ApiClient instance
   * This allows other services to use the same authenticated client
   */
  getApiClient(): ApiClient {
    return this.apiClient;
  }
}

// Create singleton instance
const apiClient = new ApiClient();
export const authService = new AuthService(apiClient); 