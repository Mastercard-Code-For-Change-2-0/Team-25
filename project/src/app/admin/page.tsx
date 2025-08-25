"use client";

import React, { useState, useEffect, Fragment, FC, ReactNode } from "react";
import { Transition } from "@headlessui/react";
import useSWR, { mutate } from "swr";

// --- SWR Fetcher ---
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// --- ICONS ---
const MenuIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);
const UserCircleIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
      clipRule="evenodd"
    />
  </svg>
);
const CloseIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

interface IUser {
  role: "super-admin" | "coordinator";
  name: string;
  email: string;
}
interface IListedItem {
  _id: string;
  title: string;
  category: string;
  available: number;
  location?: string;
  status?: "active" | "completed";
  thumbnail?: string;
  createdAt?: string;
  distributionDate?: string;
  deliveryTime?: string;
  claimed?: number;
  submittedBy?: string;
  approvedBy?: string;
  recieverId?: string[];
  distribution?: string[];
  transactions?: string[];
}
interface IListedRequest {
  _id: string;
  title: string;
  category: string;
  quantity: number;
  location?: string;
  status?: "active" | "completed";
  purpose?: string;
  createdAt?: string;
  submittedBy?: string;
  transactions?: string[];
}
interface ITransaction {
  _id: string;
  requestId: string;
  listingIds: string[];
  quantity: number;
  status: "pending" | "approved" | "declined";
}
// For completed transactions (with more fields)
interface ICompletedTransaction extends ITransaction {
  category: string;
  createdAt?: string;
  updatedAt?: string;
  completionTime?: string;
}
// --- REPORTS PAGE ---
import jsPDF from "jspdf";
import Chart from "chart.js/auto";

