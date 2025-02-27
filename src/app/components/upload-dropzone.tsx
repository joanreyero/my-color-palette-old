"use client";

import { useCallback, useState } from "react";
import { type DropzoneOptions, useDropzone } from "react-dropzone";
import { AlertCircle, Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";

import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";

export function UploadDropzone() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzePalette = api.palette.analyzePalette.useMutation({
    onSuccess: (data) => {
      setError(null);
      // Keep loading state during navigation
      router.replace(`/${data.id}`);
    },
    onError: (err) => {
      setIsLoading(false);
      setError(err.message);
    },
  });

  const onDrop = useCallback<NonNullable<DropzoneOptions["onDrop"]>>(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsLoading(true);
      setError(null);

      // Use void to handle the Promise
      void (async () => {
        try {
          // Upload the file directly to Vercel Blob
          const blob = await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/blob",
          });

          // Pass the actual image URL to the palette analyzer
          await analyzePalette.mutateAsync({
            imageUrl: blob.url,
          });
        } catch (err) {
          setIsLoading(false);
          setError(
            err instanceof Error ? err.message : "Failed to upload image",
          );
        }
      })();
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

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-12 text-center transition-colors hover:border-gray-400",
          isDragActive && "border-purple-500 bg-purple-50",
          isLoading && "pointer-events-none opacity-60",
          error && "border-red-300 bg-red-50",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="rounded-full bg-gray-100 p-3">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
            ) : error ? (
              <AlertCircle className="h-6 w-6 text-red-500" />
            ) : (
              <Upload className="h-6 w-6 text-gray-600" />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-700">
              {isLoading ? (
                "Uploading and analyzing your colors..."
              ) : error ? (
                "Something went wrong"
              ) : (
                <>
                  Drag and drop your photo here, or{" "}
                  <span className="text-purple-600">browse to upload</span>
                </>
              )}
            </p>
            {!isLoading && !error && (
              <p className="text-xs text-gray-500">
                Supported formats: JPEG, PNG, WebP
              </p>
            )}
          </div>
        </div>
      </div>
      {error && (
        <p className="text-center text-sm text-red-600">
          Error: {error}. Please try again.
        </p>
      )}
    </div>
  );
}
