import React from 'react';
import { Testimonial } from '../../types';
import { Star, Building2 } from 'lucide-react';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-6 sm:p-7 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
          ))}
        </div>
        <p className="text-slate-700 text-sm leading-relaxed italic">
          "{testimonial.quote}"
        </p>
      </div>

      <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
        {testimonial.avatarUrl ? (
          <img 
            src={testimonial.avatarUrl} 
            alt={testimonial.author}
            className="w-11 h-11 rounded-full object-cover border border-slate-200"
            loading="lazy"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
            {testimonial.author.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate">
            {testimonial.author}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {testimonial.role}
          </p>
          <p className="text-[11px] font-semibold text-blue-800 truncate flex items-center gap-1 mt-0.5">
            <Building2 size={11} />
            {testimonial.organization}
          </p>
        </div>
      </div>
    </div>
  );
};
