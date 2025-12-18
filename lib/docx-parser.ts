// DOCX text extraction using mammoth
import mammoth from "mammoth";

/**
 * Extracts text from a DOCX file buffer
 * @param buffer - DOCX file as Buffer
 * @returns Extracted text as string
 */
export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  } catch (error) {
    console.error("Error parsing DOCX:", error);
    throw new Error("Failed to extract text from DOCX file");
  }
}

