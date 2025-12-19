// Helper functions for database operations using Prisma
import { prisma } from "./prisma";
import type { User, Contract, AnalysisResult as DBAnalysisResult, SubscriptionRequest } from "./db-schema";
import type { AnalysisResult } from "@/types/contract";

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) return null;
    
    // Convert Prisma user to our User type
    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified ? user.emailVerified.getTime() : null,
      name: user.name,
      image: user.image,
      plan: user.plan as "free" | "basic" | "standard" | "premium" | "enterprise",
      analysis_count: user.analysisCount,
      created_at: user.createdAt.getTime(),
    };
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) return null;
    
    // Convert Prisma user to our User type
    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified ? user.emailVerified.getTime() : null,
      name: user.name,
      image: user.image,
      plan: user.plan as "free" | "basic" | "standard" | "premium" | "enterprise",
      analysis_count: user.analysisCount,
      created_at: user.createdAt.getTime(),
    };
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
}

/**
 * Create a new contract record
 */
export async function createContract(userId: string, fileName: string): Promise<string | null> {
  try {
    const contract = await prisma.contract.create({
      data: {
        userId,
        fileName,
      },
    });

    return contract.id;
  } catch (error) {
    console.error("Error creating contract:", error);
    return null;
  }
}

/**
 * Save analysis result to database
 */
export async function saveAnalysis(
  contractId: string,
  userId: string,
  analysisResult: AnalysisResult
): Promise<string | null> {
  try {
    const result = await prisma.analysisResult.create({
      data: {
        contractId,
        userId,
        riskSummary: JSON.stringify({ overall_risk: analysisResult.overall_risk }),
        clauses: JSON.stringify(analysisResult.clauses),
      },
    });

    return result.id;
  } catch (error) {
    console.error("Error saving analysis:", error);
    return null;
  }
}

/**
 * Increment user's analysis count
 */
export async function incrementAnalysisCount(userId: string): Promise<boolean> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        analysisCount: {
          increment: 1,
        },
      },
    });

    return true;
  } catch (error) {
    console.error("Error incrementing analysis count:", error);
    return false;
  }
}

/**
 * Create subscription request
 */
export async function createSubscriptionRequest(
  userId: string,
  selectedPlan: "basic" | "standard" | "premium",
  paymentReference?: string
): Promise<string | null> {
  try {
    const request = await prisma.subscriptionRequest.create({
      data: {
        userId,
        selectedPlan,
        paymentReference: paymentReference || null,
        status: "pending",
      },
    });

    return request.id;
  } catch (error) {
    console.error("Error creating subscription request:", error);
    return null;
  }
}
