import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const FAQS = [
    {
      question: 'How does MedSupply work for healthcare buyers?',
      answer: 'MedSupply operates as a curated B2B procurement network. Hospital procurement teams and licensed pharmacies search our standardized pharmaceutical catalogue, compare line-item quotes from verified distributors and importers, issue formal digital purchase orders, and track deliveries with cold-chain oversight from warehouse to dispensary.'
    },
    {
      question: 'Who is eligible to purchase medicines through MedSupply?',
      answer: 'MedSupply is strictly a B2B platform. Access is restricted to licensed healthcare organizations including teaching hospitals, private medical clinics, retail pharmacy chains, community health boards, and authorized corporate medical centers. All buying entities must submit their operating license during onboarding.'
    },
    {
      question: 'How does MedSupply verify pharmaceutical suppliers?',
      answer: 'Every supplier on our platform undergoes a rigorous 4-step compliance audit: validation of national regulatory licenses (such as NAFDAC and Pharmacy Council operating permits), corporate registry authentication, verification of physical Good Distribution Practice (GDP) warehouse standards, and strict anti-counterfeiting history checks.'
    },
    {
      question: 'What is the difference between Importer, Distributor, and Retailer tiers?',
      answer: 'Importers bring WHO-prequalified and registered therapeutics into the country in bulk with higher Minimum Order Quantities (MOQ). Distributors maintain regional warehouses and offer intermediate pack sizes with 24-48 hour delivery. Retailers and institutional suppliers cater to smaller clinics requiring lower MOQs with same-day or rapid fulfillment.'
    },
    {
      question: 'Can our hospital compare prices across multiple suppliers before ordering?',
      answer: 'Yes. MedSupply provides instant side-by-side pricing matrices showing unit prices, pack sizes, volume-discount tiers, batch numbers, remaining shelf-life, and delivery lead times from every verified supplier carrying that SKU.'
    },
    {
      question: 'How does MedSupply ensure cold-chain integrity during delivery?',
      answer: 'Cold-chain products (such as insulin, biologicals, and vaccines) are fulfilled exclusively by GDP-certified distributors equipped with calibrated temperature-controlled active coolers and data loggers. Temperature compliance reports are verified at handover before goods receipt is signed.'
    }
  ];
  

  return (
    <div className="max-w-3xl mx-auto space-y-3.5">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
              isOpen 
                ? 'bg-white border-blue-600/40 shadow-sm' 
                : 'bg-white border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base focus:outline-hidden cursor-pointer"
              aria-expanded={isOpen}
            >
              <span>{faq.question}</span>
              <ChevronDown
                size={18}
                className={`text-slate-500 shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-blue-700' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
