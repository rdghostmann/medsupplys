import React from "react"
import ServicesPage from "./ServicesPage"
import Navbar from "@/components/Navbar/Navbar"
import Footer from "@/components/Footer/Footer"

const page = () => {
  return (
    <div>
      <Navbar />
      <ServicesPage />
      <Footer />
    </div>
  )
}

export default page
