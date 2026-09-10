"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Home, Search, ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-xl space-y-6 text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <Image
            src="/404.gif"
            alt="404 Illustration"
            width={300}
            height={200}
            className="mx-auto"
          />

          <h1 className="hidden text-7xl font-extrabold tracking-tight text-blue-600">
            404
          </h1>
          <p className="text-xl font-semibold text-foreground">
            Page not found
          </p>
          <p className="text-sm text-muted-foreground">
            The page you’re looking for doesn’t exist or has been moved.
          </p>
        </motion.div>

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card space-y-4 rounded-2xl p-6"
        >
          <p className="flex items-center text-sm text-muted-foreground">
            <Search className="h-3 w-3" />

            <span className="ml-2">
              Try searching for what you are looking for or go back to the
              homepage.
            </span>
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:opacity-90"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-border px-4 py-2 transition hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
