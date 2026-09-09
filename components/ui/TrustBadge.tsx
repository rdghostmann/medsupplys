import React from 'react';
import { ShieldCheck, BadgeCheck, Lock, Activity, ThermometerSnowflake, FileCheck2 } from 'lucide-react';

interface TrustBadgeProps {
  type: 'verified' | 'compliance' | 'security' | 'coldchain' | 'nafdac' | 'audit';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ 
  type, 
  label, 
  size = 'md',
  className = '' 
}) => {
  const getBadgeConfig = () => {
    switch (type) {
      case 'verified':
        return {
          icon: BadgeCheck,
          text: label || 'Verified Supplier',
          classes: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
          iconColor: 'text-emerald-600'
        };
      case 'compliance':
        return {
          icon: ShieldCheck,
          text: label || 'GDP & Regulatory Compliant',
          classes: 'bg-blue-50 text-blue-900 border-blue-200/80',
          iconColor: 'text-blue-600'
        };
      case 'security':
        return {
          icon: Lock,
          text: label || '256-Bit Encrypted Data',
          classes: 'bg-slate-100 text-slate-800 border-slate-200',
          iconColor: 'text-slate-600'
        };
      case 'coldchain':
        return {
          icon: ThermometerSnowflake,
          text: label || 'Cold Chain Monitored (2-8°C)',
          classes: 'bg-cyan-50 text-cyan-900 border-cyan-200/80',
          iconColor: 'text-cyan-600'
        };
      case 'nafdac':
        return {
          icon: FileCheck2,
          text: label || 'NAFDAC Verified Premises',
          classes: 'bg-blue-50 text-blue-900 border-blue-200/80',
          iconColor: 'text-blue-600'
        };
      case 'audit':
        return {
          icon: Activity,
          text: label || 'Traceable Audit Trail',
          classes: 'bg-indigo-50 text-indigo-900 border-indigo-200/80',
          iconColor: 'text-indigo-600'
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3.5 py-1.5 gap-2'
  };

  const iconSizes = {
    sm: 13,
    md: 14,
    lg: 16
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full border shadow-2xs font-medium tracking-tight whitespace-nowrap ${config.classes} ${sizeClasses[size]} ${className}`}
    >
      <Icon size={iconSizes[size]} className={`shrink-0 ${config.iconColor}`} />
      <span>{config.text}</span>
    </span>
  );
};
