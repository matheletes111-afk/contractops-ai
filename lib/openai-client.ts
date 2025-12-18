// OpenAI API wrapper for contract analysis
import OpenAI from "openai";
import { AnalysisResult, Clause, ErrorResult, RiskLevel } from "@/types/contract";
import { chunkText, needsChunking } from "./chunker";

const REQUIRED_CLAUSES = [
  "Term",
  "Termination",
  "Indemnity",
  "Limitation of Liability",
  "Confidentiality",
  "IP Ownership",
  "Governing Law",
  "Data Privacy",
  "Insurance",
  "Payment Terms",
];

/**
 * Creates the prompt for contract analysis
 */
function createAnalysisPrompt(contractText: string): string {
  return `You are a legal contract risk analyzer. Analyze the following contract and extract these 10 key clauses:

${REQUIRED_CLAUSES.map((c, i) => `${i + 1}. ${c}`).join("\n")}

For each clause found in the contract:
1. Assess the risk level as "Low", "Medium", or "High" based on:
   - Unfavorable terms to the client
   - Ambiguity or lack of clarity
   - Missing protections
   - Unusual or onerous conditions

2. Provide a plain-English summary explaining the risk and what the clause means

3. Extract the exact original text of the clause from the contract

4. Suggest an improved redline version that reduces risk or adds clarity

If a clause is not found, you may omit it from the results.

After analyzing all found clauses, determine an overall risk level for the entire contract:
- "Low": Contract is generally favorable with minimal concerns
- "Medium": Some concerning clauses but manageable with negotiation
- "High": Significant risks that require substantial changes

Return your analysis as a JSON object in this EXACT format:
{
  "overall_risk": "Low" | "Medium" | "High",
  "clauses": [
    {
      "name": "Clause Name",
      "risk_level": "Low" | "Medium" | "High",
      "summary": "Plain-English explanation of the clause and its risks",
      "original_text": "Exact clause text from the contract",
      "suggested_redline": "Improved version of the clause text"
    }
  ]
}

Contract text:
${contractText}`;
}

/**
 * Analyzes a contract chunk using OpenAI
 */
async function analyzeChunk(
  client: OpenAI,
  chunk: string
): Promise<AnalysisResult> {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a legal contract risk analyzer. Always return valid JSON matching the specified format.",
        },
        {
          role: "user",
          content: createAnalysisPrompt(chunk),
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Lower temperature for more consistent analysis
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const result = JSON.parse(content) as AnalysisResult;

    // Validate structure
    if (!result.overall_risk || !Array.isArray(result.clauses)) {
      throw new Error("Invalid response structure");
    }

    return result;
  } catch (error) {
    console.error("Error analyzing chunk:", error);
    throw error;
  }
}

/**
 * Merges multiple analysis results into a single result
 * Prioritizes high-risk findings and combines clauses
 */
function mergeResults(results: AnalysisResult[]): AnalysisResult {
  if (results.length === 0) {
    return {
      overall_risk: "Low",
      clauses: [],
      error: "No analysis results to merge",
    };
  }

  if (results.length === 1) {
    return results[0];
  }

  // Collect all clauses, avoiding duplicates by name
  const clauseMap = new Map<string, Clause>();

  for (const result of results) {
    for (const clause of result.clauses) {
      const existing = clauseMap.get(clause.name);
      // Prefer higher risk levels if duplicate
      if (!existing || getRiskPriority(clause.risk_level) > getRiskPriority(existing.risk_level)) {
        clauseMap.set(clause.name, clause);
      }
    }
  }

  const clauses = Array.from(clauseMap.values());

  // Determine overall risk (highest risk level found)
  const riskLevels = results.map((r) => r.overall_risk);
  const overallRisk = riskLevels.reduce((highest, current) => {
    return getRiskPriority(current) > getRiskPriority(highest) ? current : highest;
  }, "Low" as const);

  return {
    overall_risk: overallRisk,
    clauses,
  };
}

/**
 * Gets numeric priority for risk level (higher = more risky)
 */
function getRiskPriority(risk: string): number {
  switch (risk) {
    case "High":
      return 3;
    case "Medium":
      return 2;
    case "Low":
      return 1;
    default:
      return 0;
  }
}

/**
 * Truncates long texts in clauses to prevent oversized JSON responses
 * This prevents "Invalid array length" errors when serializing large responses
 */
function truncateClauseTexts(result: AnalysisResult, maxLength: number = 10000): AnalysisResult {
  return {
    ...result,
    clauses: result.clauses.map((clause) => ({
      ...clause,
      original_text: clause.original_text.length > maxLength
        ? clause.original_text.substring(0, maxLength) + "... [truncated]"
        : clause.original_text,
      suggested_redline: clause.suggested_redline.length > maxLength
        ? clause.suggested_redline.substring(0, maxLength) + "... [truncated]"
        : clause.suggested_redline,
      summary: clause.summary.length > maxLength
        ? clause.summary.substring(0, maxLength) + "... [truncated]"
        : clause.summary,
    })),
  };
}

/**
 * Analyzes a contract using OpenAI
 * Handles chunking for long contracts automatically
 */
export async function analyzeContract(
  contractText: string
): Promise<AnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const errorResult: ErrorResult = {
      overall_risk: "Low",
      clauses: [],
      error: "OpenAI API key not configured",
    };
    return errorResult;
  }

  const client = new OpenAI({ apiKey });

  try {
    // Check if chunking is needed
    if (needsChunking(contractText)) {
      const chunks = chunkText(contractText);
      console.log(`Processing contract in ${chunks.length} chunks`);

      // Process chunks sequentially
      const results: AnalysisResult[] = [];
      for (let i = 0; i < chunks.length; i++) {
        console.log(`Analyzing chunk ${i + 1}/${chunks.length}`);
        const result = await analyzeChunk(client, chunks[i]);
        results.push(result);
      }

      // Merge results and truncate long texts
      const merged = mergeResults(results);
      return truncateClauseTexts(merged);
    } else {
      // Single analysis and truncate long texts
      const result = await analyzeChunk(client, contractText);
      return truncateClauseTexts(result);
    }
  } catch (error) {
    console.error("Error in contract analysis:", error);
    const errorResult: ErrorResult = {
      overall_risk: "Low",
      clauses: [],
      error:
        error instanceof Error
          ? error.message
          : "Failed to analyze contract. Please try again.",
    };
    return errorResult;
  }
}

