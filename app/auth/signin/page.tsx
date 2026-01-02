"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Force dynamic rendering to prevent prerender errors
export const dynamic = 'force-dynamic';

function SignInForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/analyze";

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setMessage("");
    try {
      await signIn("google", {
        callbackUrl,
        redirect: true,
      });
    } catch (error: any) {
      console.error("Google sign in error:", error);
      setMessage("Failed to sign in with Google. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        console.error("Sign in error:", result.error);
        
        // Provide more specific error messages
        const errorLower = result.error.toLowerCase();
        
        // Check if it's an adapter/database error (email was sent but database operation failed)
        const isAdapterError = errorLower.includes("adapter") || 
                               errorLower.includes("adaptererror") ||
                               errorLower.includes("database") ||
                               errorLower.includes("prisma") ||
                               errorLower.includes("query") ||
                               errorLower.includes("connection");
        
        // If it's an adapter error, email was likely sent successfully, so show success
        if (isAdapterError) {
          setMessage("Check your email for a magic link to sign in. (Note: There was a database error, but your email was sent. The link may not work due to the database issue.)");
        } else if (errorLower.includes("email") && (
            errorLower.includes("configuration") || 
            errorLower.includes("not configured"))) {
          setMessage(
            "Email service is not configured. Please add EMAIL_SERVER or SMTP_* environment variables to your .env.local file. See SETUP.md for details."
          );
        } else if (errorLower.includes("authentication") || errorLower.includes("invalid login") || errorLower.includes("535")) {
          setMessage("Email authentication failed. For Gmail, make sure you're using an App Password (not your regular password).");
        } else if (errorLower.includes("connection") || errorLower.includes("econnrefused") || errorLower.includes("timeout")) {
          setMessage("Could not connect to email server. Please check your SMTP settings.");
        } else {
          // For other errors, show a simple generic message
          setMessage("Failed to send email. Please try again.");
        }
      } else {
        setMessage("Check your email for a magic link to sign in.");
      }
    } catch (error: any) {
      console.error("Sign in exception:", error);
      const errorMessage = error?.message || "Unknown error occurred";
      setMessage(`An error occurred: ${errorMessage}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Sign In to ContractOps AI
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Get started with 1 free contract analysis
        </p>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="w-full py-3 px-4 rounded-lg font-semibold bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 mb-4"
        >
          {isGoogleLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        {/* Email Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.includes("Check your email")
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message}
              {message.includes("EMAIL_SERVER") && (
                <div className="mt-2 text-xs bg-red-100 p-2 rounded border border-red-300">
                  <p className="font-semibold mb-1">Quick Setup:</p>
                  <p className="mb-1">Add to your <code className="bg-red-200 px-1 rounded">.env.local</code> file:</p>
                  <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
{`EMAIL_SERVER=smtp://user:pass@smtp.example.com:587
EMAIL_FROM=noreply@yourdomain.com`}
                  </pre>
                  <p className="mt-1 text-xs">Or use SMTP variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD</p>
                </div>
              )}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg font-semibold bg-[#FF9933] text-white hover:bg-[#E6892A] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? "Sending..." : "Send Magic Link"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          We'll send you a magic link to sign in. No password required.
        </p>
        <p className="mt-2 text-xs text-gray-500 text-center">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}

