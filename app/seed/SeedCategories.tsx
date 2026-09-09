"use client";

import { useState } from "react";
import {
  Database,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SeedResponse {
  success?: boolean;
  message?: string;
  inserted?: number;
  updated?: number;
  total?: number;
}

export default function SeedCategories() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [result, setResult] = useState<SeedResponse | null>(null);

  const handleSeedCategories = async () => {
    try {
      setIsSeeding(true);
      setResult(null);

      const response = await fetch("/api/admin/seed-categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to seed product categories."
        );
      }

      setResult(data);

      toast.success("Categories seeded successfully", {
        description:
          data?.message ||
          `${data?.total ?? 0} product categories are now available.`,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while seeding categories.";

      toast.error("Category seeding failed", {
        description: message,
      });

      setResult({
        success: false,
        message,
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="size-5" />
          Product Categories
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Database className="size-4 text-primary" />
            </div>

            <div>
              <p className="text-sm font-medium">
                Seed Product Categories
              </p>

              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Creates or updates the predefined pharmaceutical and
                healthcare product categories used throughout MedSupply.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleSeedCategories}
          disabled={isSeeding}
          className="w-full sm:w-auto"
        >
          {isSeeding ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Seeding Categories...
            </>
          ) : (
            <>
              <Database className="mr-2 size-4" />
              Seed Categories
            </>
          )}
        </Button>

        {result && (
          <div
            className={`rounded-lg border p-4 ${
              result.success
                ? "border-green-500/20 bg-green-500/5"
                : "border-destructive/20 bg-destructive/5"
            }`}
          >
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle2 className="mt-0.5 size-4 text-green-600" />
              ) : (
                <AlertCircle className="mt-0.5 size-4 text-destructive" />
              )}

              <div>
                <p className="text-sm font-medium">
                  {result.success
                    ? "Seeding completed"
                    : "Seeding failed"}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {result.message}
                </p>

                {result.success && (
                  <div className="mt-2 flex flex-wrap gap-4 text-xs">
                    {typeof result.inserted === "number" && (
                      <span>
                        Inserted:{" "}
                        <strong>{result.inserted}</strong>
                      </span>
                    )}

                    {typeof result.updated === "number" && (
                      <span>
                        Updated:{" "}
                        <strong>{result.updated}</strong>
                      </span>
                    )}

                    {typeof result.total === "number" && (
                      <span>
                        Total: <strong>{result.total}</strong>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}