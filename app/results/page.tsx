"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnalysisResult } from "@/types/contract";
import RiskBadge from "@/components/RiskBadge";
import ClauseCard from "@/components/ClauseCard";
import { exportToPDF } from "@/lib/pdf-export";

export default function ResultsPage() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    // Get analysis result from sessionStorage
    try {
      const stored = sessionStorage.getItem("analysisResult");
      if (stored) {
        try {
          // Check size before parsing to prevent "Invalid array length" errors
          if (stored.length > 10 * 1024 * 1024) { // 10MB
            console.error("Stored data too large");
            sessionStorage.removeItem("analysisResult");
            setIsLoading(false);
            return;
          }
          
          const result = JSON.parse(stored) as AnalysisResult;
          
          // Validate and sanitize the result
          if (result && typeof result === 'object' && Array.isArray(result.clauses)) {
            // Ensure clauses array is reasonable size
            if (result.clauses.length > 10000) {
              console.warn("Clauses array too large, truncating");
              result.clauses = result.clauses.slice(0, 100);
            }
            setAnalysisResult(result);
          } else {
            console.error("Invalid result structure");
            sessionStorage.removeItem("analysisResult");
          }
        } catch (parseError: any) {
          console.error("Error parsing analysis result:", parseError);
          // Handle "Invalid array length" error specifically
          if (parseError?.message?.includes("Invalid array length") || 
              parseError?.name === "RangeError" ||
              parseError?.message?.includes("too large") ||
              parseError?.message?.includes("RangeError")) {
            sessionStorage.removeItem("analysisResult");
            // Set error state to show error message
            setParseError("Invalid array length - Analysis result is too large to display. Please try analyzing a shorter contract.");
          } else {
            sessionStorage.removeItem("analysisResult");
            setParseError("Failed to load analysis result. Please try analyzing again.");
          }
        }
      }
    } catch (error: any) {
      console.error("Error accessing sessionStorage:", error);
      if (error?.message?.includes("Invalid array length") || error?.name === "RangeError") {
        setParseError("Invalid array length - Analysis result is too large. Please try analyzing a shorter contract.");
      }
    }
    setIsLoading(false);
  }, []);

  const handleExportPDF = () => {
    if (analysisResult) {
      try {
        exportToPDF(analysisResult);
      } catch (error: any) {
        console.error("Error exporting PDF:", error);
        alert("Failed to export PDF. The result may be too large.");
      }
    }
  };

  const handleNewAnalysis = () => {
    sessionStorage.removeItem("analysisResult");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading results...</div>
      </div>
    );
  }

  // Show parse error if one occurred
  if (parseError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{parseError}</p>
          <button
            onClick={handleNewAnalysis}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            No Analysis Found
          </h2>
          <p className="text-gray-600 mb-6">
            Please upload a contract to analyze.
          </p>
          <button
            onClick={handleNewAnalysis}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Upload Contract
          </button>
        </div>
      </div>
    );
  }

  if (analysisResult.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{analysisResult.error}</p>
          <button
            onClick={handleNewAnalysis}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Sort clauses by risk level (High first) with error handling
  let sortedClauses: typeof analysisResult.clauses;
  try {
    // Use Array.from or slice instead of spread to avoid "Invalid array length" errors
    const clausesCopy = Array.isArray(analysisResult.clauses) 
      ? Array.from(analysisResult.clauses) 
      : [];
    
    const riskOrder = { High: 3, Medium: 2, Low: 1 };
    sortedClauses = clausesCopy.sort((a, b) => {
      const aRisk = (riskOrder as any)[a.risk_level] || 0;
      const bRisk = (riskOrder as any)[b.risk_level] || 0;
      return bRisk - aRisk;
    });
  } catch (sortError: any) {
    console.error("Error sorting clauses:", sortError);
    // If sorting fails, use original array
    sortedClauses = Array.isArray(analysisResult.clauses) ? analysisResult.clauses : [];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Contract Analysis Results
                </h1>
                <p className="text-gray-600">
                  Review the risk assessment and suggested redlines below
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Export PDF
                </button>
                <button
                  onClick={handleNewAnalysis}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
                >
                  New Analysis
                </button>
              </div>
            </div>

            {/* Overall Risk */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-gray-700">
                  Overall Risk Level:
                </span>
                <RiskBadge risk={analysisResult.overall_risk} size="lg" />
              </div>
            </div>
          </div>

          {/* Findings Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Findings ({analysisResult.clauses.length} clauses analyzed)
            </h2>
            <div className="space-y-6">
              {sortedClauses.length > 0 ? (
                sortedClauses.map((clause, index) => (
                  <ClauseCard key={`${clause.name}-${index}`} clause={clause} />
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-600">
                    No clauses were found in the contract.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

