"use client";

import Link from "next/link";
import { sampleNDAAnalysis } from "@/lib/sample-data";
import RiskBadge from "@/components/RiskBadge";
import ClauseCard from "@/components/ClauseCard";
import Disclaimer from "@/components/Disclaimer";

export default function SamplePage() {
  // Sort clauses by risk level (High first)
  const sortedClauses = [...sampleNDAAnalysis.clauses].sort((a, b) => {
    const riskOrder = { High: 3, Medium: 2, Low: 1 };
    const aRisk = (riskOrder as any)[a.risk_level] || 0;
    const bRisk = (riskOrder as any)[b.risk_level] || 0;
    return bRisk - aRisk;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Sample NDA Risk Report
              </h1>
              <p className="text-gray-600">
                See what a contract risk analysis looks like. This is a sample report for demonstration purposes.
              </p>
            </div>

            {/* Disclaimer */}
            <Disclaimer />

            {/* Overall Risk */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-lg font-semibold text-gray-700">
                  Overall Risk Level:
                </span>
                <RiskBadge risk={sampleNDAAnalysis.overall_risk} size="lg" />
              </div>

              {/* CTA */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-gray-700 mb-4 font-medium">
                  Ready to analyze your own contracts?
                </p>
                <div className="flex gap-4">
                  <Link
                    href="/api/auth/signin"
                    className="px-6 py-3 rounded-lg font-semibold bg-[#FF9933] text-white hover:bg-[#E6892A] transition-all"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    href="/pricing"
                    className="px-6 py-3 rounded-lg font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all"
                  >
                    View Pricing
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Findings Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Findings ({sampleNDAAnalysis.clauses.length} clauses analyzed)
            </h2>
            <div className="space-y-6">
              {sortedClauses.map((clause, index) => (
                <ClauseCard key={`${clause.name}-${index}`} clause={clause} />
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="bg-[#FF9933] rounded-xl p-8 text-center text-white mb-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-6 opacity-90">
              Start with 1 free contract analysis. No credit card required.
            </p>
            <Link
              href="/api/auth/signin"
              className="inline-block px-8 py-3 rounded-lg font-semibold bg-white text-[#FF9933] hover:bg-gray-100 shadow-md hover:shadow-lg transition-all"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

