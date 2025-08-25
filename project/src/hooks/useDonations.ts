"use client";

import { useState, useEffect } from "react";

interface Donation {
  _id: string;
  title: string;
  description: string;
  category: string;
  amount?: number;
  items?: Array<{
    name: string;
    quantity: number;
    description?: string;
  }>;
  type: "monetary" | "material";
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  urgency: "low" | "medium" | "high" | "critical";
  location: {
    state: string;
    city: string;
    address?: string;
    pincode: string;
  };
  images?: string[];
  deadline?: string;
  createdAt: string;
  updatedAt: string;
  donorId?: {
    email: string;
    role: string;
    donorType?: string;
  };
}

interface UseDonationsResult {
  donations: Donation[];
  loading: boolean;
  error: string | null;
  createDonation: (donationData: any) => Promise<boolean>;
  refetch: () => void;
  pagination: {
    current: number;
    total: number;
    count: number;
    totalItems: number;
  };
}

export function useDonations(
  filters: {
    status?: string;
    category?: string;
    donorId?: string;
    page?: number;
    limit?: number;
  } = {}
): UseDonationsResult {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    totalItems: 0,
  });

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.category) params.append("category", filters.category);
      if (filters.donorId) params.append("donorId", filters.donorId);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());

      const response = await fetch(`/api/donations?${params.toString()}`, {
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setDonations(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.message || "Failed to fetch donations");
      }
    } catch (err) {
      setError("Failed to fetch donations");
      console.error("Fetch donations error:", err);
    } finally {
      setLoading(false);
    }
  };

  const createDonation = async (donationData: any): Promise<boolean> => {
    try {
      setError(null);

      const response = await fetch("/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(donationData),
      });

      const data = await response.json();

      if (data.success) {
        // Add the new donation to the list
        setDonations(prev => [data.data, ...prev]);
        return true;
      } else {
        setError(data.message || "Failed to create donation");
        return false;
      }
    } catch (err) {
      setError("Failed to create donation");
      console.error("Create donation error:", err);
      return false;
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [filters.status, filters.category, filters.donorId, filters.page, filters.limit]);

  return {
    donations,
    loading,
    error,
    createDonation,
    refetch: fetchDonations,
    pagination,
  };
}
