// Sample analysis data for demonstration (NDA contract)
import { AnalysisResult } from "@/types/contract";

export const sampleNDAAnalysis: AnalysisResult = {
  overall_risk: "Medium",
  clauses: [
    {
      name: "Confidentiality",
      risk_level: "High",
      summary: "The confidentiality clause is overly broad and requires the receiving party to maintain confidentiality indefinitely, even after the agreement terminates. This could create ongoing liability without a clear end date.",
      original_text: "The Receiving Party agrees to maintain the confidentiality of all Confidential Information disclosed by the Disclosing Party in perpetuity, and shall not disclose such information to any third party without prior written consent, regardless of whether such information becomes publicly available through no fault of the Receiving Party.",
      suggested_redline: "The Receiving Party agrees to maintain the confidentiality of all Confidential Information disclosed by the Disclosing Party for a period of [X] years from the date of disclosure, or until such information becomes publicly available through no fault of the Receiving Party, whichever occurs first. The Receiving Party shall not disclose such information to any third party without prior written consent, except as required by law or court order.",
    },
    {
      name: "Term",
      risk_level: "Low",
      summary: "The term is clearly defined as 2 years from the effective date, which is reasonable for an NDA.",
      original_text: "This Agreement shall remain in effect for a period of two (2) years from the Effective Date, unless terminated earlier in accordance with the provisions herein.",
      suggested_redline: "This Agreement shall remain in effect for a period of two (2) years from the Effective Date, unless terminated earlier in accordance with the provisions herein. [No changes needed - term is reasonable]",
    },
    {
      name: "Termination",
      risk_level: "Medium",
      summary: "The termination clause allows either party to terminate with 30 days notice, but does not address what happens to information already disclosed. The confidentiality obligations should survive termination.",
      original_text: "Either party may terminate this Agreement at any time by providing thirty (30) days written notice to the other party.",
      suggested_redline: "Either party may terminate this Agreement at any time by providing thirty (30) days written notice to the other party. Upon termination, all Confidential Information shall be returned or destroyed, and the confidentiality obligations set forth herein shall survive termination for the duration specified in the Confidentiality clause.",
    },
    {
      name: "Indemnity",
      risk_level: "High",
      summary: "The indemnity clause requires the receiving party to indemnify the disclosing party for any breach, even if caused by the disclosing party's own negligence. This is one-sided and creates significant risk.",
      original_text: "The Receiving Party shall indemnify, defend, and hold harmless the Disclosing Party from and against any and all claims, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising out of or relating to any breach of this Agreement by the Receiving Party.",
      suggested_redline: "Each party shall indemnify, defend, and hold harmless the other party from and against any and all claims, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising out of or relating to any breach of this Agreement by such indemnifying party, except to the extent such claims arise from the indemnified party's gross negligence or willful misconduct.",
    },
    {
      name: "Limitation of Liability",
      risk_level: "Medium",
      summary: "The limitation of liability clause excludes indirect and consequential damages, which is standard, but the cap on direct damages may be too low depending on the nature of the confidential information.",
      original_text: "In no event shall either party's liability exceed $10,000. Neither party shall be liable for any indirect, incidental, special, or consequential damages.",
      suggested_redline: "In no event shall either party's liability exceed $[AMOUNT TO BE NEGOTIATED] or the value of the Confidential Information disclosed, whichever is greater. Neither party shall be liable for any indirect, incidental, special, or consequential damages, except in cases of willful misconduct or gross negligence.",
    },
    {
      name: "IP Ownership",
      risk_level: "Low",
      summary: "The IP ownership clause clearly states that all confidential information remains the property of the disclosing party, which is appropriate for an NDA.",
      original_text: "All Confidential Information disclosed hereunder shall remain the sole and exclusive property of the Disclosing Party. Nothing in this Agreement shall be construed as granting any license or right to use such information beyond the purposes set forth herein.",
      suggested_redline: "All Confidential Information disclosed hereunder shall remain the sole and exclusive property of the Disclosing Party. Nothing in this Agreement shall be construed as granting any license or right to use such information beyond the purposes set forth herein. [No changes needed - clause is clear and appropriate]",
    },
    {
      name: "Governing Law",
      risk_level: "Low",
      summary: "The governing law clause specifies California law, which is reasonable if both parties are located in or doing business in California.",
      original_text: "This Agreement shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles.",
      suggested_redline: "This Agreement shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles. [No changes needed if both parties are in California]",
    },
    {
      name: "Data Privacy",
      risk_level: "Medium",
      summary: "The data privacy clause is missing. Given increasing privacy regulations (GDPR, CCPA), the agreement should address how personal data within confidential information will be handled.",
      original_text: "[No data privacy clause found in the contract]",
      suggested_redline: "If any Confidential Information contains personal data as defined under applicable data protection laws (including but not limited to GDPR, CCPA), the parties agree to comply with all applicable data protection requirements. The Receiving Party shall process such personal data only as necessary for the purposes set forth in this Agreement and in accordance with applicable privacy laws.",
    },
    {
      name: "Payment Terms",
      risk_level: "Low",
      summary: "Payment terms are not applicable for a standard NDA, as NDAs typically do not involve payment obligations.",
      original_text: "[No payment terms clause found - not applicable for NDA]",
      suggested_redline: "[Not applicable for NDA]",
    },
    {
      name: "Insurance",
      risk_level: "Low",
      summary: "Insurance requirements are not typically included in NDAs, as they are usually mutual agreements without financial transactions.",
      original_text: "[No insurance clause found - not applicable for NDA]",
      suggested_redline: "[Not applicable for NDA]",
    },
  ],
};

