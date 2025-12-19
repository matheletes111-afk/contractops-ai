// Auth utilities and session helpers
import { auth } from "./auth-config";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export function getUserPlan(user: any): "free" | "basic" | "standard" | "premium" | "enterprise" {
  return user?.plan || "free";
}

export function getUserAnalysisCount(user: any): number {
  return user?.analysis_count || 0;
}

