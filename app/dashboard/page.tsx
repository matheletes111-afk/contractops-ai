"use client";

import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    const subStatus = searchParams.get("subscription");
    if (subStatus === "pending") {
      setSubscriptionStatus("pending");
    }
  }, [searchParams]);

  // Show loading state while session is being fetched
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
  const plan = user?.plan || "free";
  const analysisCount = user?.analysis_count || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user?.name || user?.email || "User"}
            </p>
          </div>

          {/* Subscription Status */}
          {subscriptionStatus === "pending" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Subscription Request Submitted
              </h3>
              <p className="text-blue-700">
                Your subscription request is pending approval. You'll receive an email once it's approved.
              </p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Current Plan</h3>
              <p className="text-2xl font-bold text-gray-900 capitalize">{plan}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Analyses Used</h3>
              <p className="text-2xl font-bold text-[#FF9933]">{analysisCount}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Status</h3>
              <p className="text-2xl font-bold text-green-600">Active</p>
            </div>
          </div>

          {/* Charts Section (Placeholder) */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Usage Analytics</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Chart Placeholder 1 */}
              <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p className="text-gray-500">Chart Placeholder</p>
                  <p className="text-sm text-gray-400 mt-2">Monthly Analysis Trend</p>
                </div>
              </div>

              {/* Chart Placeholder 2 */}
              <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                    />
                  </svg>
                  <p className="text-gray-500">Chart Placeholder</p>
                  <p className="text-sm text-gray-400 mt-2">Risk Distribution</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <a
                href="/analyze"
                className="px-6 py-3 rounded-lg font-semibold bg-[#FF9933] text-white hover:bg-[#E6892A] transition-all"
              >
                Analyze Contract
              </a>
              <a
                href="/pricing"
                className="px-6 py-3 rounded-lg font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all"
              >
                Upgrade Plan
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

