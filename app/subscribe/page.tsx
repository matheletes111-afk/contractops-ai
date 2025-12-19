"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import SubscriptionForm from "@/components/SubscriptionForm";

const planDetails = {
  basic: { name: "Basic", amount: 999 },
  standard: { name: "Standard", amount: 1499 },
  premium: { name: "Premium", amount: 2999 },
};

export default function SubscribePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const planId = (searchParams.get("plan") || "basic") as "basic" | "standard" | "premium";
  const plan = planDetails[planId];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=/subscribe?plan=" + planId);
    }
  }, [status, router, planId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Subscribe</h1>
          <p className="text-gray-600">Complete your subscription to {plan.name} plan</p>
        </div>
        <SubscriptionForm planId={planId} planName={plan.name} amount={plan.amount} />
      </div>
    </div>
  );
}

