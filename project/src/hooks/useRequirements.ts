"use client";

import { useState, useEffect } from "react";

interface Requirement {
  _id: string;
  title: string;
  description: string;
  category: string;
  type: "monetary" | "material" | "both";
  targetAmount?: number;
  currentAmount?: number;
  items?: Array<{
    name: string;
    quantity: number;
    description?: string;
    received?: number;
  }>;
  urgency: "low" | "medium" | "high" | "critical";
  status: "active" | "paused" | "completed" | "expired" | "cancelled";
  location: {
    state: string;
    city: string;
    address?: string;
    pincode: string;
  };
  beneficiaryInfo: {
    count: number;
    ageGroup?: string;
    description: string;
  };
  images?: string[];
  deadline: string;
  tags?: string[];
  donorsCount?: number;
  adminVerified: boolean;
  createdAt: string;
  updatedAt: string;
  requesterId?: {
    email: string;
    role: string;
    receiverSubtype?: string;
  };
}

interface UseRequirementsResult {
  requirements: Requirement[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  pagination: {
    current: number;
    total: number;
    count: number;
    totalItems: number;
  };
}

export function useRequirements(
  filters: {
    status?: string;
    category?: string;
    urgency?: string;
    state?: string;
    city?: string;
    verified?: boolean;
    page?: number;
    limit?: number;
  } = {}
): UseRequirementsResult {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    totalItems: 0,
  });

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.category) params.append("category", filters.category);
      if (filters.urgency) params.append("urgency", filters.urgency);
      if (filters.state) params.append("state", filters.state);
      if (filters.city) params.append("city", filters.city);
      if (filters.verified !== undefined) params.append("verified", filters.verified.toString());
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());

      const response = await fetch(`/api/requirements?${params.toString()}`, {
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setRequirements(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.message || "Failed to fetch requirements");
      }
    } catch (err) {
      setError("Failed to fetch requirements");
      console.error("Fetch requirements error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, [
    filters.status,
    filters.category,
    filters.urgency,
    filters.state,
    filters.city,
    filters.verified,
    filters.page,
    filters.limit,
  ]);

  return {
    requirements,
    loading,
    error,
    refetch: fetchRequirements,
    pagination,
  };
}
