'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-xl w-full text-center space-y-6">

        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <h1 className="text-7xl font-extrabold tracking-tight text-blue-600">
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
          className="glass-card rounded-2xl p-6 space-y-4"
        >
          <p className="text-sm text-muted-foreground">
            You can navigate back or explore the platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:opacity-90 transition"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-border hover:bg-muted transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </motion.div>

        {/* Optional quick search hint */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Search className="w-3 h-3" />
          Try checking the URL or navigating from dashboard
        </div>
      </div>
    </div>
  );
}