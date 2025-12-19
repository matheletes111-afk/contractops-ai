"use client";

import { useSession } from "next-auth/react";
import PricingCard from "@/components/PricingCard";

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
        "Risk assessment & scoring",
        "Suggested redlines",
        "PDF export",
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
        "Priority processing",
        "Email support",
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
        "Dashboard charts",
        "Dedicated support",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start with 1 free analysis. Upgrade when you're ready for more.
            </p>
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

