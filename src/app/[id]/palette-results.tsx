"use client";

type PaletteResult = {
  id: number;
  seasonal: string;
  colours: Record<string, { reason: string; name: string }>;
};

interface PaletteResultsProps {
  result: PaletteResult;
}

export function PaletteResults({ result }: PaletteResultsProps) {
  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900">
        Your Season: <span className="text-purple-600">{result.seasonal}</span>
      </h2>
      <div className="space-y-4">
        {Object.entries(result.colours).map(([hex, { name, reason }]) => (
          <div key={hex} className="flex items-start gap-3">
            <div
              className="h-8 w-8 shrink-0 rounded-full border shadow-sm"
              style={{ backgroundColor: hex }}
            />
            <div>
              <p className="font-medium text-gray-900">{name}</p>
              <p className="text-sm text-gray-600">{reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
