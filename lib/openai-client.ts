// OpenAI API wrapper for contract analysis
import OpenAI from "openai";
import { AnalysisResult, Clause, ErrorResult, RiskLevel } from "@/types/contract";
import { chunkText, needsChunking } from "./chunker";
import { detectLanguage, getClauseNames, HINDI_CLAUSES } from "./language-detector";

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
 * Creates the prompt for contract analysis with language support
 */
function createAnalysisPrompt(contractText: string, language: "hindi" | "english" | "mixed" = "english"): string {
  const clauseNames = getClauseNames(language);
  const isHindi = language === "hindi" || language === "mixed";
  
  // Create bilingual clause list for Hindi contracts
  const clauseList = isHindi 
    ? REQUIRED_CLAUSES.map((eng, i) => `${i + 1}. ${eng} (${HINDI_CLAUSES[eng as keyof typeof HINDI_CLAUSES]})`)
    : REQUIRED_CLAUSES.map((c, i) => `${i + 1}. ${c}`);
  
  const languageInstruction = isHindi
    ? `This contract is in Hindi (or mixed Hindi/English). Please analyze it accordingly:
- Extract clauses in their original language (Hindi or English as they appear)
- Provide summaries in Hindi if the clause is in Hindi, or in English if the clause is in English
- Use the same language for suggested redlines as the original clause
- Clause names can be in English or Hindi (use what matches the contract)`
    : `This contract is in English. Analyze it accordingly.`;

  return `You are a legal contract risk analyzer. ${languageInstruction}

Analyze the following contract and extract these 10 key clauses:

${clauseList.join("\n")}

For each clause found in the contract:
1. Assess the risk level as "Low", "Medium", or "High" based on:
   - Unfavorable terms to the client
   - Ambiguity or lack of clarity
   - Missing protections
   - Unusual or onerous conditions

2. Provide a summary explaining the risk and what the clause means. ${isHindi ? "Use Hindi if the clause is in Hindi, English if in English." : "Use plain English."}

3. Extract the exact original text of the clause from the contract (preserve the original language)

4. Suggest an improved redline version that reduces risk or adds clarity (use the same language as the original clause)

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
      "name": "Clause Name (in English or Hindi as appropriate)",
      "risk_level": "Low" | "Medium" | "High",
      "summary": "Explanation of the clause and its risks (in the same language as the clause)",
      "original_text": "Exact clause text from the contract (preserve original language)",
      "suggested_redline": "Improved version of the clause text (in the same language as original)"
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
  chunk: string,
  language: "hindi" | "english" | "mixed" = "english"
): Promise<AnalysisResult> {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a legal contract risk analyzer. Always return valid JSON matching the specified format. You can analyze contracts in English, Hindi, or mixed languages.",
        },
        {
          role: "user",
          content: createAnalysisPrompt(chunk, language),
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
  try {
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

    // Limit the number of results to merge to prevent array issues
    const maxResults = 100;
    const resultsToMerge = results.slice(0, maxResults);

    // Collect all clauses, avoiding duplicates by name
    const clauseMap = new Map<string, Clause>();
    const maxClauses = 200; // Limit total clauses to prevent array length issues

    for (const result of resultsToMerge) {
      if (result.clauses && Array.isArray(result.clauses)) {
        for (const clause of result.clauses) {
          if (clauseMap.size >= maxClauses) break;
          
          const existing = clauseMap.get(clause.name);
          // Prefer higher risk levels if duplicate
          if (!existing || getRiskPriority(clause.risk_level) > getRiskPriority(existing.risk_level)) {
            clauseMap.set(clause.name, clause);
          }
        }
      }
    }

    // Safely convert map to array
    let clauses: Clause[];
    try {
      clauses = Array.from(clauseMap.values());
    } catch (arrayError: any) {
      console.error("Error converting clause map to array:", arrayError);
      // If Array.from fails, try manual iteration with limit
      clauses = [];
      let count = 0;
      for (const clause of clauseMap.values()) {
        if (count >= maxClauses) break;
        clauses.push(clause);
        count++;
      }
    }

    // Determine overall risk (highest risk level found)
    const riskLevels = resultsToMerge.map((r) => r.overall_risk || "Low");
    const overallRisk = riskLevels.reduce((highest, current) => {
      return getRiskPriority(current) > getRiskPriority(highest) ? current : highest;
    }, "Low" as const);

    return {
      overall_risk: overallRisk,
      clauses,
    };
  } catch (error: any) {
    console.error("Error merging results:", error);
    // Return minimal result if merging fails
    return {
      overall_risk: "Low",
      clauses: [],
      error: error?.message?.includes("Invalid array length") || error?.name === "RangeError"
        ? "The contract is too large to process. Please try with a shorter contract."
        : "Failed to merge analysis results. Please try again.",
    };
  }
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
  try {
    // Limit the number of clauses to prevent array length issues
    const maxClauses = 100;
    const clausesToProcess = result.clauses && Array.isArray(result.clauses) 
      ? result.clauses.slice(0, maxClauses)
      : [];
    
    // Safely truncate clause texts
    const truncatedClauses = clausesToProcess.map((clause) => {
      try {
        return {
          ...clause,
          original_text: clause.original_text && clause.original_text.length > maxLength
            ? clause.original_text.substring(0, maxLength) + "... [truncated]"
            : (clause.original_text || ""),
          suggested_redline: clause.suggested_redline && clause.suggested_redline.length > maxLength
            ? clause.suggested_redline.substring(0, maxLength) + "... [truncated]"
            : (clause.suggested_redline || ""),
          summary: clause.summary && clause.summary.length > maxLength
            ? clause.summary.substring(0, maxLength) + "... [truncated]"
            : (clause.summary || ""),
        };
      } catch (clauseError: any) {
        // If individual clause processing fails, return minimal clause
        console.warn("Error processing clause:", clauseError);
        return {
          ...clause,
          original_text: (clause.original_text || "").substring(0, 5000),
          suggested_redline: (clause.suggested_redline || "").substring(0, 5000),
          summary: (clause.summary || "").substring(0, 1000),
        };
      }
    });
    
    return {
      ...result,
      clauses: truncatedClauses,
    };
  } catch (error: any) {
    // If truncation fails completely, return minimal result
    console.error("Error in truncateClauseTexts:", error);
    
    // Don't propagate raw error messages, especially "Invalid array length"
    const errorMessage = (error?.message?.includes("Invalid array length") || 
                          error?.name === "RangeError")
      ? "Analysis result is too large to process. Please try with a shorter contract."
      : "Analysis result is too large to process. Please try with a shorter contract.";
    
    return {
      overall_risk: result.overall_risk || "Low",
      clauses: [],
      error: errorMessage,
    };
  }
}

/**
 * Analyzes a contract using OpenAI
 * Handles chunking for long contracts automatically
 * Supports Hindi and English contracts
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
    // Detect language of the contract
    const language = detectLanguage(contractText);
    console.log(`Detected contract language: ${language}`);

    // Check if chunking is needed
    if (needsChunking(contractText)) {
      const chunks = chunkText(contractText);
      console.log(`Processing contract in ${chunks.length} chunks`);

      // Process chunks sequentially
      const results: AnalysisResult[] = [];
      for (let i = 0; i < chunks.length; i++) {
        console.log(`Analyzing chunk ${i + 1}/${chunks.length}`);
        const result = await analyzeChunk(client, chunks[i], language);
        results.push(result);
      }

      // Merge results and truncate long texts
      const merged = mergeResults(results);
      return truncateClauseTexts(merged);
    } else {
      // Single analysis and truncate long texts
      const result = await analyzeChunk(client, contractText, language);
      return truncateClauseTexts(result);
    }
  } catch (error) {
    console.error("Error in contract analysis:", error);
    
    // Transform "Invalid array length" errors into user-friendly messages
    let errorMessage = "Failed to analyze contract. Please try again.";
    if (error instanceof Error) {
      if (error.message?.includes("Invalid array length") || 
          error.message?.includes("RangeError") ||
          error.name === "RangeError") {
        errorMessage = "The contract is too large to process. Please try with a shorter contract or split it into sections.";
      } else {
        errorMessage = error.message;
      }
    }
    
    const errorResult: ErrorResult = {
      overall_risk: "Low",
      clauses: [],
      error: errorMessage,
    };
    return errorResult;
  }
}

