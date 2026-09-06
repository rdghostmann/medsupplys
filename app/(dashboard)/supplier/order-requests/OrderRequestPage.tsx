// /dashboard/OrderRequestPage.tsx
"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import IncomingRequests from "./IncomingRequest";

import type {
    CurrentSupplierUser,
    IncomingProcurementRequest,
} from "@/controllers/supplier.action";

interface OrderRequestPageProps {
    user: CurrentSupplierUser | null;
    incomingProcurementRequests: IncomingProcurementRequest[];
}

export default function OrderRequestPage({
    user,
    incomingProcurementRequests,
}: OrderRequestPageProps) {
    if (!user) {
        return (
            <div className="flex flex-1 flex-col">
                <Breadcrumb className="p-4 lg:px-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/supplier">
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                Incoming Request
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="@container/main flex flex-1 items-center justify-center p-6">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                        <h2 className="text-sm font-bold text-slate-900">
                            Supplier Account Not Found
                        </h2>

                        <p className="mt-2 text-xs text-slate-500">
                            We could not resolve your authenticated supplier
                            account. Please sign in again.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col">
            <Breadcrumb className="p-4 lg:px-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/supplier">
                            Dashboard
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            Incoming Request
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="px-4 lg:px-6">
                        <IncomingRequests
                            user={user}
                            procurements={incomingProcurementRequests}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}