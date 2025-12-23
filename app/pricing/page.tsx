"use client";

import { useSession } from "next-auth/react";
import PricingCard from "@/components/PricingCard";
import Disclaimer from "@/components/Disclaimer";

export default function PricingPage() {
  const { data: session } = useSession();
  const currentPlan = (session?.user as any)?.plan;

  const plans = [
    {
      name: "Basic",
      price: 999,
      analyses: 30,
      planId: "basic" as const,
      features: [
        "30 contract analyses per month",
        "AI-powered risk assessment & scoring",
        "10 key clause analysis (Term, Termination, Indemnity, etc.)",
        "Suggested redlines for risky clauses",
        "PDF export of analysis reports",
        "Contract history & status tracking",
        "Uploaded, Analyzed, Downloaded status badges",
        "English & Hindi contract support",
        "Email support (48-hour response)",
      ],
    },
    {
      name: "Standard",
      price: 1499,
      analyses: 70,
      planId: "standard" as const,
      isPopular: true,
      features: [
        "70 contract analyses per month",
        "Everything in Basic",
        "Priority processing (faster analysis)",
        "Unlimited contract history storage",
        "Advanced risk scoring & insights",
        "Detailed clause-by-clause breakdown",
        "Export multiple reports in batch",
        "Email support (24-hour response)",
        "Priority feature requests",
      ],
    },
    {
      name: "Premium",
      price: 2999,
      analyses: 100,
      planId: "premium" as const,
      features: [
        "100 contract analyses per month",
        "Everything in Standard",
        "Real-time processing dashboard",
        "Advanced analytics & trends",
        "Custom risk assessment criteria",
        "Bulk contract upload & analysis",
        "API access (coming soon)",
        "Dedicated account manager",
        "Priority support (4-hour response)",
        "Custom integrations support",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              Start with 1 free analysis. Upgrade when you're ready for more.
            </p>
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm font-medium text-green-800">
                Free plan includes: 1 analysis, contract history, PDF export, and all core features
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mb-12">
            <Disclaimer />
          </div>

          {/* Key Features Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              All Plans Include
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-[#FF9933] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-white"
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
                <h3 className="font-semibold text-gray-900 mb-2">Contract History</h3>
                <p className="text-sm text-gray-600">
                  Track all your contracts with status badges (Uploaded, Analyzed, Downloaded)
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-[#FF9933] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-white"
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
                <h3 className="font-semibold text-gray-900 mb-2">AI Risk Analysis</h3>
                <p className="text-sm text-gray-600">
                  Analyze 10 key clauses with AI-powered risk scoring and insights
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-[#FF9933] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-white"
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
                <h3 className="font-semibold text-gray-900 mb-2">Smart Redlines</h3>
                <p className="text-sm text-gray-600">
                  Get AI-generated improved versions of risky clauses
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <PricingCard
                key={plan.planId}
                name={plan.name}
                price={plan.price}
                analyses={plan.analyses}
                features={plan.features}
                isPopular={plan.isPopular}
                planId={plan.planId}
                currentPlan={currentPlan}
              />
            ))}
          </div>

          {/* Enterprise Option */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border-2 border-gray-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
            <p className="text-gray-600 mb-6">
              Need more? Contact us for custom pricing and dedicated support.
            </p>
            <a
              href="mailto:sales@contractops-ai.com"
              className="inline-block px-8 py-3 rounded-lg font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-all"
            >
              Contact Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

