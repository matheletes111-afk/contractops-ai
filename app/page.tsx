"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function LandingPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI Contract Risk Analyzer
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get instant risk analysis and suggested redlines for your legal contracts.
            Powered by AI to help you make informed decisions faster.
          </p>
          <div className="flex gap-4 justify-center">
            {status === "loading" ? (
              <div className="px-8 py-3 rounded-lg bg-gray-300 animate-pulse"></div>
            ) : session ? (
              <Link
                href="/analyze"
                className="px-8 py-3 rounded-lg font-semibold text-white bg-[#FF9933] hover:bg-[#E6892A] shadow-md hover:shadow-lg transition-all"
              >
                Start Analyzing
              </Link>
            ) : (
              <Link
                href="/api/auth/signin"
                className="px-8 py-3 rounded-lg font-semibold text-white bg-[#FF9933] hover:bg-[#E6892A] shadow-md hover:shadow-lg transition-all"
              >
                Get Started Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#FF9933] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
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
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Upload Contracts
              </h3>
              <p className="text-gray-600">
                Support for PDF and DOCX files. Simply upload and let AI do the work.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#FF9933] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Risk Analysis
              </h3>
              <p className="text-gray-600">
                Analyze 10 key contract clauses with risk scoring and detailed insights.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#FF9933] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Suggested Redlines
              </h3>
              <p className="text-gray-600">
                Get AI-generated improved versions of risky clauses to strengthen your contracts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center bg-[#FF9933] rounded-xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start with 1 free contract analysis. No credit card required.
          </p>
          {status === "loading" ? (
            <div className="px-8 py-3 rounded-lg bg-white/20 animate-pulse inline-block"></div>
          ) : session ? (
            <Link
              href="/analyze"
              className="inline-block px-8 py-3 rounded-lg font-semibold bg-white text-[#FF9933] hover:bg-gray-100 shadow-md hover:shadow-lg transition-all"
            >
              Analyze Your Contract
            </Link>
          ) : (
            <Link
              href="/api/auth/signin"
              className="inline-block px-8 py-3 rounded-lg font-semibold bg-white text-[#FF9933] hover:bg-gray-100 shadow-md hover:shadow-lg transition-all"
            >
              Sign Up Free
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
