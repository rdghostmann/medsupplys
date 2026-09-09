import React from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StatCard } from '../components/ui/StatCard';
import { CTASection } from '../components/ui/CTASection';
import { 
  MONTHLY_PROCUREMENT_DATA, 
  CATEGORY_SPEND_DISTRIBUTION,
  PLATFORM_STATS 
} from '../data/mockData';
import { 
  Package, 
  Building2, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Server, 
  BarChart3, 
  PieChart as PieIcon,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const StatsPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-6">
            <BarChart3 size={14} className="text-blue-600" />
            Empirical Platform Intelligence
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto">
            MedSupply by the Numbers
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Transparent metrics tracking marketplace volume, supplier onboarding velocity, order fulfillment reliability, and institutional hospital adoption.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Telemetry updated real-time &bull; Demo statistics reflect production simulation</span>
          </div>
        </div>
      </section>

      {/* Primary Hero Metrics */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard
              label="Products"
              value={PLATFORM_STATS.productsCount}
              subtext="Formulary SKUs"
              icon={Package}
              highlight={true}
            />
            <StatCard
              label="Suppliers"
              value={PLATFORM_STATS.suppliersCount}
              subtext="GDP Audited"
              icon={Building2}
            />
            <StatCard
              label="Healthcare Buyers"
              value={PLATFORM_STATS.buyersCount}
              subtext="Hospitals &amp; Clinics"
              icon={Users}
            />
            <StatCard
              label="Procurement Value"
              value={PLATFORM_STATS.procurementValue}
              subtext="Gross platform volume"
              icon={TrendingUp}
            />
            <StatCard
              label="Fulfillment Rate"
              value={PLATFORM_STATS.fulfillmentRate}
              subtext="On-time delivery"
              icon={CheckCircle2}
            />
            <StatCard
              label="Platform Availability"
              value={PLATFORM_STATS.platformUptime}
              subtext="Enterprise SLA"
              icon={Server}
            />
          </div>
        </div>
      </section>

      {/* Visual Charts Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Chart 1: Monthly Procurement Volume Growth */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Financial Telemetry</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  Monthly Procurement Volume (₦ Millions)
                </h3>
                <p className="text-xs text-slate-500">Gross order value transacted through verified hospital purchase orders</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  +268% Annualized Run-rate
                </span>
              </div>
            </div>

            <div className="h-72 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_PROCUREMENT_DATA}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e40af" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00b87c" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} unit="M" />
                  <Tooltip 
                    formatter={(val: any) => [`₦${val} Million`, 'Procurement Volume']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="volumeMln" 
                    stroke="#1e40af" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#colorVolume)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart Grid: Orders Fulfilled & Supplier Growth */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chart 2: Monthly Orders Fulfilled */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Operational Velocity</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Monthly Purchase Orders Fulfilled
                </h3>
                <p className="text-xs text-slate-500">Hospital purchase orders successfully dispatched &amp; accepted</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MONTHLY_PROCUREMENT_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip 
                      formatter={(val: any) => [val, 'Completed Orders']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <Bar dataKey="orders" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Verified Supplier Base Growth */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Network Density</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Verified Supplier Ecosystem Expansion
                </h3>
                <p className="text-xs text-slate-500">Active licensed pharmaceutical importers, distributors &amp; wholesalers</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MONTHLY_PROCUREMENT_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip 
                      formatter={(val: any) => [val, 'Active Suppliers']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="activeSuppliers" 
                      stroke="#059669" 
                      strokeWidth={2.5} 
                      dot={{ r: 3, fill: '#059669' }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Chart 4: Spend Distribution by Therapeutic Category */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Therapeutic Demand</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Procurement Spend Breakdown by Drug Category
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Antibiotics and anti-infectives continue to lead hospital procurement demand, followed closely by cardiovascular therapies and temperature-monitored biologics.
                </p>

                <div className="mt-6 space-y-2">
                  {CATEGORY_SPEND_DISTRIBUTION.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-medium text-slate-700">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CATEGORY_SPEND_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {CATEGORY_SPEND_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: any) => [`${val}% of total procurement spend`, 'Category']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
};
