import api from './api';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: 'user' | 'agent' | 'admin';
    avatarUrl?: string;
    createdAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: 'user' | 'agent';
}

export interface AuthResponse {
    message: string;
    user: User;
    token: string;
}

class AuthService {
    /**
     * Register a new user
     */
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', data);

        // Store token and user data
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    }

    /**
     * Login user
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', credentials);

        // Store token and user data
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    }

    /**
     * Get current user from backend
     */
    async getCurrentUser(): Promise<User> {
        const response = await api.get<{ user: User }>('/auth/me');

        // Update stored user data
        localStorage.setItem('user', JSON.stringify(response.data.user));

        return response.data.user;
    }

    /**
     * Logout user
     */
    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    /**
     * Get stored user data
     */
    getStoredUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }

    /**
     * Get stored token
     */
    getToken(): string | null {
        return localStorage.getItem('token');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    /**
     * Check if user has a specific role
     */
    hasRole(role: 'user' | 'agent' | 'admin'): boolean {
        const user = this.getStoredUser();
        return user?.role === role;
    }

    /**
     * Check if user is an agent or admin
     */
    isAgent(): boolean {
        const user = this.getStoredUser();
        return user?.role === 'agent' || user?.role === 'admin';
    }
}

export default new AuthService();
