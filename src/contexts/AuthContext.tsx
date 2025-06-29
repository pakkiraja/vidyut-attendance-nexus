
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'employee' | 'admin';
  department: string;
  isApproved: boolean;
  avatar?: string;
  officeLocation?: {
    lat: number;
    lng: number;
    radius: number; // in meters
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('vidyut_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - replace with actual API call
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'admin@vidyut.com',
        name: 'Admin User',
        role: 'admin',
        department: 'IT',
        isApproved: true,
        officeLocation: {
          lat: 12.9716,
          lng: 77.5946,
          radius: 100
        }
      },
      {
        id: '2',
        email: 'employee@vidyut.com',
        name: 'John Doe',
        role: 'employee',
        department: 'Engineering',
        isApproved: true,
        officeLocation: {
          lat: 12.9716,
          lng: 77.5946,
          radius: 100
        }
      }
    ];

    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && foundUser.isApproved) {
      setUser(foundUser);
      localStorage.setItem('vidyut_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vidyut_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
