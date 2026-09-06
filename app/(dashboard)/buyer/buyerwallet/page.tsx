// app/(dashboard)/buyer/page.tsx

import BuyerWalletPage from "./BuyerWalletPage";
import { getCurrentBuyerDashboard } from "@/controllers/buyer.actions";


export default async function Page() {
  const { wallet, walletTransactions } =
    await getCurrentBuyerDashboard();

  return (
    <BuyerWalletPage
      wallet={wallet}
      walletTransactions={walletTransactions}
    />
  );
}


