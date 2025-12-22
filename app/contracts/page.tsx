"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RiskBadge from "@/components/RiskBadge";
import Disclaimer from "@/components/Disclaimer";

interface Contract {
  id: string;
  fileName: string;
  createdAt: number;
  status: "Uploaded" | "Analyzed" | "Downloaded";
  riskScore: "Low" | "Medium" | "High" | null;
  analysisId: string | null;
}

export default function ContractsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=/contracts");
      return;
    }

    if (sessionStatus === "authenticated") {
      fetchContracts();
    }
  }, [sessionStatus, router]);

  const fetchContracts = async () => {
    try {
      const response = await fetch("/api/contracts");
      if (!response.ok) {
        throw new Error("Failed to fetch contracts");
      }
      const data = await response.json();
      setContracts(data.contracts || []);
    } catch (err) {
      console.error("Error fetching contracts:", err);
      setError("Failed to load contracts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "Downloaded":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            Downloaded
          </span>
        );
      case "Analyzed":
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            Analyzed
          </span>
        );
      case "Uploaded":
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            Uploaded
          </span>
        );
    }
  };

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9933] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Contracts</h1>
            <p className="text-gray-600">
              View and manage all your uploaded contracts and their analysis results.
            </p>
          </div>

          {/* Disclaimer */}
          <Disclaimer />

          {/* Contracts Table */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            ) : contracts.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No contracts yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Upload your first contract to get started with risk analysis.
                </p>
                <Link
                  href="/analyze"
                  className="inline-block px-6 py-3 rounded-lg font-semibold bg-[#FF9933] text-white hover:bg-[#E6892A] transition-all"
                >
                  Upload Contract
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Contract Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Risk Score
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((contract) => (
                      <tr
                        key={contract.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">
                            {new Date(contract.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">
                            {contract.fileName}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {contract.riskScore ? (
                            <RiskBadge risk={contract.riskScore} />
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(contract.status)}
                        </td>
                        <td className="py-3 px-4">
                          {contract.analysisId ? (
                            <Link
                              href={`/results?analysisId=${contract.analysisId}`}
                              className="text-sm text-[#FF9933] hover:text-[#E6892A] font-medium"
                            >
                              View Results
                            </Link>
                          ) : (
                            <span className="text-sm text-gray-400">
                              Not analyzed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/analyze"
                className="px-6 py-3 rounded-lg font-semibold bg-[#FF9933] text-white hover:bg-[#E6892A] transition-all"
              >
                Analyze New Contract
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-lg font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

