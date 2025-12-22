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

/**
 * Get subscription requests for a user
 */
export async function getUserSubscriptionRequests(userId: string) {
  try {
    const requests = await prisma.subscriptionRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    return requests.map((req) => ({
      id: req.id,
      selectedPlan: req.selectedPlan,
      paymentReference: req.paymentReference,
      status: req.status,
      createdAt: req.createdAt.getTime(),
      user: {
        email: req.user.email,
        name: req.user.name,
      },
    }));
  } catch (error) {
    console.error("Error getting user subscription requests:", error);
    return [];
  }
}

/**
 * Get all subscription requests (for admin)
 */
export async function getAllSubscriptionRequests() {
  try {
    const requests = await prisma.subscriptionRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            plan: true,
          },
        },
      },
    });

    return requests.map((req) => ({
      id: req.id,
      userId: req.userId,
      selectedPlan: req.selectedPlan,
      paymentReference: req.paymentReference,
      status: req.status,
      createdAt: req.createdAt.getTime(),
      user: {
        email: req.user.email,
        name: req.user.name,
        currentPlan: req.user.plan,
      },
    }));
  } catch (error) {
    console.error("Error getting all subscription requests:", error);
    return [];
  }
}

/**
 * Approve subscription request and update user plan
 */
export async function approveSubscriptionRequest(
  requestId: string
): Promise<boolean> {
  try {
    // Get the request
    const request = await prisma.subscriptionRequest.findUnique({
      where: { id: requestId },
    });

    if (!request || request.status !== "pending") {
      return false;
    }

    // Update request status and user plan in a transaction
    await prisma.$transaction([
      prisma.subscriptionRequest.update({
        where: { id: requestId },
        data: { status: "approved" },
      }),
      prisma.user.update({
        where: { id: request.userId },
        data: { plan: request.selectedPlan },
      }),
    ]);

    return true;
  } catch (error) {
    console.error("Error approving subscription request:", error);
    return false;
  }
}

/**
 * Reject subscription request
 */
export async function rejectSubscriptionRequest(
  requestId: string
): Promise<boolean> {
  try {
    // For now, we'll just delete rejected requests
    // You could also add a "rejected" status if needed
    await prisma.subscriptionRequest.delete({
      where: { id: requestId },
    });

    return true;
  } catch (error) {
    console.error("Error rejecting subscription request:", error);
    return false;
  }
}

/**
 * Check if user is admin (based on email)
 */
export function isAdminEmail(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];
  return adminEmails.includes(email);
}

/**
 * Get all contracts for a user with their analysis results
 */
export async function getUserContracts(userId: string) {
  try {
    const contracts = await prisma.contract.findMany({
      where: { userId },
      include: {
        analysisResults: {
          orderBy: { createdAt: "desc" },
          take: 1, // Get the latest analysis result
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return contracts.map((contract) => {
      const latestAnalysis = contract.analysisResults[0];
      let status: "Uploaded" | "Analyzed" | "Downloaded" = "Uploaded";
      let riskScore: "Low" | "Medium" | "High" | null = null;

      if (latestAnalysis) {
        status = latestAnalysis.downloadedAt ? "Downloaded" : "Analyzed";
        try {
          const riskSummary = JSON.parse(latestAnalysis.riskSummary);
          riskScore = riskSummary.overall_risk || null;
        } catch (e) {
          // If parsing fails, riskScore remains null
        }
      }

      return {
        id: contract.id,
        fileName: contract.fileName,
        createdAt: contract.createdAt.getTime(),
        status,
        riskScore,
        analysisId: latestAnalysis?.id || null,
      };
    });
  } catch (error) {
    console.error("Error getting user contracts:", error);
    return [];
  }
}

/**
 * Mark an analysis result as downloaded
 */
export async function markAnalysisDownloaded(analysisId: string): Promise<boolean> {
  try {
    await prisma.analysisResult.update({
      where: { id: analysisId },
      data: {
        downloadedAt: new Date(),
      },
    });

    return true;
  } catch (error) {
    console.error("Error marking analysis as downloaded:", error);
    return false;
  }
}