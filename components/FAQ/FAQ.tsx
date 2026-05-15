"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
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
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white" id="faq-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-medium mb-5">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
            Common Questions
          </motion.div>
          <h2 className="text-4xl font-semibold  tracking-tight text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg font-sora text-slate-600">
            Everything you need to know about procurement, verification, and logistics.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-2xl transition-all duration-300 ${openIndex === index
                  ? "border-blue-200 bg-blue-50/30"
                  : "border-slate-100 hover:border-slate-200"
                }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between"
              >
                <span className="font-bold font-sora text-slate-900 text-lg">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`shrink-0 ml-4 p-1 rounded-full bg-white border ${openIndex === index ? "text-blue-600 border-blue-200" : "text-slate-400 border-slate-100"
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
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed text-base">
                      <div className="pt-2 border-t border-blue-100/50">
                        {faq.answer}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="hidden mt-16 p-8 rounded-3xl bg-slate-900 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-slate-400 mb-6 font-medium">We're here to help you optimize your supply chain.</p>
          <button className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all hover:scale-105">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}
