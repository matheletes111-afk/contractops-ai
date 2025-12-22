// API route to fetch a single analysis result by ID
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-config";
import { prisma } from "@/lib/prisma";
import { AnalysisResult } from "@/types/contract";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const user = session.user as any;
    const userId = user.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found. Please sign in again." },
        { status: 401 }
      );
    }

    const { id: analysisId } = await params;

    if (!analysisId) {
      return NextResponse.json(
        { error: "Analysis ID is required." },
        { status: 400 }
      );
    }

    // Get analysis result from database
    const analysis = await prisma.analysisResult.findUnique({
      where: { id: analysisId },
      include: {
        contract: true,
      },
    });

    if (!analysis) {
      return NextResponse.json(
        { error: "Analysis not found." },
        { status: 404 }
      );
    }

    // Verify the analysis belongs to the user
    if (analysis.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to this analysis." },
        { status: 403 }
      );
    }

    // Parse the stored analysis result
    try {
      const riskSummary = JSON.parse(analysis.riskSummary);
      const clauses = JSON.parse(analysis.clauses);

      const result: AnalysisResult = {
        overall_risk: riskSummary.overall_risk,
        clauses: clauses,
      };

      return NextResponse.json(result);
    } catch (parseError) {
      console.error("Error parsing analysis result:", parseError);
      return NextResponse.json(
        { error: "Failed to parse analysis result." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching analysis:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}

