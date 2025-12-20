// API route for users to view their subscription requests
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-config";
import { getUserSubscriptionRequests } from "@/lib/db-operations";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = session.user as any;
    const userId = user.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found" },
        { status: 401 }
      );
    }

    // Get user's subscription requests
    const requests = await getUserSubscriptionRequests(userId);

    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Error in subscriptions route:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

