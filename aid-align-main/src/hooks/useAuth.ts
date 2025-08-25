import { useState, useEffect } from "react";
import { User, UserRole, LoginCredentials } from "@/types/auth";

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@donatelink.org",
    name: "Sarah Johnson",
    role: "super_admin",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400"
  },
  {
    id: "2", 
    email: "coordinator@donatelink.org",
    name: "Michael Chen",
    role: "coordinator",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
  }
];

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === credentials.email);
    
    if (foundUser && credentials.password === "password") {
      setUser(foundUser);
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  return {
    user,
    isLoading,
    login,
    logout,
    hasRole,
    isAuthenticated: !!user
  };
};