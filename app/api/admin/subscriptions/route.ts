// API route for admins to view and manage subscription requests
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-config";
import {
  getAllSubscriptionRequests,
  approveSubscriptionRequest,
  rejectSubscriptionRequest,
  isAdminEmail,
} from "@/lib/db-operations";

export const runtime = "nodejs";

// GET - Get all subscription requests
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
    const email = user.email;

    // Check if user is admin
    if (!isAdminEmail(email)) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Get all subscription requests
    const requests = await getAllSubscriptionRequests();

    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Error in admin subscriptions route:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// POST - Approve or reject subscription request
export async function POST(request: NextRequest) {
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
    const email = user.email;

    // Check if user is admin
    if (!isAdminEmail(email)) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { requestId, action } = body;

    if (!requestId || !action) {
      return NextResponse.json(
        { error: "Request ID and action are required" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      const success = await approveSubscriptionRequest(requestId);
      if (!success) {
        return NextResponse.json(
          { error: "Failed to approve subscription request" },
          { status: 500 }
        );
      }
      return NextResponse.json({
        success: true,
        message: "Subscription request approved successfully",
      });
    } else if (action === "reject") {
      const success = await rejectSubscriptionRequest(requestId);
      if (!success) {
        return NextResponse.json(
          { error: "Failed to reject subscription request" },
          { status: 500 }
        );
      }
      return NextResponse.json({
        success: true,
        message: "Subscription request rejected successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'approve' or 'reject'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in admin subscriptions POST route:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

