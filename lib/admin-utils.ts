// Utility functions for admin checks
// Note: This is for UI purposes only. Real authorization happens on the server.

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  
  // Check environment variable for admin emails
  // In production, set ADMIN_EMAILS in your .env file
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];
  return adminEmails.includes(email);
}

