"use client";
import { motion } from "framer-motion";

interface FeatureCardProps {
    icon: string;
    title: string;
    desc: string;
    bg: string;
}

const FeatureCard = ({ icon, title, desc, bg }: FeatureCardProps) => (
    <div className="bg-white border border-slate-200 rounded-2xl p-7 min-w-70 md:min-w-0 md:h-54.5 snap-center md:snap-align-none shadow-sm hover:shadow-md transition-shadow">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-xl ${bg}`}>
            {icon}
        </div>
        <h3 className="font-semibold text-slate-900 text-base mb-2 tracking-tight">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
);

const VALUE_PROPS = [
    { icon: "🔐", title: "Pharmacist Verification", desc: "Products is physically verified by licensed pharmacists before delivery.", bg: "bg-blue-50" },
    { icon: "🤝", title: "Multi-Supplier Bidding", desc: "Orders are sent to multiple verified suppliers simultaneously.", bg: "bg-green-50" },
    { icon: "💳", title: "Escrow Payments", desc: "Payment is held until verification is complete.", bg: "bg-amber-50" },
    { icon: "📊", title: "Real-Time Tracking", desc: "Buyers track every step of their order from placement to delivery.", bg: "bg-violet-50" },
    { icon: "🏥", title: "Curated Catalog", desc: "Admin-controlled product catalog ensures only legitimate items.", bg: "bg-sky-50" },
    { icon: "🛡️", title: "KYC & Licensing", desc: "Suppliers undergo full verification including licenses.", bg: "bg-red-50" },
];

export function ValuePropSection() {
    return (
        <section className="py-10 px-6 max-w-7xl mx-auto overflow-hidden" id="value-prop-section">
            <div className="flex flex-col items-center text-center mb-2 lg:mb-5">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-medium mb-5">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                    Why MedSupply
                </motion.div>
                <h2 className="w-11/12 mx-auto text-2xl sm:text-3xl font-sora font-semibold text-center mb-2 tracking-tight">Built for Pharmaceutical B2B</h2>
                <p className="text-slate-600 text-center mb-12 max-w-lg mx-auto">A complete verification-first workflow that protects buyers, suppliers, and patients.</p>

            </div>

            {/* Desktop Grid / Mobile Marquee */}
            <div className="relative">
                {/* Desktop Grid */}
                <div className="hidden md:grid md:grid-cols-3 gap-5">
                    {VALUE_PROPS.map((prop, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <FeatureCard {...prop} />
                        </motion.div>
                    ))}
                </div>

                {/* Mobile Auto-swipe Marquee */}
                <div className="md:hidden flex overflow-hidden group py-4">
                    <motion.div
                        className="flex gap-4"
                        animate={{
                            x: ["0%", "-50%"]
                        }}
                        transition={{
                            duration: 25,
                            ease: "linear",
                            repeat: Infinity
                        }}
                    >
                        {[...VALUE_PROPS, ...VALUE_PROPS].map((prop, index) => (
                            <div
                                key={index}
                                className="shrink-0 w-70"
                            >
                                <FeatureCard {...prop} />
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Indicators (Desktop only since mobile is auto) */}
                <div className="hidden md:flex justify-center gap-1.5 mt-8">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-blue-600' : 'bg-slate-300'}`} />
                    ))}
                </div>
            </div>
        </section>
    );
}
