// API route for subscription requests
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-config";
import { createSubscriptionRequest } from "@/lib/db-operations";

export const runtime = "nodejs";

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
    const userId = user.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan, payment_reference } = body;

    if (!plan || !["basic", "standard", "premium"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    // Create subscription request
    const requestId = await createSubscriptionRequest(
      userId,
      plan,
      payment_reference
    );

    if (!requestId) {
      return NextResponse.json(
        { error: "Failed to create subscription request" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subscription request submitted successfully",
      requestId,
    });
  } catch (error) {
    console.error("Error in subscribe route:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

