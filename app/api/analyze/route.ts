// API route for contract analysis
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-config";
import { extractTextFromPDF } from "@/lib/pdf-parser";
import { extractTextFromDOCX } from "@/lib/docx-parser";
import { analyzeContract } from "@/lib/openai-client";
import { AnalysisResult } from "@/types/contract";
import { shouldBlockFreeUser } from "@/lib/usage-limits";
import { createContract, saveAnalysis, incrementAnalysisCount, getUserById } from "@/lib/db-operations";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes for long contracts

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to analyze contracts." },
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

    // Get current user data from database
    const dbUser = await getUserById(userId);
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found. Please sign in again." },
        { status: 401 }
      );
    }

    // Check usage limits
    if (shouldBlockFreeUser(dbUser.plan, dbUser.analysis_count)) {
      return NextResponse.json(
        { error: "Usage limit exceeded. Please upgrade your plan to continue.", redirect: "/pricing" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    const isPDF = fileType === "application/pdf" || fileName.endsWith(".pdf");
    const isDOCX =
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".docx");

    if (!isPDF && !isDOCX) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PDF or DOCX file." },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text based on file type
    let contractText: string;
    try {
      if (isPDF) {
        contractText = await extractTextFromPDF(buffer);
      } else {
        contractText = await extractTextFromDOCX(buffer);
      }
    } catch (error) {
      console.error("Error extracting text:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown error occurred during text extraction";
      
      // Provide more specific error messages
      let userMessage = "Failed to extract text from file. ";
      if (errorMessage.includes("PDF header")) {
        userMessage += "The file does not appear to be a valid PDF.";
      } else if (errorMessage.includes("corrupted") || errorMessage.includes("invalid")) {
        userMessage += "The file may be corrupted or in an unsupported format.";
      } else {
        userMessage += "Please ensure the file is not corrupted and try again.";
      }
      
      return NextResponse.json(
        {
          error: userMessage,
          details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
        },
        { status: 500 }
      );
    }

    if (!contractText || contractText.trim().length === 0) {
      return NextResponse.json(
        { error: "No text could be extracted from the file." },
        { status: 400 }
      );
    }

    // Analyze contract
    let analysisResult: AnalysisResult;
    try {
      analysisResult = await analyzeContract(contractText);
    } catch (error) {
      console.error("Error analyzing contract:", error);
      return NextResponse.json(
        {
          error:
            "Failed to analyze contract. Please check your OpenAI API key and try again.",
        },
        { status: 500 }
      );
    }

    // Save to database (before serialization)
    const contractId = await createContract(userId, file.name);
    if (contractId) {
      await saveAnalysis(contractId, userId, analysisResult);
      await incrementAnalysisCount(userId);
    } else {
      console.error("Failed to save contract to database");
      // Still return the result even if DB save fails
    }

    // Validate and serialize response with error handling for oversized data
    try {
      // Try to serialize - if it fails with "Invalid array length", truncate and retry
      let jsonString: string;
      try {
        jsonString = JSON.stringify(analysisResult);
        const maxResponseSize = 10 * 1024 * 1024; // 10MB limit for JSON response
        
        if (jsonString.length > maxResponseSize) {
          console.warn(`Response size (${jsonString.length}) exceeds limit, truncating further`);
          // Further truncate if still too large
          analysisResult.clauses = analysisResult.clauses.map((clause) => ({
            ...clause,
            original_text: clause.original_text.substring(0, 5000) + "... [truncated due to size]",
            suggested_redline: clause.suggested_redline.substring(0, 5000) + "... [truncated due to size]",
          }));
          jsonString = JSON.stringify(analysisResult);
        }
      } catch (stringifyError: any) {
        // Handle "Invalid array length" error during JSON.stringify
        if (stringifyError?.message?.includes("Invalid array length") || 
            stringifyError?.message?.includes("RangeError") ||
            stringifyError?.name === "RangeError") {
          console.warn("JSON.stringify failed with array length error, truncating further");
          // Aggressively truncate clause texts
          analysisResult.clauses = analysisResult.clauses.map((clause) => ({
            ...clause,
            original_text: clause.original_text.substring(0, 3000) + "... [truncated due to size limits]",
            suggested_redline: clause.suggested_redline.substring(0, 3000) + "... [truncated due to size limits]",
          }));
          // Try serializing again
          try {
            jsonString = JSON.stringify(analysisResult);
          } catch (retryError: any) {
            // If still fails, return error
            return NextResponse.json(
              {
                error: "Analysis result is too large to return. The contract may be too long. Please try with a shorter contract or split it into sections.",
              },
              { status: 500 }
            );
          }
        } else {
          throw stringifyError;
        }
      }
      
      return NextResponse.json(analysisResult);
    } catch (serializeError: any) {
      console.error("Error serializing response:", serializeError);
      // Final fallback for any other serialization errors
      if (serializeError?.message?.includes("Invalid array length") || 
          serializeError?.message?.includes("RangeError") ||
          serializeError?.name === "RangeError") {
        return NextResponse.json(
          {
            error: "Analysis result is too large to return. The contract may be too long. Please try with a shorter contract or split it into sections.",
          },
          { status: 500 }
        );
      }
      throw serializeError;
    }
  } catch (error) {
    console.error("Unexpected error in analyze route:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}

