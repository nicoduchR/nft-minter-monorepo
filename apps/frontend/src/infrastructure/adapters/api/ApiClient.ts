/**
 * API Client for making HTTP requests
 * This is a simple implementation that can be extended with axios or another library 
 */
export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(baseUrl: string = '') {
    // Use the NEXT_PUBLIC_API_URL from environment variables or fallback to the provided baseUrl
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  setAuthToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  // Helper method to get auth token from localStorage
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private async request<T>(
    url: string, 
    method: string, 
    data?: any
  ): Promise<T> {
    const fullUrl = `${this.baseUrl}${url}`;
    
    // Create a copy of headers for this request
    const requestHeaders = { ...this.headers };
    
    // Add auth token if available and not already set
    if (!requestHeaders['Authorization']) {
      const token = this.getAuthToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }
    
    const options: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(fullUrl, options);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const result = await response.json();
          return result as T;
        } catch (error) {
          console.warn('JSON parsing error:', error);
          // Return empty object for JSON parsing errors
          return {} as T;
        }
      } else {
        // For non-JSON responses, return empty object
        return {} as T;
      }
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(url: string): Promise<T> {
    return this.request<T>(url, 'GET');
  }

  async post<T>(url: string, data: any): Promise<T> {
    return this.request<T>(url, 'POST', data);
  }

  async put<T>(url: string, data: any): Promise<T> {
    return this.request<T>(url, 'PUT', data);
  }

  async delete<T>(url: string): Promise<T> {
    return this.request<T>(url, 'DELETE');
  }
} 