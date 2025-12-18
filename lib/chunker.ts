// Text chunking utility for handling long contracts

/**
 * Estimates token count (rough approximation: 1 token ≈ 4 characters)
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Splits long contract text into chunks of approximately 3000 tokens
 * Preserves context by using sentence boundaries when possible
 * @param text - Contract text to chunk
 * @param chunkSize - Target chunk size in tokens (default: 3000)
 * @param overlap - Overlap size in tokens to preserve context (default: 200)
 * @returns Array of text chunks
 */
export function chunkText(
  text: string,
  chunkSize: number = 3000,
  overlap: number = 200
): string[] {
  const estimatedTokens = estimateTokens(text);
  
  // If text is small enough, return as single chunk
  if (estimatedTokens <= chunkSize) {
    return [text];
  }

  const chunks: string[] = [];
  const targetCharSize = chunkSize * 4; // Convert tokens to approximate characters
  const overlapCharSize = overlap * 4;

  let startIndex = 0;

  while (startIndex < text.length) {
    let endIndex = Math.min(startIndex + targetCharSize, text.length);

    // Try to break at sentence boundary if not at end
    if (endIndex < text.length) {
      // Look for sentence endings within last 20% of chunk
      const searchStart = Math.max(startIndex, endIndex - targetCharSize * 0.2);
      const lastPeriod = text.lastIndexOf(". ", endIndex);
      const lastNewline = text.lastIndexOf("\n", endIndex);
      
      // Prefer period over newline, but use whichever is closer to target end
      if (lastPeriod > searchStart && lastPeriod > lastNewline) {
        endIndex = lastPeriod + 1;
      } else if (lastNewline > searchStart) {
        endIndex = lastNewline + 1;
      }
    }

    chunks.push(text.slice(startIndex, endIndex));

    // Move start index with overlap
    startIndex = endIndex - overlapCharSize;
    if (startIndex <= 0) {
      startIndex = endIndex;
    }
  }

  return chunks;
}

/**
 * Checks if text needs chunking based on token estimate
 * @param text - Text to check
 * @param threshold - Token threshold (default: 8000)
 * @returns True if chunking is needed
 */
export function needsChunking(text: string, threshold: number = 8000): boolean {
  return estimateTokens(text) > threshold;
}

