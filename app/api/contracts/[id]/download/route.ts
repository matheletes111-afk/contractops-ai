// API route to mark analysis as downloaded
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-config";
import { markAnalysisDownloaded } from "@/lib/db-operations";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const analysisId = params.id;

    if (!analysisId) {
      return NextResponse.json(
        { error: "Analysis ID is required." },
        { status: 400 }
      );
    }

    // Mark as downloaded
    const success = await markAnalysisDownloaded(analysisId);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to mark analysis as downloaded." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking analysis as downloaded:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}

