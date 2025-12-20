"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/analyze",
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Sign In
        </h1>
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
      </div>
    </div>
  );
}

