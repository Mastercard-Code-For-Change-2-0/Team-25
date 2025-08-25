"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthService from "@/lib/authService";

export default function Login() {
  const router = useRouter();

  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!role) {
        setError("Please select a role");
        return;
      }

      if (!email || !password) {
        setError("Please enter email and password");
        return;
      }

      const response = await AuthService.login({
        email,
        password,
        role,
      });

      console.log("Login response:", response); // Debug log

      if (response.success && response.user) {
        console.log("User role:", response.user.role); // Debug log
        // Redirect to appropriate dashboard
        const dashboardRoute = AuthService.getDashboardRoute(
          response.user.role
        );
        console.log("Dashboard route:", dashboardRoute); // Debug log

        // Use window.location.href as a more reliable redirect
        window.location.href = dashboardRoute;
      } else {
        setError(response.message || "Login failed");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container bg-white mx-auto my-20 p-8 w-full max-w-md rounded-xl border border-gray-300 shadow-lg text-center">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col">
        <label
          htmlFor="role"
          className="text-left mb-1 font-medium text-gray-700"
        >
          Select Role:
        </label>
        <select
          id="role"
          className="w-full p-2 mb-4 rounded border border-gray-300 text-gray-900 bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">--Choose Role--</option>
          <option value="admin">Admin</option>
          <option value="donor">Donor</option>
          <option value="student">Student/Receiver</option>
        </select>

        <label
          htmlFor="email"
          className="text-left mb-1 font-medium text-gray-700"
        >
          Email:
        </label>
        <input
          type="email"
          id="email"
          className="w-full p-2 mb-4 rounded border border-gray-300 text-gray-900 bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label
          htmlFor="password"
          className="text-left mb-1 font-medium text-gray-700"
        >
          Password:
        </label>
        <input
          type="password"
          id="password"
          className="w-full p-2 mb-4 rounded border border-gray-300 text-gray-900 bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-red-600 mb-4 text-sm font-medium">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition w-1/2 mx-auto font-medium"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="text-teal-700 hover:text-teal-800 hover:underline font-medium"
        >
          Register here
        </Link>
      </p>
    </div>
  );
}
