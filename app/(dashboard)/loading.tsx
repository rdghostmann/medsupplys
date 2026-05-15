"use client"

import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      
      <div className="flex flex-col items-center gap-6">
        
        {/* SPINNER */}
        <div className="relative w-14 h-14">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent"
          />

          <motion.div
            className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: "linear",
            }}
          />
        </div>

        {/* TEXT */}
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-slate-700">
            Loading data...
          </p>
          <p className="text-xs text-slate-400">
            Please wait while we prepare your experience
          </p>
        </div>

      </div>
    </div>
  )
}