"use client";

import Link from "next/link";

interface PricingCardProps {
  name: string;
  price: number;
  analyses: number;
  features: string[];
  isPopular?: boolean;
  planId: "basic" | "standard" | "premium";
  currentPlan?: string;
}

export default function PricingCard({
  name,
  price,
  analyses,
  features,
  isPopular = false,
  planId,
  currentPlan,
}: PricingCardProps) {
  const isCurrentPlan = currentPlan === planId;

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-8 ${
        isPopular ? "border-2 border-[#FF9933] relative" : "border border-gray-200"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-[#FF9933] text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-gray-900">₹{price}</span>
          <span className="text-gray-600">/month</span>
        </div>
        <p className="text-gray-600">{analyses} contract analyses</p>
      </div>
      <div className="mb-8">
        <ul className="space-y-3 max-h-[500px] overflow-y-auto">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="w-5 h-5 text-[#FF9933] mr-3 mt-0.5 flex-shrink-0"
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
              <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      {isCurrentPlan ? (
        <button
          disabled
          className="w-full py-3 px-4 rounded-lg font-semibold bg-gray-200 text-gray-600 cursor-not-allowed"
        >
          Current Plan
        </button>
      ) : (
        <Link
          href={`/subscribe?plan=${planId}`}
          className={`block w-full py-3 px-4 rounded-lg font-semibold text-center transition-all ${
            isPopular
              ? "bg-[#FF9933] text-white hover:bg-[#E6892A] shadow-md hover:shadow-lg"
              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
          }`}
        >
          {planId === "basic" || planId === "standard" || planId === "premium"
            ? "Subscribe"
            : "Contact Sales"}
        </Link>
      )}
    </div>
  );
}

