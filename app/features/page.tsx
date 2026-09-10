import React from "react"
import { FeaturesPage } from "./FeaturesPage"
import Footer from "@/components/Footer/Footer"
import Navbar from "@/components/Navbar/Navbar"

const page = () => {
  return (
    <div>
      <Navbar />
      <FeaturesPage />
      <Footer />
    </div>
  )
}

export default page
