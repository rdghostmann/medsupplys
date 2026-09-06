// BuyerPage.tsx
"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import BuyerOverview from "./components/BuyerOverview";
import {
  CurrentBuyerCreditAccount,
  CurrentBuyerProcurement,
  CurrentBuyerUser,
  CurrentBuyerWallet,
} from "@/controllers/buyer.actions";
import type { Order } from "@/types";



interface BuyerPageProps {
  user: CurrentBuyerUser | null;
  wallet: CurrentBuyerWallet | null;
  creditAccount: CurrentBuyerCreditAccount | null;
  orders: Order[];
  fallbackQueue: CurrentBuyerProcurement[];
  nonCompletedOrderCount: number;
  totalOrderCount: number;
}

export default function BuyerPage({
  user,
  wallet,
  creditAccount,
  orders,
  fallbackQueue,
  nonCompletedOrderCount,
  totalOrderCount,
}: BuyerPageProps) {
  return (
    <div className="flex flex-1 flex-col">
      {/* ========================================================
          BREADCRUMB
      ======================================================== */}

      <Breadcrumb className="p-4 lg:px-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/buyer">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>
              Buyer Overview
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ========================================================
          MAIN CONTENT
      ======================================================== */}

      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <BuyerOverview
              user={user ?? undefined}
              wallet={wallet ?? undefined}
              creditAccount={creditAccount ?? undefined}
              orders={orders}
              fallbackQueue={fallbackQueue}
              nonCompletedOrderCount={nonCompletedOrderCount}
              totalOrderCount={totalOrderCount}
              loading={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}