"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();

  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role");
      return;
    }

    if (role === "admin") {
      router.push("/admin-dashboard");
    } else if (role === "donor") {
      router.push("/donor-dashboard");
    } else if (role === "student") {
      router.push("/student-dashboard");
    } else {
      alert("Invalid role selected");
    }
  };

  return (
    <div className="login-container bg-gray-100 mx-auto my-20 p-8 w-full max-w-md rounded-xl border border-gray-300 text-center">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col">
        <label htmlFor="role" className="text-left mb-1 font-medium">
          Select Role:
        </label>
        <select
          id="role"
          className="w-full p-2 mb-4 rounded border border-gray-300"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">--Choose Role--</option>
          <option value="admin">Admin</option>
          <option value="donor">Donor</option>
          <option value="student">Student</option>
        </select>

        <label htmlFor="email" className="text-left mb-1 font-medium">
          Email:
        </label>
        <input
          type="email"
          id="email"
          className="w-full p-2 mb-4 rounded border border-gray-300"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password" className="text-left mb-1 font-medium">
          Password:
        </label>
        <input
          type="password"
          id="password"
          className="w-full p-2 mb-4 rounded border border-gray-300"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition w-1/2 mx-auto"
        >
          Login
        </button>
      </form>

      <p className="mt-4">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-teal-700 hover:underline">
  Register here
</Link>

      </p>
    </div>
  );
}
