"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/FileUpload";
import Disclaimer from "@/components/Disclaimer";
import { AnalysisResult } from "@/types/contract";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle usage limit exceeded - redirect to pricing
        if (errorData.redirect === "/pricing") {
          router.push("/pricing");
          return;
        }
        
        throw new Error(errorData.error || "Failed to analyze contract");
      }

      // Parse response with error handling for oversized data
      let result: AnalysisResult & { analysisId?: string | null };
      try {
        const responseText = await response.text();
        result = JSON.parse(responseText);
      } catch (parseError: any) {
        console.error("Error parsing response:", parseError);
        if (parseError?.message?.includes("Invalid array length") || 
            parseError?.name === "RangeError" ||
            parseError?.message?.includes("too large")) {
          throw new Error("Analysis result is too large. The contract may be too long. Please try with a shorter contract.");
        }
        throw new Error("Failed to parse analysis result. Please try again.");
      }

      // Store result in sessionStorage with size check
      try {
        // Extract analysisId before storing
        const analysisId = result.analysisId;
        const resultToStore: AnalysisResult = {
          overall_risk: result.overall_risk,
          clauses: result.clauses,
          error: result.error,
        };

        const jsonString = JSON.stringify(resultToStore);
        // sessionStorage has a ~5-10MB limit depending on browser
        const maxStorageSize = 4 * 1024 * 1024; // 4MB limit to be safe
        
        if (jsonString.length > maxStorageSize) {
          console.warn("Result too large for sessionStorage, truncating...");
          // Further truncate clause texts if needed
          resultToStore.clauses = resultToStore.clauses.map((clause) => ({
            ...clause,
            original_text: clause.original_text.substring(0, 3000) + "... [truncated for storage]",
            suggested_redline: clause.suggested_redline.substring(0, 3000) + "... [truncated for storage]",
          }));
        }
        
        sessionStorage.setItem("analysisResult", JSON.stringify(resultToStore));
        if (analysisId) {
          sessionStorage.setItem("analysisId", analysisId);
        }
        router.push("/results");
      } catch (storageError: any) {
        console.error("Error storing result:", storageError);
        if (storageError?.name === "QuotaExceededError" || storageError?.message?.includes("QuotaExceeded")) {
          throw new Error("Analysis result is too large to store. Please try with a shorter contract.");
        }
        throw new Error("Failed to store analysis result. Please try again.");
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setError(
        err instanceof Error ? err.message : "An error occurred. Please try again."
      );
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-12 max-w-md text-center">
          <div className="mb-6">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#FF9933] border-t-transparent"></div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Analyzing Contract
          </h2>
          <p className="text-gray-600">
            Extracting text and analyzing clauses...
          </p>
          <p className="text-sm text-gray-500 mt-4">
            This may take a minute for large contracts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Contract Risk Analyzer
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Upload your contract to get instant risk analysis and suggested
              redlines
            </p>
            <p className="text-sm text-gray-500">
              Supports English and Hindi (हिंदी) contracts in PDF or DOCX format
            </p>
          </div>

          {/* Disclaimer */}
          <Disclaimer />

          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Analyze Button */}
          <div className="text-center">
            <button
              onClick={handleAnalyze}
              disabled={!file || isProcessing}
              className={`
                px-8 py-3 rounded-lg font-semibold text-white
                transition-all duration-200
                ${
                  file && !isProcessing
                    ? "bg-[#FF9933] hover:bg-[#E6892A] shadow-md hover:shadow-lg"
                    : "bg-gray-400 cursor-not-allowed"
                }
              `}
            >
              Analyze Contract
            </button>
          </div>

          {/* Info Section */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              What we analyze:
            </h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Term, Termination, Indemnity, Limitation of Liability</li>
              <li>• Confidentiality, IP Ownership, Governing Law</li>
              <li>• Data Privacy, Insurance, Payment Terms</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

