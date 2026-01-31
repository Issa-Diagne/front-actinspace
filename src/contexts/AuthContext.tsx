import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'operator' | 'observer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  station: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (requiredRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const roleHierarchy: Record<UserRole, number> = {
  observer: 1,
  operator: 2,
  admin: 3,
};

// Mock users for demonstration
const mockUsers: Record<string, { password: string; user: User }> = {
  'admin@sdric.space': {
    password: 'admin123',
    user: {
      id: '1',
      name: 'Jean Dupont',
      email: 'admin@sdric.space',
      role: 'admin',
      station: 'ESOC Darmstadt',
    },
  },
  'operator@sdric.space': {
    password: 'operator123',
    user: {
      id: '2',
      name: 'Marie Martin',
      email: 'operator@sdric.space',
      role: 'operator',
      station: 'Kourou CSG',
    },
  },
  'observer@sdric.space': {
    password: 'observer123',
    user: {
      id: '3',
      name: 'Pierre Durand',
      email: 'observer@sdric.space',
      role: 'observer',
      station: 'Maspalomas',
    },
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('sdric_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const userRecord = mockUsers[email];
    if (userRecord && userRecord.password === password) {
      setUser(userRecord.user);
      localStorage.setItem('sdric_user', JSON.stringify(userRecord.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sdric_user');
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
