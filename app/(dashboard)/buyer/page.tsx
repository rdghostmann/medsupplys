// app/(dashboard)/buyer/page.tsx
import { getCurrentBuyerDashboard } from "@/controllers/buyer.actions";
import BuyerPage from "./BuyerPage";

export default async function Page() {
  const {
    user,
    wallet,
    creditAccount,
    nonCompletedOrderCount,
    totalOrderCount,
  } =
    await getCurrentBuyerDashboard();

  return (
    <BuyerPage
      user={user}
      wallet={wallet}
      creditAccount={creditAccount}
      nonCompletedOrderCount={nonCompletedOrderCount}
      totalOrderCount={totalOrderCount}
    />
  );
}