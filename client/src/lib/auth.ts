// Authentication utilities and API calls
const API_BASE_URL = "http://127.0.0.1:8096";

export interface LoginRequest {
  mobile: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: {
    user_id: string;
    name: string;
    mobile: string;
    role_id: number;
    role: string;
    access_token: string;
    token_type: string;
    last_login: string;
  };
}

export interface AuthUser {
  user_id: string;
  name: string;
  mobile: string;
  role_id: number;
  role: string;
  access_token: string;
  token_type: string;
  last_login: string;
}

// Storage keys
const ACCESS_TOKEN_KEY = 'cp_manager_access_token';
const USER_DATA_KEY = 'cp_manager_user_data';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data: LoginResponse = await response.json();
    
    if (data.status === 200) {
      // Store authentication data
      this.setAccessToken(data.data.access_token);
      this.setUserData(data.data);
    }
    
    return data;
  }

  static async logout(): Promise<void> {
    const token = this.getAccessToken();
    
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/auth/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }
    
    // Clear local storage regardless of API call result
    this.clearAuthData();
  }

  static setAccessToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  static setUserData(userData: AuthUser): void {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  }

  static getUserData(): AuthUser | null {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  static clearAuthData(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    } : {
      'Content-Type': 'application/json',
    };
  }
}