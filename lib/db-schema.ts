// TypeScript types for database schema (now using Prisma)

export type Plan = "free" | "basic" | "standard" | "premium" | "enterprise";

export type SubscriptionStatus = "pending" | "approved";

export interface User {
  id: string;
  email: string;
  emailVerified?: number | null; // timestamp
  name?: string | null;
  image?: string | null;
  plan: Plan;
  analysis_count: number;
  created_at: number;
}

export interface Contract {
  id: string;
  user_id: string;
  file_name: string;
  created_at: number;
}

export interface AnalysisResult {
  id: string;
  contract_id: string;
  user_id: string;
  risk_summary: string; // JSON stringified AnalysisResult from types/contract.ts
  clauses: string; // JSON stringified Clause[]
  created_at: number;
}

export interface SubscriptionRequest {
  id: string;
  user_id: string;
  selected_plan: "basic" | "standard" | "premium";
  payment_reference?: string;
  status: SubscriptionStatus;
  created_at: number;
}

// NextAuth adapter tables
export interface Account {
  id: string;
  user_id: string;
  type: string;
  provider: string;
  provider_account_id: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

export interface Session {
  id: string;
  session_token: string;
  user_id: string;
  expires: number;
}

export interface VerificationToken {
  id: string;
  identifier: string;
  token: string;
  expires: number;
}

