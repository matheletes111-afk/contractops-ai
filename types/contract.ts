// TypeScript interfaces for contract analysis

export type RiskLevel = "Low" | "Medium" | "High";

export interface Clause {
  name: string;
  risk_level: RiskLevel;
  summary: string;
  original_text: string;
  suggested_redline: string;
}

export interface AnalysisResult {
  overall_risk: RiskLevel;
  clauses: Clause[];
  error?: string;
}

// Error fallback type - uses Low as default risk when error occurs
export interface ErrorResult {
  overall_risk: RiskLevel;
  clauses: [];
  error: string;
}

