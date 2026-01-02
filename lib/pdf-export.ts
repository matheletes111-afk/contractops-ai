// Client-side PDF export using jsPDF
import jsPDF from "jspdf";
import { AnalysisResult } from "@/types/contract";

/**
 * Exports comprehensive analysis results to PDF with multiple pages
 */
export function exportToPDF(result: AnalysisResult) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;
  let currentPage = 1;

  // Helper to add text with word wrap and return new y position
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
    
    // Check if we need a new page
    const requiredHeight = lines.length * lineHeight;
    if (y + requiredHeight > pageHeight - margin) {
      doc.addPage();
      currentPage++;
      y = margin;
    }
    
    doc.text(lines, x, y);
    return y + lines.length * lineHeight;
  };

  // Helper to check and add new page if needed
  const checkNewPage = (requiredSpace: number = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      currentPage++;
      yPosition = margin;
    }
  };

  // Helper to get risk color
  const getRiskColor = (risk: string): [number, number, number] => {
    switch (risk) {
      case "High":
        return [220, 38, 38]; // Red
      case "Medium":
        return [234, 179, 8]; // Yellow/Amber
      case "Low":
        return [34, 197, 94]; // Green
      default:
        return [0, 0, 0]; // Black
    }
  };

  // ========== PAGE 1: SUMMARY ==========
  
  // Title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Contract Risk Analysis Report", margin, yPosition);
  yPosition += 12;

  // Disclaimer
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 100, 100);
  yPosition = addWrappedText(
    "This is not legal advice. AI-assisted analysis to support review.",
    margin,
    yPosition + 2,
    pageWidth - 2 * margin,
    8,
    4
  );
  doc.setTextColor(0, 0, 0);
  yPosition += 8;

  // Overall Risk
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Overall Risk Assessment", margin, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Overall Risk Level:", margin, yPosition);
  
  const riskColor = getRiskColor(result.overall_risk);
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(result.overall_risk, margin + 50, yPosition);
  doc.setTextColor(0, 0, 0);
  yPosition += 12;

  // Summary Statistics
  const highRiskCount = result.clauses.filter((c) => c.risk_level === "High").length;
  const mediumRiskCount = result.clauses.filter((c) => c.risk_level === "Medium").length;
  const lowRiskCount = result.clauses.filter((c) => c.risk_level === "Low").length;
  const totalClauses = result.clauses.length;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Risk Distribution:", margin, yPosition);
  yPosition += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const statsText = [
    `Total Clauses Analyzed: ${totalClauses}`,
    `High Risk: ${highRiskCount} (${totalClauses > 0 ? Math.round((highRiskCount / totalClauses) * 100) : 0}%)`,
    `Medium Risk: ${mediumRiskCount} (${totalClauses > 0 ? Math.round((mediumRiskCount / totalClauses) * 100) : 0}%)`,
    `Low Risk: ${lowRiskCount} (${totalClauses > 0 ? Math.round((lowRiskCount / totalClauses) * 100) : 0}%)`,
  ];

  for (const stat of statsText) {
    doc.text(stat, margin + 5, yPosition);
    yPosition += 6;
  }

  yPosition += 8;

  // Executive Summary
  checkNewPage(30);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  let summaryText = `This contract analysis identified ${totalClauses} key clauses. `;
  if (highRiskCount > 0) {
    summaryText += `${highRiskCount} clause${highRiskCount > 1 ? 's' : ''} require${highRiskCount === 1 ? 's' : ''} immediate attention due to high risk factors. `;
  }
  if (mediumRiskCount > 0) {
    summaryText += `${mediumRiskCount} clause${mediumRiskCount > 1 ? 's' : ''} ${mediumRiskCount === 1 ? 'has' : 'have'} moderate risk and should be reviewed. `;
  }
  summaryText += `The overall risk level is ${result.overall_risk}.`;

  yPosition = addWrappedText(
    summaryText,
    margin,
    yPosition + 2,
    pageWidth - 2 * margin,
    10,
    6
  );

  yPosition += 10;

  // Timestamp
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 100, 100);
  const timestamp = new Date().toLocaleString();
  doc.text(`Report Generated: ${timestamp}`, margin, pageHeight - 15);
  doc.setTextColor(0, 0, 0);

  // ========== SUBSEQUENT PAGES: DETAILED CLAUSE ANALYSIS ==========

  // Sort clauses by risk (High first)
  const sortedClauses = [...result.clauses].sort((a, b) => {
    const riskOrder = { High: 3, Medium: 2, Low: 1 };
    return (riskOrder[b.risk_level as keyof typeof riskOrder] || 0) - 
           (riskOrder[a.risk_level as keyof typeof riskOrder] || 0);
  });

  for (let i = 0; i < sortedClauses.length; i++) {
    const clause = sortedClauses[i];
    
    // Start new page for each clause (except first)
    if (i > 0 || currentPage > 1) {
      doc.addPage();
      currentPage++;
      yPosition = margin;
    }

    // Clause Header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Clause ${i + 1}: ${clause.name}`, margin, yPosition);
    yPosition += 10;

    // Risk Level Badge
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Risk Level:", margin, yPosition);
    
    const clauseRiskColor = getRiskColor(clause.risk_level);
    doc.setTextColor(clauseRiskColor[0], clauseRiskColor[1], clauseRiskColor[2]);
    doc.text(clause.risk_level, margin + 35, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 12;

    // Summary Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Summary:", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    yPosition = addWrappedText(
      clause.summary,
      margin,
      yPosition + 2,
      pageWidth - 2 * margin,
      10,
      6
    );
    yPosition += 8;

    // Original Text Section
    checkNewPage(30);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Original Clause Text:", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    yPosition = addWrappedText(
      clause.original_text,
      margin,
      yPosition + 2,
      pageWidth - 2 * margin,
      9,
      5
    );
    doc.setTextColor(0, 0, 0);
    yPosition += 8;

    // Suggested Redline Section
    checkNewPage(30);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Suggested Redline:", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(34, 197, 94); // Green for improvements
    yPosition = addWrappedText(
      clause.suggested_redline,
      margin,
      yPosition + 2,
      pageWidth - 2 * margin,
      9,
      5
    );
    doc.setTextColor(0, 0, 0);
  }

  // Add page numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin - 20,
      pageHeight - 10
    );
    doc.setTextColor(0, 0, 0);
  }

  // Save PDF
  const fileName = `contract-analysis-${Date.now()}.pdf`;
  doc.save(fileName);
}

