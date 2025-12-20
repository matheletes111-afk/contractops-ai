"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SubscriptionRequest {
  id: string;
  userId: string;
  selectedPlan: string;
  paymentReference: string | null;
  status: string;
  createdAt: number;
  user: {
    email: string;
    name: string | null;
    currentPlan: string;
  };
}

const planPrices: Record<string, number> = {
  basic: 999,
  standard: 1499,
  premium: 2999,
};

export default function AdminSubscriptionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<SubscriptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=/admin/subscriptions");
    }
  }, [status, router]);

  useEffect(() => {
    fetchRequests();
  }, [status, filter]);

  const fetchRequests = async () => {
    if (status === "authenticated") {
      try {
        const response = await fetch("/api/admin/subscriptions");
        if (response.ok) {
          const data = await response.json();
          let filteredRequests = data.requests || [];
          
          if (filter !== "all") {
            filteredRequests = filteredRequests.filter(
              (req: SubscriptionRequest) => req.status === filter
            );
          }
          
          setRequests(filteredRequests);
        } else if (response.status === 403) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching subscription requests:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAction = async (requestId: string, action: "approve" | "reject") => {
    setProcessing(requestId);
    try {
      const response = await fetch("/api/admin/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId, action }),
      });

      if (response.ok) {
        // Refresh the list
        await fetchRequests();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to process request");
      }
    } catch (error) {
      console.error("Error processing request:", error);
      alert("An error occurred while processing the request");
    } finally {
      setProcessing(null);
    }
  };

  // Show loading state
  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9933] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const user = session.user as any;
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const totalRevenue = requests
    .filter((r) => r.status === "approved")
    .reduce((sum, r) => sum + (planPrices[r.selectedPlan] || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Admin - Subscription Management
                </h1>
                <p className="text-gray-600">
                  Manage subscription requests and payments
                </p>
              </div>
              <a
                href="/dashboard"
                className="px-4 py-2 rounded-lg font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all"
              >
                Back to Dashboard
              </a>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Requests</h3>
              <p className="text-3xl font-bold text-gray-900">{requests.length}</p>
            </div>
            <div className="bg-yellow-50 rounded-xl shadow-lg p-6 border-2 border-yellow-200">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Pending</h3>
              <p className="text-3xl font-bold text-yellow-900">{pendingCount}</p>
            </div>
            <div className="bg-green-50 rounded-xl shadow-lg p-6 border-2 border-green-200">
              <h3 className="text-sm font-medium text-green-800 mb-2">Approved</h3>
              <p className="text-3xl font-bold text-green-900">{approvedCount}</p>
            </div>
            <div className="bg-blue-50 rounded-xl shadow-lg p-6 border-2 border-blue-200">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-blue-900">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex gap-4">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === "all"
                    ? "bg-[#FF9933] text-white"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === "pending"
                    ? "bg-[#FF9933] text-white"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setFilter("approved")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === "approved"
                    ? "bg-[#FF9933] text-white"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                Approved ({approvedCount})
              </button>
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Subscription Requests</h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9933] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading subscription requests...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No subscription requests found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">User</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Current Plan</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Requested Plan</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Payment Reference</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Date</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr
                        key={request.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {request.user.name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">{request.user.email}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="capitalize text-sm font-medium text-gray-700">
                            {request.user.currentPlan}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="capitalize font-semibold text-gray-900">
                            {request.selectedPlan}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-[#FF9933]">
                            ₹{planPrices[request.selectedPlan]?.toLocaleString() || "N/A"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-600">
                            {request.paymentReference ? (
                              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                                {request.paymentReference}
                              </span>
                            ) : (
                              <span className="text-gray-400 italic">Not provided</span>
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              request.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : request.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {request.status === "approved"
                              ? "✓ Approved"
                              : request.status === "pending"
                              ? "⏳ Pending"
                              : "Rejected"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-600">
                            {new Date(request.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {request.status === "pending" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAction(request.id, "approve")}
                                disabled={processing === request.id}
                                className="px-3 py-1.5 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all text-sm"
                              >
                                {processing === request.id ? "..." : "Approve"}
                              </button>
                              <button
                                onClick={() => handleAction(request.id, "reject")}
                                disabled={processing === request.id}
                                className="px-3 py-1.5 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all text-sm"
                              >
                                {processing === request.id ? "..." : "Reject"}
                              </button>
                            </div>
                          )}
                          {request.status === "approved" && (
                            <span className="text-sm text-green-600 font-medium">✓ Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

