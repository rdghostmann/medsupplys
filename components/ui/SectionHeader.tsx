import React from "react"

interface SectionHeaderProps {
  badge?: string
  title: string
  subtitle?: string
  align?: "left" | "center"
  className?: string
  dark?: boolean
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  align = "center",
  className = "",
  dark = false,
}) => {
  const isCenter = align === "center"

  return (
    <div
      className={`mb-12 md:mb-16 ${isCenter ? "mx-auto max-w-3xl text-center" : "max-w-2xl"} ${className}`}
    >
      {badge && (
        <div
          className={`mb-3.5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase ${
            dark
              ? "border-blue-500/30 bg-blue-950/60 text-blue-300"
              : "border-blue-200/90 bg-blue-50/80 text-blue-900"
          }`}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          {badge}
        </div>
      )}
      <h2
        className={`text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl ${
          dark ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3.5 text-base leading-relaxed sm:text-lg ${
            dark ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
