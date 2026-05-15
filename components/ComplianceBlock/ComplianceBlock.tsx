import { motion } from "framer-motion";
import { ShieldCheck, FileCheck, Landmark, ScrollText, ExternalLink } from "lucide-react";

interface ComplianceBadge {
  id: string;
  name: string;
  fullName: string;
  icon: React.ReactNode;
  description: string;
}

const COMPLIANCE_BADGES: ComplianceBadge[] = [
  {
    id: "nafdac",
    name: "NAFDAC",
    fullName: "National Agency for Food & Drug Admin",
    icon: <Landmark className="w-8 h-8" />,
    description: "Fully compliant with Nigerian pharmaceutical registration and safety protocols.",
  },
  {
    id: "pcn",
    name: "PCN",
    fullName: "Pharmacists Council of Nigeria",
    icon: <ScrollText className="w-8 h-8" />,
    description: "Operated by licensed pharmacists following strict professional ethics and standards.",
  },
  {
    id: "hipaa",
    name: "HIPAA",
    fullName: "Health Data Privacy Standard",
    icon: <ShieldCheck className="w-8 h-8" />,
    description: "International standard for protecting sensitive patient health information.",
  },
  {
    id: "iso",
    name: "ISO 9001",
    fullName: "Quality Management Systems",
    icon: <FileCheck className="w-8 h-8" />,
    description: "Certified logistics and supply chain processes ensuring consistent quality.",
  },
];

export default function ComplianceSection() {
  return (
    <section className="py-10 bg-white" id="compliance-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-semibold font-sora tracking-tight text-slate-900 mb-6">
            Industry-Leading Safety & Compliance
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Meeting the highest pharmaceutical and data security requirements to ensure patient safety and supply chain integrity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 items-center justify-items-center mb-16">
          {COMPLIANCE_BADGES.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col items-center"
            >
              {/* Badge Circle */}
              <div className="w-30 h-30 rounded-full border-2 border-slate-200 flex flex-col items-center justify-center p-2 mb-6 transition-all duration-300 group-hover:border-blue-500 group-hover:bg-blue-50 group-hover:shadow-xl group-hover:shadow-blue-500/10 relative overflow-hidden">
                <div className="text-slate-400 group-hover:text-blue-600 transition-colors mb-2">
                  {badge.icon}
                </div>
                <div className="text-center">
                  <div className="font-black text-slate-900 leading-none tracking-tighter">
                    {badge.name}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest group-hover:text-blue-400">
                    Certified
                  </div>
                </div>
                {/* Decorative lines inside badge */}
                <div className="absolute top-2 w-12 h-px bg-slate-100" />
                <div className="absolute bottom-2 w-12 h-px bg-slate-100" />
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {badge.fullName}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed px-4">
                  {badge.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="hidden items-center gap-2 px-8 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 transition-all shadow-lg active:scale-95 text-sm"
        >
          Compliance Portal <ExternalLink size={16} />
        </motion.button>
      </div>
    </section>
  );
}
