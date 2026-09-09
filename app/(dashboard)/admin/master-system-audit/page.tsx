// /dashboard/admin/master-system-audit/page.tsx

import MasterSystemPage from "./MasterSystemPage";
import { getAdminAuditLogs } from "@/controllers/admin.actions";

export default async function Page() {
  const audits = await getAdminAuditLogs();

  return <MasterSystemPage audits={audits} />;
}
