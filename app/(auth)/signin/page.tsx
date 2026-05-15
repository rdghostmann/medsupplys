// app/signin/page.tsx

import type { Metadata } from "next"
import SigninPage from "./SigninPage"


export const metadata: Metadata = {
  title: "Sign In | MedSupply",

  description: "Access your MedSupply procurement dashboard, supplier marketplace, and pharmaceutical sourcing platform.",
}

export default function Page() {
  return <SigninPage />
}