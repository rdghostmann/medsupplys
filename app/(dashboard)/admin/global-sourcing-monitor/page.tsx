// app/(dashboard)/admin/global-sourcing-monitor/page.tsx

import GlobalSourcingPage from "./GlobalSourcingPage"
import { getProcurements } from "@/controllers/procurement.controller"

export default async function Page() {
  const procurements = await getProcurements()

  return <GlobalSourcingPage procurements={procurements} />
}
