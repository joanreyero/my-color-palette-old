"use client";

import { useCallback, useState } from "react";
import { type DropzoneOptions, useDropzone } from "react-dropzone";
import { Loader2, Upload } from "lucide-react";

import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";

type AnalysisResult = {
  seasonal: string;
  colours: Record<string, { reason: string; name: string }>;
};

export function UploadDropzone() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzePalette = api.palette.analyzePalette.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
      // TODO: Add error handling
    },
  });

  const onDrop = useCallback<NonNullable<DropzoneOptions["onDrop"]>>(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsLoading(true);
      setResult(null);

      // For now, we'll just pass a dummy URL since we're not actually uploading
      void analyzePalette.mutateAsync({
        imageUrl: "https://example.com/image.jpg",
      });
    },
    [analyzePalette],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    multiple: false,
    disabled: isLoading,
  });

  if (result) {
    return (
      <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900">
          Your Season:{" "}
          <span className="text-purple-600">{result.seasonal}</span>
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

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-12 text-center transition-colors hover:border-gray-400",
        isDragActive && "border-purple-500 bg-purple-50",
        isLoading && "pointer-events-none opacity-60",
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-gray-100 p-3">
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
          ) : (
            <Upload className="h-6 w-6 text-gray-600" />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-gray-700">
            {isLoading ? (
              "Analyzing your colors..."
            ) : (
              <>
                Drag and drop your photo here, or{" "}
                <span className="text-purple-600">browse to upload</span>
              </>
            )}
          </p>
          {!isLoading && (
            <p className="text-xs text-gray-500">
              Supported formats: JPEG, PNG, WebP
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
