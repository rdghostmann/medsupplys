// app/(dashboard)/buyer/page.tsx
"use client";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import OrderTracking from "./OrderTracking";

export default function Page() {



    return (
        <div className="flex flex-1 flex-col">
            <Breadcrumb className="p-4 lg:px-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/buyer">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Orders Tracking</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

                    <div className="px-4 lg:px-6">
                        <OrderTracking />

                    </div>
                </div>
            </div>



        </div>

    )
}