const ReportsPage: FC = () => {
  const { data, error, isLoading } = useSWR<{ transactions: ICompletedTransaction[] }>(
    "/api/transactions",
    fetcher
  );
  const [completed, setCompleted] = useState<ICompletedTransaction[]>([]);
  const chartRef = React.useRef<HTMLCanvasElement>(null);
  const [chartInstance, setChartInstance] = useState<any>(null);

  useEffect(() => {
    if (data?.transactions) {
      const filtered = data.transactions.filter((tx) => tx.status === "approved");
      setCompleted(filtered);
    }
  }, [data]);

  // Chart rendering
  useEffect(() => {
    if (chartRef.current && completed.length > 0) {
      if (chartInstance) chartInstance.destroy();
      // Group by category
      const categoryMap: { [cat: string]: number } = {};
      completed.forEach((tx) => {
        categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.quantity;
      });
      const categories = Object.keys(categoryMap);
      const quantities = Object.values(categoryMap);
      const newChart = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: categories,
          datasets: [
            {
              label: "Items Distributed",
              data: quantities,
              backgroundColor: "#2563eb",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: "Distribution by Category" },
          },
        },
      });
      setChartInstance(newChart);
    }
    // eslint-disable-next-line
  }, [completed]);

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.text("Distribution Report", 10, 10);
    let y = 20;
    doc.text("Category", 10, y);
    doc.text("Quantity", 60, y);
    y += 8;
    // Group by category
    const categoryMap: { [cat: string]: number } = {};
    completed.forEach((tx) => {
      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.quantity;
    });
    Object.entries(categoryMap).forEach(([cat, qty]) => {
      doc.text(cat, 10, y);
      doc.text(qty.toString(), 60, y);
      y += 8;
    });
    doc.save("distribution_report.pdf");
  };

  if (isLoading) return <div className="p-6">Loading report...</div>;
  if (error) return <div className="p-6 text-red-600">Error loading report.</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Distribution Report</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Summary Table</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Distributed</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(() => {
                const categoryMap: { [cat: string]: number } = {};
                completed.forEach((tx) => {
                  categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.quantity;
                });
                return Object.entries(categoryMap).map(([cat, qty]) => (
                  <tr key={cat}>
                    <td className="px-6 py-4 text-sm text-gray-800">{cat}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{qty}</td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Distribution Chart</h2>
          <canvas ref={chartRef} width={400} height={300} />
        </div>
      </div>
      <button
        onClick={handleGeneratePDF}
        className="mt-6 px-6 py-3 font-semibold text-white bg-blue-800 rounded-md hover:bg-blue-900"
      >
        Generate PDF
      </button>
    </div>
  );
};
// Combined type for the table display
interface ISuggestedMatch {
  matchId: string;
  donor: IListedItem;
  receiver: IListedRequest;
}

// --- MOCK LOGIN DATA ---
const MOCK_USERS: { [key: string]: IUser } = {
  "admin@example.com": {
    role: "super-admin",
    name: "Admin User",
    email: "admin@example.com",
  },
  "coordinator@example.com": {
    role: "coordinator",
    name: "Coordinator User",
    email: "coordinator@example.com",
  },
};

// --- COMPONENT PROPS ---
interface LoginPageProps {
  onLogin: (user: IUser) => void;
}
interface DetailsModalProps {
  item: IListedItem | IListedRequest | null;
  isOpen: boolean;
  onClose: () => void;
}
interface GenericPageProps {
  title: string;
}
interface LayoutProps {
  user: IUser;
  onLogout: () => void;
  children: ReactNode;
  activePage: string;
  setActivePage: (page: string) => void;
}

// 1. LOGIN PAGE
const LoginPage: FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>("admin@example.com");
  const [password, setPassword] = useState<string>("password");
  const [error, setError] = useState<string>("");
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = MOCK_USERS[email];
    if (user && password === "password") {
      setError("");
      onLogin(user);
    } else {
      setError("Invalid email or password.");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-900">
      {" "}
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        {" "}
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>{" "}
        <form className="space-y-6" onSubmit={handleLogin}>
          {" "}
          <div>
            {" "}
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email address
            </label>{" "}
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="admin@example.com"
            />{" "}
          </div>{" "}
          <div>
            {" "}
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>{" "}
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="password"
            />{" "}
          </div>{" "}
          {error && <p className="text-sm text-red-600">{error}</p>}{" "}
          <div>
            {" "}
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-blue-800 rounded-md hover:bg-blue-900 transition-colors duration-300"
            >
              {" "}
              Sign In{" "}
            </button>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
};

// 2. MODAL
const DetailsModal: FC<DetailsModalProps> = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      {" "}
      <div
        className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {" "}
        <h3 className="text-2xl font-bold text-blue-900 mb-4">
          Details for {item.title}
        </h3>{" "}
        <div className="space-y-2 text-gray-700">
          {" "}
          <p>
            <strong>ID:</strong> {item._id}
          </p>{" "}
          <p>
            <strong>Category:</strong> {item.category}
          </p>{" "}
          <p>
            <strong>Quantity:</strong>{" "}
            {"available" in item ? item.available : item.quantity}
          </p>{" "}
          <p>
            <strong>Location:</strong> {item.location}
          </p>{" "}
        </div>{" "}
        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 font-semibold text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
        >
          Close
        </button>{" "}
      </div>{" "}
    </div>
  );
};

