"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthService, { User } from "@/lib/authService";

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await AuthService.getCurrentUser();

      if (!currentUser) {
        router.push("/auth/login");
        return;
      }

      if (currentUser.role !== "student") {
        // Redirect to appropriate dashboard
        const dashboardRoute = AuthService.getDashboardRoute(currentUser.role);
        router.push(dashboardRoute);
        return;
      }

      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await AuthService.logout();
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Student Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Student Portal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Request Funding</h3>
                <p className="text-gray-600">Submit a funding request</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">My Requests</h3>
                <p className="text-gray-600">Track your funding requests</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Thank Donors</h3>
                <p className="text-gray-600">Send appreciation messages</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800">
                Student Information:
              </h4>
              <p className="text-purple-700">Email: {user.email}</p>
              <p className="text-purple-700">Role: {user.role}</p>
              <p className="text-purple-700">
                Organization Type: {user.receiverSubtype}
              </p>
              <p className="text-purple-700">
                Location: {user.city}, {user.state}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
