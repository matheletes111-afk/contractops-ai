// Client-side PDF export using jsPDF
import jsPDF from "jspdf";
import { AnalysisResult } from "@/types/contract";

/**
 * Exports analysis results to a 1-page PDF summary
 */
export function exportToPDF(result: AnalysisResult) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Helper to add text with word wrap
  const addWrappedText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize: number = 10,
    lineHeight: number = 7
  ): number => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * lineHeight;
  };

  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Contract Risk Analysis Summary", margin, yPosition);
  yPosition += 15;

  // Overall Risk
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Overall Risk Level:", margin, yPosition);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const riskColor =
    result.overall_risk === "High"
      ? [255, 0, 0]
      : result.overall_risk === "Medium"
      ? [255, 193, 7]
      : [40, 167, 69];
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.text(result.overall_risk, margin + 50, yPosition);
  doc.setTextColor(0, 0, 0);
  yPosition += 15;

  // Summary Statistics
  const highRiskCount = result.clauses.filter((c) => c.risk_level === "High")
    .length;
  const mediumRiskCount = result.clauses.filter(
    (c) => c.risk_level === "Medium"
  ).length;
  const lowRiskCount = result.clauses.filter((c) => c.risk_level === "Low")
    .length;

  doc.setFontSize(10);
  doc.text(
    `High Risk: ${highRiskCount} | Medium Risk: ${mediumRiskCount} | Low Risk: ${lowRiskCount}`,
    margin,
    yPosition
  );
  yPosition += 12;

  // Top High-Risk Clauses
  const highRiskClauses = result.clauses
    .filter((c) => c.risk_level === "High")
    .slice(0, 3);

  if (highRiskClauses.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    yPosition = addWrappedText(
      "Top High-Risk Clauses:",
      margin,
      yPosition + 5,
      pageWidth - 2 * margin,
      14,
      8
    );

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    for (const clause of highRiskClauses) {
      if (yPosition > pageHeight - 40) break; // Prevent overflow

      // Clause name
      doc.setFont("helvetica", "bold");
      yPosition = addWrappedText(
        `• ${clause.name}`,
        margin,
        yPosition + 3,
        pageWidth - 2 * margin,
        11,
        6
      );

      // Summary (truncated if needed)
      doc.setFont("helvetica", "normal");
      const summary = clause.summary.length > 150
        ? clause.summary.substring(0, 150) + "..."
        : clause.summary;
      yPosition = addWrappedText(
        summary,
        margin + 5,
        yPosition + 2,
        pageWidth - 2 * margin - 5,
        9,
        5
      );
    }
  }

  // Key Findings
  if (yPosition < pageHeight - 30) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    yPosition += 5;
    const timestamp = new Date().toLocaleString();
    doc.text(`Generated: ${timestamp}`, margin, pageHeight - 15);
  }

  // Save PDF
  const fileName = `contract-analysis-${Date.now()}.pdf`;
  doc.save(fileName);
}

