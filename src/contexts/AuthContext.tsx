import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User, LoginCredentials, RegisterData } from '@/services/auth.service';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isAgent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = async () => {
            const storedUser = authService.getStoredUser();
            const token = authService.getToken();

            if (storedUser && token) {
                try {
                    // Verify token is still valid by fetching current user
                    const currentUser = await authService.getCurrentUser();
                    setUser(currentUser);
                } catch (error) {
                    // Token invalid or expired
                    authService.logout();
                    setUser(null);
                }
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await authService.login(credentials);
            setUser(response.user);

            toast({
                title: 'Welcome back!',
                description: `Logged in as ${response.user.firstName} ${response.user.lastName}`,
            });
        } catch (error: any) {
            toast({
                title: 'Login failed',
                description: error.message || 'Invalid email or password',
                variant: 'destructive',
            });
            throw error;
        }
    };

    const register = async (data: RegisterData) => {
        try {
            const response = await authService.register(data);
            setUser(response.user);

            toast({
                title: 'Account created!',
                description: `Welcome, ${response.user.firstName}!`,
            });
        } catch (error: any) {
            toast({
                title: 'Registration failed',
                description: error.message || 'An error occurred during registration',
                variant: 'destructive',
            });
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);

        toast({
            title: 'Logged out',
            description: 'You have been successfully logged out',
        });
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAgent: user?.role === 'agent' || user?.role === 'admin',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
