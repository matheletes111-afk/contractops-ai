// Suggested redlines display component
interface RedlineSectionProps {
  original: string;
  suggested: string;
}

export default function RedlineSection({
  original,
  suggested,
}: RedlineSectionProps) {
  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">
        Suggested Redline
      </h4>
      <div className="bg-blue-50 border border-blue-200 rounded p-4">
        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
          {suggested}
        </p>
      </div>
    </div>
  );
}

