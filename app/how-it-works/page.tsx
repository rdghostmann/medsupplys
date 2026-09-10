import React from "react"
import { HowItWorksPage } from "./HowItWorksPage"
import Navbar from "@/components/Navbar/Navbar"
import Footer from "@/components/Footer/Footer"

const page = () => {
  return (
    <div>
      <Navbar />
      <HowItWorksPage />
      <Footer />
    </div>
  )
}

export default page
