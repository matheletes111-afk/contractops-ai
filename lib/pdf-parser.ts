// PDF text extraction using pdf-parse
// This module is server-only (used in API routes)

/**
 * Polyfill DOM APIs required by pdf-parse
 * These are needed because pdf-parse uses pdfjs-dist which expects browser DOM APIs
 */
function setupDOMPolyfills() {
  // Polyfill DOMMatrix
  if (typeof globalThis.DOMMatrix === "undefined") {
    globalThis.DOMMatrix = class DOMMatrix {
      a: number = 1;
      b: number = 0;
      c: number = 0;
      d: number = 1;
      e: number = 0;
      f: number = 0;
      m11: number = 1;
      m12: number = 0;
      m21: number = 0;
      m22: number = 1;
      m41: number = 0;
      m42: number = 0;

      constructor(init?: any) {
        if (init) {
          if (Array.isArray(init)) {
            this.a = init[0] || 1;
            this.b = init[1] || 0;
            this.c = init[2] || 0;
            this.d = init[3] || 1;
            this.e = init[4] || 0;
            this.f = init[5] || 0;
          }
        }
      }

      static fromMatrix(other?: any) {
        return new DOMMatrix();
      }

      static fromFloat32Array(array: Float32Array) {
        return new DOMMatrix();
      }

      static fromFloat64Array(array: Float64Array) {
        return new DOMMatrix();
      }

      multiply(other?: any) {
        return new DOMMatrix();
      }

      translate(x?: number, y?: number) {
        return new DOMMatrix();
      }

      scale(x?: number, y?: number) {
        return new DOMMatrix();
      }

      scaleSelf(x?: number, y?: number) {
        return this;
      }

      scale3d(x?: number, y?: number, z?: number) {
        return new DOMMatrix();
      }

      rotate(angle?: number) {
        return new DOMMatrix();
      }

      rotateFromVector(x?: number, y?: number) {
        return new DOMMatrix();
      }

      flipX() {
        return new DOMMatrix();
      }

      flipY() {
        return new DOMMatrix();
      }

      inverse() {
        return new DOMMatrix();
      }

      transformPoint(point?: any) {
        return { x: 0, y: 0, z: 0, w: 1 };
      }

      toFloat32Array() {
        return new Float32Array(16);
      }

      toFloat64Array() {
        return new Float64Array(16);
      }

      toString() {
        return "matrix(1, 0, 0, 1, 0, 0)";
      }
    } as any;
  }

  // Polyfill ImageData
  if (typeof globalThis.ImageData === "undefined") {
    globalThis.ImageData = class ImageData {
      data: Uint8ClampedArray;
      width: number;
      height: number;
      colorSpace: string = "srgb";

      constructor(dataOrWidth: any, heightOrSettings?: number | any, settings?: any) {
        if (typeof dataOrWidth === "number") {
          this.width = dataOrWidth;
          this.height = heightOrSettings as number || dataOrWidth;
          this.data = new Uint8ClampedArray(this.width * this.height * 4);
        } else {
          this.data = dataOrWidth;
          this.width = heightOrSettings || 1;
          this.height = dataOrWidth.length / (4 * this.width);
        }
      }
    } as any;
  }

  // Polyfill Path2D
  if (typeof globalThis.Path2D === "undefined") {
    globalThis.Path2D = class Path2D {
      constructor(path?: any) {}
      addPath(path: any, transform?: any) {}
      closePath() {}
      moveTo(x: number, y: number) {}
      lineTo(x: number, y: number) {}
      bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {}
      quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {}
      arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {}
      arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {}
      ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {}
      rect(x: number, y: number, w: number, h: number) {}
    } as any;
  }
}

/**
 * Extracts text from a PDF file buffer
 * @param buffer - PDF file as Buffer
 * @returns Extracted text as string
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Setup DOM polyfills before importing pdf-parse
    setupDOMPolyfills();

    // Validate buffer
    if (!buffer || buffer.length === 0) {
      throw new Error("Empty or invalid PDF buffer provided");
    }

    // Check if it's a valid PDF by looking for PDF header
    const header = buffer.slice(0, 4).toString();
    if (header !== "%PDF") {
      throw new Error("File does not appear to be a valid PDF (missing PDF header)");
    }

    // Use require for server-side Node.js compatibility
    // pdf-parse v1.1.1 has a simple function-based API
    // Mark as external in next.config to avoid bundling issues
    const pdfParse = require("pdf-parse");
    
    // Ensure buffer is a proper Buffer instance
    // The buffer parameter is typed as Buffer, but we'll ensure it's valid
    const pdfBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer as any);
    
    // Validate buffer size (prevent extremely large files that could cause "Invalid array length")
    const maxSize = 50 * 1024 * 1024; // 50MB limit
    if (pdfBuffer.length > maxSize) {
      throw new Error(`PDF file is too large (${(pdfBuffer.length / 1024 / 1024).toFixed(2)}MB). Maximum size is 50MB.`);
    }
    
    // Check for potentially problematic PDFs (very small or corrupted)
    if (pdfBuffer.length < 100) {
      throw new Error("PDF file appears to be too small or corrupted");
    }
    
    // pdf-parse v1.1.1 exports a function directly
    // Call it with the buffer to extract text
    // Wrap in try-catch to handle "Invalid array length" errors specifically
    let data: any;
    try {
      data = await pdfParse(pdfBuffer);
    } catch (parseError: any) {
      // Handle "Invalid array length" error specifically
      if (parseError && (parseError.message?.includes("Invalid array length") || parseError.message?.includes("RangeError"))) {
        throw new Error("PDF file is too large or complex to parse. Please try a smaller or simpler PDF file.");
      }
      // Re-throw other errors
      throw parseError;
    }

    if (!data || !data.text) {
      throw new Error("PDF parsed but no text content found");
    }

    return data.text.trim();
  } catch (error) {
    console.error("Error parsing PDF:", error);
    // Provide more detailed error information
    if (error instanceof Error) {
      // Re-throw with more context if it's already an Error
      if (error.message.includes("PDF") || error.message.includes("parse")) {
        throw error;
      }
      throw new Error(`Failed to extract text from PDF file: ${error.message}`);
    }
    throw new Error(`Failed to extract text from PDF file: ${String(error)}`);
  }
}
