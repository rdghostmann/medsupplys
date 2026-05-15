// app/(dashboard)/marketplace/components/MatchingLoader.tsx
"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ShieldCheck, Zap, BarChart3 } from "lucide-react"

type Step = {
  icon: React.ReactNode
  label: string
}

const STEPS: Step[] = [
  {
    icon: <Search size={20} />,
    label: "Scanning supplier inventory pools...",
  },
  {
    icon: <Zap size={20} />,
    label: "Analyzing real-time stock levels...",
  },
  {
    icon: <ShieldCheck size={20} />,
    label: "Evaluating supplier reliability...",
  },
  {
    icon: <BarChart3 size={20} />,
    label: "Optimizing best price per unit...",
  },
]

export default function MatchingLoader({
  isOpen,
  onComplete,
}: {
  isOpen: boolean
  onComplete?: () => void
}) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!isOpen) return

    let current = 0

    const interval = setInterval(() => {
      current += 1
      setStep(current % STEPS.length)

      // 🔥 After full cycle → complete
      if (current === STEPS.length * 2) {
        clearInterval(interval)
        onComplete?.()
      }
    }, 600)

    return () => clearInterval(interval)
  }, [isOpen, onComplete])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl overflow-hidden"
        >
          {/* Progress bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
              className="h-full bg-black"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col items-center text-center space-y-6">

            {/* Animated icon */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center text-black">
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.4,
                    ease: "linear",
                  }}
                >
                  <Search size={36} />
                </motion.div>
              </div>

              {/* Live indicator */}
              <motion.div
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
              />
            </div>

            {/* Title */}
            <div>
              <h2 className="text-xl font-semibold">
                Matching Best Supplier
              </h2>
              <p className="text-sm text-gray-500">
                Evaluating multiple suppliers in real-time
              </p>
            </div>

            {/* Steps */}
            <div className="w-full space-y-2">
              {STEPS.map((s, i) => {
                const isActive = i === step

                return (
                  <motion.div
                    key={i}
                    animate={{
                      opacity: isActive ? 1 : 0.3,
                      scale: isActive ? 1.02 : 1,
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl transition ${
                      isActive
                        ? "bg-gray-100 text-black font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    {s.icon}
                    <span className="text-sm">{s.label}</span>
                  </motion.div>
                )
              })}
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}