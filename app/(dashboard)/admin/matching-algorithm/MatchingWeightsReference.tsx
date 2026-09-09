"use client";

import {
  Activity,
  CircleDollarSign,
  Layers3,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";

const MATCHING_WEIGHTS = {
  availabilityWeight: 20,
  priceWeight: 35,
  supplierTypeWeight: 5,
  fulfillmentWeight: 15,
  reliabilityWeight: 25,
} as const;

const WEIGHT_CONFIG = [
  {
    key: "availabilityWeight",
    label: "Stock Availability & MOQ Match",
    description:
      "Rewards suppliers with sufficient stock and suitable order quantities.",
    icon: PackageCheck,
  },
  {
    key: "priceWeight",
    label: "Price Competitiveness",
    description:
      "Prioritizes suppliers offering competitive unit prices.",
    icon: CircleDollarSign,
  },
  {
    key: "supplierTypeWeight",
    label: "Supplier Tier Hierarchy",
    description:
      "Factors importer, distributor, and retailer supplier tiers.",
    icon: Layers3,
  },
  {
    key: "fulfillmentWeight",
    label: "Fulfillment Rate History",
    description:
      "Considers historical fulfillment and successful order completion.",
    icon: Activity,
  },
  {
    key: "reliabilityWeight",
    label: "Reliability & Quality Rating",
    description:
      "Considers supplier reliability, ratings, and compliance history.",
    icon: ShieldCheck,
  },
] as const;

export default function MatchingWeightsReference() {
  const total =
    MATCHING_WEIGHTS.availabilityWeight +
    MATCHING_WEIGHTS.priceWeight +
    MATCHING_WEIGHTS.supplierTypeWeight +
    MATCHING_WEIGHTS.fulfillmentWeight +
    MATCHING_WEIGHTS.reliabilityWeight;

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold">
            Current Matching Configuration
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Reference these weights when calibrating the supplier
            matching algorithm.
          </p>
        </div>

        <div className="shrink-0 rounded-lg border bg-muted/40 px-3 py-2 text-center">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Total
          </p>

          <p
            className={`text-lg font-bold ${total === 100
                ? "text-foreground"
                : "text-destructive"
              }`}
          >
            {total}%
          </p>
        </div>
      </div>

      {/* Weight List */}
      <div className="space-y-4">
        {WEIGHT_CONFIG.map((item) => {
          const value = MATCHING_WEIGHTS[item.key];
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              className="rounded-lg border bg-background p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Icon className="size-4 text-muted-foreground" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">
                      {item.label}
                    </p>

                    <span className="shrink-0 text-sm font-bold">
                      {value}%
                    </span>
                  </div>

                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>

                  {/* Weight Bar */}
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${value}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-5 rounded-lg border border-dashed bg-muted/30 p-3">
        <p className="text-xs leading-relaxed text-muted-foreground">
          These values represent the current platform matching
          configuration. Changing the calibration values will affect
          how supplier candidates are ranked for future procurement
          requests.
        </p>
      </div>
    </div>
  );
}