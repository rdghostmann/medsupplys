// app/signup/page.tsx

import type { Metadata } from "next"
import SignupPage from "./SignupPage"


export const metadata: Metadata = {
  title: "Sign Up | MedSupply",

  description: "Access your MedSupply procurement dashboard, supplier marketplace, and pharmaceutical sourcing platform.",
}

export default function Page() {
  return <SignupPage />
}