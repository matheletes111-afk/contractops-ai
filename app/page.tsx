"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import Disclaimer from "@/components/Disclaimer";
import ClauseCard from "@/components/ClauseCard";
import RiskBadge from "@/components/RiskBadge";
import Reveal from "@/components/Reveal";
import { sampleNDAAnalysis } from "@/lib/sample-data";

const previewClause = sampleNDAAnalysis.clauses.find(
  (c) => c.name === "Confidentiality"
)!;

const pricingTeaser = [
  { name: "Basic", price: 999, analyses: 30, planId: "basic" },
  { name: "Standard", price: 1499, analyses: 70, planId: "standard", isPopular: true },
  { name: "Premium", price: 2999, analyses: 100, planId: "premium" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ContractOps AI",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI contract risk analyzer that scores risk across key clauses and suggests redlines for legal contracts.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
    description: "1 free contract analysis, no card required",
  },
};

export default function LandingPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-[#E6892A] text-sm font-semibold mb-6">
            AI-Powered Contract Review
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI Contract Risk Analyzer
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get instant risk analysis and suggested redlines for your legal contracts.
            Powered by AI to help you spot risk and negotiate with confidence.
          </p>
          <div className="flex gap-4 justify-center">
            {status === "loading" ? (
              <div className="px-8 py-3 rounded-lg bg-gray-300 animate-pulse"></div>
            ) : session ? (
              <Link
                href="/analyze"
                className="px-8 py-3 rounded-lg font-semibold text-white bg-[#FF9933] hover:bg-[#E6892A] shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                Start Analyzing
              </Link>
            ) : (
              <Link
                href="/api/auth/signin"
                className="px-8 py-3 rounded-lg font-semibold text-white bg-[#FF9933] hover:bg-[#E6892A] shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                Get Started Free
              </Link>
            )}
          </div>
          <div className="mt-8">
            <Link
              href="/sample"
              className="text-[#FF9933] hover:text-[#E6892A] font-medium underline"
            >
              See a sample NDA risk report →
            </Link>
          </div>

          {/* Quick capability strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-10 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#FF9933]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              10 key clause types analyzed
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#FF9933]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              English &amp; Hindi contracts
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#FF9933]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              1 free analysis, no card required
            </span>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Disclaimer />
        </div>
      </section>

      {/* How It Works */}
      <Reveal>
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Upload Your Contract", desc: "Drop in a PDF or DOCX file. English or Hindi, no formatting needed." },
                { step: "2", title: "AI Analyzes 10 Key Clauses", desc: "Every clause is risk-scored with a plain-language explanation of why." },
                { step: "3", title: "Get Redlines & Export", desc: "Review suggested redlines and download a full PDF report in seconds." },
              ].map((item) => (
                <div key={item.step} className="text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-[#FF9933] text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Live Preview */}
      <Reveal>
        <section className="container mx-auto px-4 py-16 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">See It In Action</h2>
              <p className="text-gray-600">
                A real clause from our sample NDA analysis — overall risk:{" "}
                <RiskBadge risk={sampleNDAAnalysis.overall_risk} size="sm" />
              </p>
            </div>
            <ClauseCard clause={previewClause} />
            <div className="text-center mt-6">
              <Link
                href="/sample"
                className="text-[#FF9933] hover:text-[#E6892A] font-medium underline"
              >
                View the full sample report →
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Features Section */}
      <Reveal>
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Key Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-xl transition-transform hover:-translate-y-1">
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

              <div className="text-center p-6 rounded-xl transition-transform hover:-translate-y-1">
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

              <div className="text-center p-6 rounded-xl transition-transform hover:-translate-y-1">
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
      </Reveal>

      {/* Trust Section */}
      <Reveal>
        <section className="container mx-auto px-4 py-16 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Built to Be Trusted
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 border border-gray-200 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">Your contracts stay yours</h3>
                <p className="text-sm text-gray-600">
                  Uploaded contracts are used only to generate your analysis, never to train AI models.
                </p>
              </div>
              <div className="p-6 border border-gray-200 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">A first-pass review, not legal advice</h3>
                <p className="text-sm text-gray-600">
                  ContractOps AI flags risk and suggests redlines to speed up your own or your lawyer&apos;s review.
                </p>
              </div>
              <div className="p-6 border border-gray-200 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">Built for Indian businesses</h3>
                <p className="text-sm text-gray-600">
                  Native support for English and Hindi contracts, with pricing in INR.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Pricing Teaser */}
      <Reveal>
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
              Simple, Transparent Pricing
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Start free. Upgrade only when you need more analyses.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {pricingTeaser.map((plan) => (
                <div
                  key={plan.planId}
                  className={`bg-white rounded-xl shadow-sm p-6 text-center transition-shadow hover:shadow-lg ${
                    plan.isPopular ? "border-2 border-[#FF9933]" : "border border-gray-200"
                  }`}
                >
                  {plan.isPopular && (
                    <span className="inline-block bg-[#FF9933] text-white px-3 py-1 rounded-full text-xs font-semibold mb-3">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-gray-900">₹{plan.price}</span>
                    <span className="text-gray-600">/mo</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{plan.analyses} analyses / month</p>
                  <Link
                    href={`/subscribe?plan=${plan.planId}`}
                    className="block w-full py-2.5 rounded-lg font-semibold text-sm bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all"
                  >
                    Choose {plan.name}
                  </Link>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/pricing"
                className="text-[#FF9933] hover:text-[#E6892A] font-medium underline"
              >
                Compare all plans &amp; features →
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* CTA Section */}
      <Reveal>
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
      </Reveal>
    </div>
  );
}
