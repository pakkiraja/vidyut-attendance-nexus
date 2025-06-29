
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  employeeId?: string;
  firstName: string;
  lastName: string;
  initials?: string;
  fullName: string;
  role: 'employee' | 'admin';
  department: string;
  project?: string;
  workLocation?: string;
  contactNumber?: string;
  isApproved: boolean;
  avatar?: string;
  officeLocation?: {
    lat: number;
    lng: number;
    radius: number;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
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
    // Check admin credentials
    if (email === 'vadmin@vidyutconsultancy.in' && password === 'Vidyut@2025') {
      const adminUser: User = {
        id: 'admin_001',
        email: 'vadmin@vidyutconsultancy.in',
        firstName: 'Admin',
        lastName: 'User',
        fullName: 'Admin User',
        role: 'admin',
        department: 'IT',
        isApproved: true,
        officeLocation: {
          lat: 12.9716,
          lng: 77.5946,
          radius: 100
        }
      };
      setUser(adminUser);
      localStorage.setItem('vidyut_user', JSON.stringify(adminUser));
      return true;
    }

    // Check employee credentials from localStorage (simulated database)
    const employees = JSON.parse(localStorage.getItem('vidyut_employees') || '[]');
    const foundEmployee = employees.find((emp: User) => emp.email === email);
    
    if (foundEmployee && foundEmployee.isApproved) {
      setUser(foundEmployee);
      localStorage.setItem('vidyut_user', JSON.stringify(foundEmployee));
      return true;
    }
    
    return false;
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // In a real app, this would validate the current password and update it in the database
    // For now, we'll just simulate success
    setTimeout(() => {
      console.log('Password changed successfully');
    }, 1000);
    return true;
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    // In a real app, this would send a password reset email
    // For now, we'll just simulate success
    console.log(`Password reset link sent to ${email}`);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vidyut_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword, resetPassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
