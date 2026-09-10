"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, HelpCircle } from "lucide-react"

interface FaqItem {
  question: string
  answer: string
}

const FAQS: FaqItem[] = [
  {
    question: "How does MedSupply verify the authenticity of medications?",
    answer:
      "Every product listed on MedSupply passes through a structured verification workflow. Suppliers must provide valid pharmaceutical licenses and compliance documents before onboarding. Products are then verified by licensed pharmacists who inspect batch numbers, expiry dates, packaging integrity, and registration details before delivery approval.",
  },
  {
    question: "How does the MedSupply order workflow operate?",
    answer:
      "The platform follows a controlled procurement process: Buyer places an order → Suppliers receive requests → Supplier confirms availability → Product is sent to the verification office → Pharmacist verifies the product → Delivery is dispatched → Payment is released to the supplier after confirmation.",
  },
  {
    question: "What happens if a supplier is unavailable or out of stock?",
    answer:
      "MedSupply supports multi-supplier request routing. When an order is placed and the primary supplier fails to respond or lacks sufficient stock, alternative suppliers are suggested automatically to prevent delays in procurement.",
    // "MedSupply supports multi-supplier request routing. When an order is placed, the system can notify multiple approved suppliers simultaneously. If the primary supplier fails to respond or lacks sufficient stock, alternative suppliers are suggested automatically to prevent delays in procurement.",
  },
  // {
  //   question: "Can buyers purchase products in smaller retail quantities?",
  //   answer:
  //     "Yes. MedSupply supports both bulk procurement and retail purchasing. Hospitals, pharmacies, and distributors can place large-scale orders, while smaller clinics and retail buyers can access a dedicated retail marketplace with lower minimum order quantities and flexible purchasing options.",
  // },
  {
    question: "How are product prices controlled on the platform?",
    answer:
      "Suppliers submit pricing based on controlled product catalog rules. MedSupply applies platform commission percentages and validates supplier pricing against approved benchmark ranges to prevent excessive price inflation while maintaining fair market competition.",
  },
  {
    question: "How does MedSupply handle disputes and delivery issues?",
    answer:
      "If a buyer reports missing, incorrect, damaged, or delayed products, the order enters a dispute review process. Admins and pharmacists review verification logs, supplier confirmations, delivery records, and transaction history before resolving the issue and determining payment release or refund actions.",
  },
  {
    question: "Does the platform support partial fulfillment for large orders?",
    answer:
      "Yes. If a supplier cannot fulfill the full requested quantity immediately, the system supports partial fulfillment workflows. Buyers can choose to receive available stock first while the remaining quantity is scheduled for a later delivery batch.",
  },
  {
    question: "How is inventory monitored across suppliers?",
    answer:
      "Suppliers maintain live inventory records through their dashboards. Stock levels automatically update when orders are placed, and the system generates low-stock and out-of-stock alerts for both suppliers and administrators to ensure continuous product availability monitoring.",
  },
  // {
  //   question: "Can MedSupply integrate with hospital ERP or pharmacy systems?",
  //   answer:
  //     "Yes. The platform is designed with API-ready architecture, allowing future integration with ERP systems, hospital inventory software, pharmacy management systems, and third-party logistics providers for automated procurement and stock synchronization.",
  // },
  {
    question: "How secure is the MedSupply platform?",
    answer:
      "MedSupply uses secure authentication, encrypted communication channels, role-based access control, audit logging, and protected cloud infrastructure to safeguard sensitive pharmaceutical and transaction data. The architecture is designed to support future compliance requirements and enterprise-grade security practices.",
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-white py-24" id="faq-section">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-600"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" />
            Common Questions
          </motion.div>
          <h2 className="mb-4 text-4xl font-semibold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="font-sora text-lg text-slate-600">
            Everything you need to know about procurement, verification, and
            logistics.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-300 ${
                openIndex === index
                  ? "border-blue-200 bg-blue-50/30"
                  : "border-slate-100 hover:border-slate-200"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-sora text-lg font-bold text-slate-900">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`ml-4 shrink-0 rounded-full border bg-white p-1 ${
                    openIndex === index
                      ? "border-blue-200 text-blue-600"
                      : "border-slate-100 text-slate-400"
                  }`}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-base leading-relaxed text-slate-600">
                      <div className="border-t border-blue-100/50 pt-2">
                        {faq.answer}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-16 hidden rounded-3xl bg-slate-900 p-8 text-center">
          <h3 className="mb-2 text-xl font-bold text-white">
            Still have questions?
          </h3>
          <p className="mb-6 font-medium text-slate-400">
            We're here to help you optimize your supply chain.
          </p>
          <button className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 font-bold text-white transition-all hover:scale-105 hover:bg-blue-700">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  )
}
