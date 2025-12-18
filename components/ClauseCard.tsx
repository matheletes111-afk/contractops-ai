// Individual clause display card
"use client";

import { useState } from "react";
import { Clause } from "@/types/contract";
import RiskBadge from "./RiskBadge";
import RedlineSection from "./RedlineSection";

interface ClauseCardProps {
  clause: Clause;
}

export default function ClauseCard({ clause }: ClauseCardProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {clause.name}
          </h3>
          <RiskBadge risk={clause.risk_level} size="sm" />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{clause.summary}</p>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowOriginal(!showOriginal)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {showOriginal ? "Hide" : "Show"} Original Text
        </button>
        {showOriginal && (
          <div className="mt-2 p-4 bg-gray-50 rounded border border-gray-200">
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {clause.original_text}
            </p>
          </div>
        )}
      </div>

      <RedlineSection
        original={clause.original_text}
        suggested={clause.suggested_redline}
      />
    </div>
  );
}

