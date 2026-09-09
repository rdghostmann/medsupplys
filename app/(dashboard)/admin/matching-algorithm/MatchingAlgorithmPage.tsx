"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import MatchingAlgorithmWeightsTuner from "./MatchingAlgorithmWeightsTuner";
import MatchingWeightsReference from "./MatchingWeightsReference";

import type {
  MatchingWeights,
} from "@/controllers/platform-config.controller";


interface MatchingAlgorithmPageProps {
  matchingWeights: MatchingWeights;
}

export const DEFAULT_MATCHING_WEIGHTS = {
  availability: 20,
  priceCompetitiveness: 35,
  supplierType: 5,
  fulfillmentHistory: 15,
  reliability: 25,
} as const;

export default function MatchingAlgorithmPage({
  matchingWeights,
}: MatchingAlgorithmPageProps) {
  return (
    <div className="flex flex-1 flex-col">
      {/* Breadcrumb */}
      <Breadcrumb className="p-4 lg:px-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>
              Matching Algorithm
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Content */}
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">

            <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
              {/* Calibration */}
              <MatchingAlgorithmWeightsTuner
                matchingWeights={matchingWeights}
              />
              <MatchingWeightsReference   />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}