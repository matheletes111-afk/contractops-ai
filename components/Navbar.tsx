"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="text-xl font-bold text-[#FF9933]">
            ContractOps AI
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-[#FF9933] transition-colors"
            >
              {t("home")}
            </Link>
            <Link
              href="/pricing"
              className="text-gray-700 hover:text-[#FF9933] transition-colors"
            >
              {t("pricing")}
            </Link>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "hi" ? "en" : "hi")}
              className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-colors"
            >
              {language === "hi" ? "EN" : "हिं"}
            </button>

            {/* Auth Section */}
            {status === "loading" ? (
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-[#FF9933] transition-colors"
                >
                  {t("dashboard")}
                </Link>
                <Link
                  href="/analyze"
                  className="px-4 py-2 rounded-lg font-semibold bg-[#FF9933] text-white hover:bg-[#E6892A] transition-all"
                >
                  {t("startAnalyzing")}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-4 py-2 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              <Link
                href="/api/auth/signin"
                className="px-4 py-2 rounded-lg font-semibold bg-[#FF9933] text-white hover:bg-[#E6892A] transition-all"
              >
                {t("login")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

