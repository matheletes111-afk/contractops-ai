"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PayphoneQRModal from "./PayphoneQRModal";

interface SubscriptionFormProps {
  planId: "basic" | "standard" | "premium";
  planName: string;
  amount: number;
}

export default function SubscriptionForm({
  planId,
  planName,
  amount,
}: SubscriptionFormProps) {
  const router = useRouter();
  const [showQR, setShowQR] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: planId,
          name,
          email,
          payment_reference: paymentReference || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit subscription request");
      }

      // Show success and redirect
      router.push("/dashboard?subscription=pending");
    } catch (err) {
      console.error("Subscription error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Subscribe to {planName} Plan
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9933] focus:border-transparent text-black"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9933] focus:border-transparent text-black"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Reference (Optional)
          </label>
          <input
            type="text"
            value={paymentReference}
            onChange={(e) => setPaymentReference(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9933] focus:border-transparent text-black"
            placeholder="Transaction ID or reference number"
          />
          <p className="text-sm text-gray-500 mt-1">
            Provide your payment transaction reference if available
          </p>
        </div>

        <div className="bg-[#FF9933] bg-opacity-10 border border-[#FF9933] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900">Total Amount:</span>
            <span className="text-2xl font-bold text-[#FF9933]">₹{amount}</span>
          </div>
          <p className="text-sm text-gray-600">
            Please scan the QR code and complete payment before submitting
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setShowQR(true)}
            className="flex-1 py-3 px-4 rounded-lg font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all"
          >
            Show QR Code
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 rounded-lg font-semibold bg-[#FF9933] text-white hover:bg-[#E6892A] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>

      <PayphoneQRModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        planName={planName}
        amount={amount}
      />
    </div>
  );
}

