// Usage limit checking logic
import type { Plan } from "./db-schema";

export function getLimitForPlan(plan: Plan): number {
  switch (plan) {
    case "free":
      return 1;
    case "basic":
      return 30;
    case "standard":
      return 70;
    case "premium":
      return 100;
    case "enterprise":
      return Infinity; // Unlimited
    default:
      return 1;
  }
}

export function canAnalyze(plan: Plan, analysisCount: number): boolean {
  const limit = getLimitForPlan(plan);
  return analysisCount < limit;
}

export function shouldBlockFreeUser(plan: Plan, analysisCount: number): boolean {
  // Block if user is on free plan and has used their 1 free analysis
  return plan === "free" && analysisCount >= 1;
}

