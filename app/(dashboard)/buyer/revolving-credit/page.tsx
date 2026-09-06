// app/(dashboard)/buyer/revolving/page.tsx
import RevolvingCreditPage from "./RevolvingCreditPage";

import { getCurrentBuyerDashboard } from "@/controllers/buyer.actions";

export default async function Page() {
  const {
    creditAccount,
    creditTransactions,
  } = await getCurrentBuyerDashboard();

  return (
    <RevolvingCreditPage
      creditAccount={creditAccount}
      creditTransactions={creditTransactions}
    />
  );
}