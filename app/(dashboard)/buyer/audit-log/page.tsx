// /dashboard/supplier/audit-log/page.tsx

import { getCurrentSupplierAuditLogs } from "@/controllers/audit.actions"
import AuditPage from "./AuditPage"
// import { getCurrentSupplierAuditLogs } from "@/controllers/audit.action";

export default async function Page() {
  const auditLogs = await getCurrentSupplierAuditLogs()

  return <AuditPage auditLogs={auditLogs} />
}