// 3. SUPER ADMIN - SUGGESTED MATCHES PAGE
const SuggestedMatchesPage: FC = () => {
  const {
    data: itemsData,
    error: itemsError,
    isLoading: itemsLoading,
  } = useSWR<{ items: IListedItem[] }>("/api/listed-items", fetcher);
  const {
    data: requestsData,
    error: reqsError,
    isLoading: reqsLoading,
  } = useSWR<{ requests: IListedRequest[] }>("/api/listed-requests", fetcher);
  const {
    data: txData,
    error: txError,
    isLoading: txLoading,
  } = useSWR<{ transactions: ITransaction[] }>("/api/transactions", fetcher);

  const [approvedMatches, setApprovedMatches] = useState<ISuggestedMatch[]>([]);
  const [activeTab, setActiveTab] = useState<string>("suggested");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<
    IListedItem | IListedRequest | null
  >(null);

  const handleViewDetails = (item: IListedItem | IListedRequest) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleApproveMatch = async (match: ISuggestedMatch) => {
    try {
      await fetch("/api/transactions/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: match.matchId }),
      });
      // Re-fetch transactions and update approved list client-side for immediate feedback
      mutate("/api/transactions");
      setApprovedMatches((prev) => [...prev, match]);
    } catch (err) {
      console.error("Failed to approve transaction:", err);
    }
  };

  if (itemsLoading || reqsLoading || txLoading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading dashboard data...
      </div>
    );
  }
  if (itemsError || reqsError || txError) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Error loading data. Please try again later.
      </div>
    );
  }

  // Synthesize data: map transaction IDs to full item/request objects
  const suggestedMatches: ISuggestedMatch[] = (txData?.transactions ?? [])
    .filter((tx) => tx.status === "pending")
    .map((tx) => {
      const receiver = requestsData?.requests.find(
        (r) => r._id === tx.requestId
      );
      // For simplicity, we'll assume the first listingId is the donor
      const donor = itemsData?.items.find((i) => i._id === tx.listingIds[0]);
      if (!receiver || !donor) return null;
      return { matchId: tx._id, donor, receiver };
    })
    .filter((match): match is ISuggestedMatch => match !== null);

  return (
    <div className="p-4 md:p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Suggested Matches</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">
            Donors (Listed Items)
          </h2>
          <ul className="space-y-3 max-h-96 overflow-y-auto">
            {itemsData?.items.map((item) => (
              <li
                key={item._id}
                className="p-4 bg-gradient-to-br from-blue-50 to-yellow-50 rounded-lg shadow flex flex-col gap-2 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg text-blue-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">ID: {item._id}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.available > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.available} available
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-700 mt-1">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Category: {item.category}
                  </span>
                  {item.location && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Location: {item.location}
                    </span>
                  )}
                  {item.status && (
                    <span
                      className={`px-2 py-1 rounded ${
                        item.status === "completed"
                          ? "bg-green-200 text-green-900"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      Status: {item.status}
                    </span>
                  )}
                  {item.thumbnail && (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      Thumbnail: {item.thumbnail}
                    </span>
                  )}
                  {item.createdAt && (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      Created: {new Date(item.createdAt).toLocaleString()}
                    </span>
                  )}
                  {item.distributionDate && (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      Distribution Date: {item.distributionDate}
                    </span>
                  )}
                  {item.deliveryTime && (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      Delivery: {new Date(item.deliveryTime).toLocaleString()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleViewDetails(item)}
                  className="mt-2 text-sm font-semibold text-white bg-blue-800 px-3 py-1 rounded-md hover:bg-blue-900 self-end"
                >
                  Details
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">
            Receivers (Requests)
          </h2>
          <ul className="space-y-3 max-h-96 overflow-y-auto">
            {requestsData?.requests.map((req) => (
              <li
                key={req._id}
                className="p-4 bg-gradient-to-br from-yellow-50 to-blue-50 rounded-lg shadow flex flex-col gap-2 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg text-blue-900">
                      {req.title}
                    </p>
                    <p className="text-xs text-gray-500">ID: {req._id}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      req.quantity > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {req.quantity} needed
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-700 mt-1">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Category: {req.category}
                  </span>
                  {req.location && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Location: {req.location}
                    </span>
                  )}
                  {req.status && (
                    <span
                      className={`px-2 py-1 rounded ${
                        req.status === "completed"
                          ? "bg-green-200 text-green-900"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      Status: {req.status}
                    </span>
                  )}
                  {req.purpose && (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      Purpose: {req.purpose}
                    </span>
                  )}
                  {req.createdAt && (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      Created: {new Date(req.createdAt).toLocaleString()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleViewDetails(req)}
                  className="mt-2 text-sm font-semibold text-white bg-blue-800 px-3 py-1 rounded-md hover:bg-blue-900 self-end"
                >
                  Details
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("suggested")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "suggested"
                  ? "border-yellow-500 text-blue-800"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Suggested Matches
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "approved"
                  ? "border-yellow-500 text-blue-800"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Approved Matches
            </button>
          </nav>
        </div>
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          {activeTab === "suggested" && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Donor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Receiver
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {suggestedMatches.map((match) => (
                  <tr key={match.matchId}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {match.donor.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {match.donor._id} | Qty: {match.donor.available}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {match.donor.category}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {match.receiver.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {match.receiver._id} | Qty:{" "}
                        {match.receiver.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <input
                          id={`approve-${match.matchId}`}
                          type="checkbox"
                          onChange={() => handleApproveMatch(match)}
                          className="h-5 w-5 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400 cursor-pointer"
                        />
                        <label
                          htmlFor={`approve-${match.matchId}`}
                          className="ml-2 text-sm text-gray-600"
                        >
                          Items Matched
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === "approved" && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Donor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Receiver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {approvedMatches.map((match) => (
                  <tr key={match.matchId}>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {match.donor.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {match.donor.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {match.receiver.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Approved
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <DetailsModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

// 4. COORDINATOR DASHBOARD
const CoordinatorDashboard: FC = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">
      Coordinator Dashboard
    </h1>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-blue-900">
        Assigned Donations
      </h2>
      <p className="text-gray-600">
        This area will show donations and matches assigned to you.
      </p>
    </div>
  </div>
);

// 5. GENERIC PAGE
const GenericPage: FC<GenericPageProps> = ({ title }) => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
    <p className="mt-4 text-gray-600">
      Content for the {title} page goes here.
    </p>
  </div>
);

// 6. MAIN LAYOUT
const Layout: FC<LayoutProps> = ({
  user,
  onLogout,
  children,
  activePage,
  setActivePage,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [profileDropdownOpen, setProfileDropdownOpen] =
    useState<boolean>(false);
  const navLinks = [
    "Dashboard",
    "Donations",
    "Requests",
    "Suggested Matches",
    "Reports",
  ];
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    page: string
  ) => {
    e.preventDefault();
    setActivePage(page);
    setSidebarOpen(false);
    setProfileDropdownOpen(false);
  };
  const handleLogoutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onLogout();
  };
  return (
    <div className="min-h-screen bg-gray-100">
      {" "}
      <Transition show={sidebarOpen} as={Fragment}>
        {" "}
        <div className="fixed inset-0 flex z-40 md:hidden">
          {" "}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            />
          </Transition.Child>{" "}
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-blue-900">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none"
                >
                  <CloseIcon />
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <nav className="mt-5 px-2 space-y-1">
                  {navLinks.map((link) => (
                    <a
                      key={link}
                      href="#"
                      onClick={(e) =>
                        handleNavClick(e, link.toLowerCase().replace(" ", "-"))
                      }
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        activePage === link.toLowerCase().replace(" ", "-")
                          ? "bg-yellow-500 text-blue-900"
                          : "text-white hover:bg-blue-800"
                      }`}
                    >
                      {link}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </Transition.Child>{" "}
        </div>{" "}
      </Transition>{" "}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        {" "}
        <div className="flex flex-col flex-grow bg-blue-900 pt-5 overflow-y-auto">
          <div className="px-4">
            <h1 className="text-2xl font-bold text-white">Donation Hub</h1>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  onClick={(e) =>
                    handleNavClick(e, link.toLowerCase().replace(" ", "-"))
                  }
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    activePage === link.toLowerCase().replace(" ", "-")
                      ? "bg-yellow-500 text-blue-900"
                      : "text-white hover:bg-blue-800"
                  }`}
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>{" "}
      <div className="md:pl-64 flex flex-col flex-1">
        {" "}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none md:hidden"
          >
            <MenuIcon />
          </button>
          <div className="flex-1 px-4 flex justify-end">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    <UserCircleIcon />
                  </button>
                </div>
                <Transition
                  show={profileDropdownOpen}
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                    <a
                      href="#"
                      onClick={(e) => handleNavClick(e, "profile")}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </a>
                    <a
                      href="#"
                      onClick={handleLogoutClick}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </a>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>{" "}
        <main>{children}</main>{" "}
      </div>{" "}
    </div>
  );
};

// 7. ROOT APP COMPONENT
export default function HomePage() {
  const [user, setUser] = useState<IUser | null>(null);
  const [activePage, setActivePage] = useState<string>("dashboard");
  const handleLogin = (userData: IUser) => {
    setUser(userData);
    setActivePage("dashboard");
  };
  const handleLogout = () => {
    setUser(null);
  };

  const renderContent = (): ReactNode => {
    if (!user) return null;
    const pageTitle = activePage
      .replace("-", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    switch (activePage) {
      case "dashboard":
        return user.role === "super-admin" ? (
          <SuggestedMatchesPage />
        ) : (
          <CoordinatorDashboard />
        );
      case "suggested-matches":
        return user.role === "super-admin" ? (
          <SuggestedMatchesPage />
        ) : (
          <GenericPage title="Access Denied" />
        );
      case "donations":
      case "requests":
        return <GenericPage title={pageTitle} />;
      case "reports":
        return user.role === "super-admin" ? <ReportsPage /> : <GenericPage title="Access Denied" />;
      case "profile":
        return <GenericPage title={pageTitle} />;
      default:
        return <GenericPage title="Dashboard" />;
    }
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }
  return (
    <Layout
      user={user}
      onLogout={handleLogout}
      activePage={activePage}
      setActivePage={setActivePage}
    >
      {renderContent()}
    </Layout>
  );
}
