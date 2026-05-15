import { Geist, Geist_Mono, Outfit, Space_Grotesk } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import SessionWrapper from "@/components/SessionWrapper/SessionWrapper";


const fontSansBig = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans-big'
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-mono-outfit'
})

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})


export const metadata: Metadata = {
  title: {
    default: "MedSupply",
    template: "%s | MedSupply",
  },

  description:
    "MedSupply is a B2B pharmaceutical procurement and verification marketplace connecting verified medicine suppliers with licensed pharmacies, hospitals, and clinics.",

  applicationName: "MedSupply",

  keywords: [
    "MedSupply",
    "Pharmaceutical Marketplace",
    "Medicine Suppliers",
    "B2B Healthcare",
    "Drug Procurement",
    "Hospital Procurement",
    "Pharmacy Supply",
    "Medical Distribution",
    "Healthcare Marketplace",
  ],

  authors: [
    {
      name: "MedSupply",
    },
  ],

  creator: "MedSupply",

  publisher: "MedSupply",

  metadataBase: new URL("https://medsupplys.vercel.app"),

  openGraph: {
    title: "MedSupply",
    description:
      "B2B pharmaceutical procurement and verification marketplace for hospitals, pharmacies, clinics, and verified medicine suppliers.",

    url: "https://medsupplys.vercel.app",

    siteName: "MedSupply",

    images: [
      {
        url: "/logo-favicon.png",
        width: 1200,
        height: 630,
        alt: "MedSupply",
      },
    ],

    locale: "en_US",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "MedSupply",

    description:
      "Verified pharmaceutical procurement and supplier marketplace.",

    images: ["/logo-favicon.png"],
  },

  icons: {
    icon: [
      {
        url: "/logo-favicon.png",
        type: "image/png",
        sizes: "32x32",
      },
    ],

    shortcut: "/logo-favicon.png",

    apple: "/logo-favicon.png",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, outfit.variable, fontSans.variable, fontSansBig.variable)}
    >
      <body cz-shortcut-listen="true">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionWrapper>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
