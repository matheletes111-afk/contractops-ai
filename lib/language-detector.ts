// Language detection utilities for contract analysis

/**
 * Detects if text contains Hindi (Devanagari script)
 * Simple detection based on Devanagari Unicode range
 */
export function detectLanguage(text: string): "hindi" | "english" | "mixed" {
  if (!text || text.length === 0) return "english";
  
  // Devanagari Unicode range: U+0900 to U+097F
  const devanagariRegex = /[\u0900-\u097F]/;
  
  // Count Devanagari characters
  const devanagariMatches = text.match(/[\u0900-\u097F]/g);
  const devanagariCount = devanagariMatches ? devanagariMatches.length : 0;
  
  // Count total characters (excluding whitespace)
  const totalChars = text.replace(/\s/g, "").length;
  
  // If more than 30% Devanagari, consider it Hindi
  const hindiRatio = totalChars > 0 ? devanagariCount / totalChars : 0;
  
  if (hindiRatio > 0.3) {
    return "hindi";
  } else if (hindiRatio > 0.1) {
    return "mixed";
  }
  
  return "english";
}

/**
 * Get Hindi translations for clause names
 */
export const HINDI_CLAUSES = {
  "Term": "अवधि",
  "Termination": "समाप्ति",
  "Indemnity": "क्षतिपूर्ति",
  "Limitation of Liability": "दायित्व की सीमा",
  "Confidentiality": "गोपनीयता",
  "IP Ownership": "बौद्धिक संपदा स्वामित्व",
  "Governing Law": "शासी कानून",
  "Data Privacy": "डेटा गोपनीयता",
  "Insurance": "बीमा",
  "Payment Terms": "भुगतान शर्तें",
};

/**
 * Get clause names based on language
 */
export function getClauseNames(language: "hindi" | "english" | "mixed"): string[] {
  const englishClauses = [
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
  
  if (language === "hindi") {
    return Object.values(HINDI_CLAUSES);
  }
  
  return englishClauses;
}

