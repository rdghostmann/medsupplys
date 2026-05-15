"use client"
import { motion } from "framer-motion";
import { Hospital } from "lucide-react";

interface Logo {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

interface LogoCloudProps {
  title?: string;
  logos?: Logo[];
  speed?: number;
}

const DEFAULT_LOGOS: Logo[] = [
  { id: "1", name: "Lagos General Hospital" },
  { id: "2", name: "Eko Hospitals Group" },
  { id: "3", name: "Reddington Hospital" },
  { id: "4", name: "St. Nicholas Hospital" },
  { id: "5", name: "Grandville Medical" },
  { id: "6", name: "HealthPlus Nigeria" },
];

export function LogoCloud({
  title = "Collaborated With 20+ Hospitals & Healthcare Networks",
  logos = DEFAULT_LOGOS,
  speed = 40,
}: LogoCloudProps) {
  // Duplicate logos for seamless loop - 2 sets is enough for a -50% animation
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="w-full py-16 bg-white border-y border-slate-100 overflow-hidden" id="logo-cloud">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-12">
            {title}
          </h2>
        )}

        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Marquee row */}
          <div className="flex overflow-hidden">
            <motion.div
              className="flex whitespace-nowrap gap-12 items-center"
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                duration: speed,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {duplicatedLogos.map((logo, index) => (
                <div
                  key={`${logo.id}-${index}`}
                  className="flex items-center gap-3 px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors cursor-default select-none border border-transparent hover:border-slate-100 shrink-0"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    {logo.icon || <Hospital size={20} />}
                    
                  </div>
                  <span className="text-slate-700 font-medium text-lg whitespace-nowrap">
                    {logo.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

