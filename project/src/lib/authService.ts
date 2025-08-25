import Cookies from "js-cookie";

export interface User {
  id: string;
  email: string;
  role: "admin" | "donor" | "student";
  donorType?: string;
  receiverSubtype?: string;
  state?: string;
  city?: string;
  mobile?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

class AuthService {
  private baseUrl = "/api/auth";

  async register(userData: {
    email: string;
    password: string;
    role: string;
    donorType?: string;
    receiverSubtype?: string;
    aadhaar: string;
    state: string;
    city: string;
    zipcode: string;
    address: string;
    mobile: string;
  }): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success && data.token) {
        // Store token in cookie (client-side backup)
        Cookies.set("auth-token", data.token, { expires: 7 });
      }

      return data;
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: "Registration failed. Please try again.",
      };
    }
  }

  async login(credentials: {
    email: string;
    password: string;
    role: string;
  }): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success && data.token) {
        // Store token in cookie (client-side backup)
        Cookies.set("auth-token", data.token, { expires: 7 });
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Login failed. Please try again.",
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/logout`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear client-side token
      Cookies.remove("auth-token");
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/me`, {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        return data.user;
      }

      return null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }

  getToken(): string | undefined {
    return Cookies.get("auth-token");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getDashboardRoute(role: string): string {
    switch (role) {
      case "admin":
        return "/admin-dashboard";
      case "donor":
        return "/donor-dashboard";
      case "student":
        return "/student-dashboard";
      default:
        return "/auth";
    }
  }
}

export default new AuthService();
