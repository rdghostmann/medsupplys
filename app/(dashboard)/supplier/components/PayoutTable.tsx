import { useState } from 'react';
import { PayoutRecord, PayoutStatus } from '../types';
import { Search, Filter, ArrowUpDown, ChevronDown } from 'lucide-react';

interface PayoutTableProps {
  payouts: PayoutRecord[];
  onRowClick: (record: PayoutRecord) => void;
}

type SortField = 'date' | 'ordersCount' | 'gross' | 'platformFee' | 'netPayout' | 'status';
type SortOrder = 'asc' | 'desc';

export default function PayoutTable({ payouts, onRowClick }: PayoutTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PayoutStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Safe sorting evaluator
  const compareValues = (a: PayoutRecord, b: PayoutRecord) => {
    let valA: any = a[sortBy];
    let valB: any = b[sortBy];

    // Special logic for sorting by Date
    if (sortBy === 'date') {
      if (valA === 'Pending') valA = '9999-12-31'; // Put pending on top in desc
      if (valB === 'Pending') valB = '9999-12-31';
      
      const dateA = new Date(valA).getTime();
      const dateB = new Date(valB).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }

    if (typeof valA === 'string') {
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }

    return sortOrder === 'asc' ? valA - valB : valB - valA;
  };

  const filteredPayouts = payouts
    .filter((record) => {
      // Matches date search
      const matchesSearch = record.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.status.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Matches status filter choice
      const matchesStatus = statusFilter === 'All' ? true : record.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort(compareValues);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden" id="payout-history-container">
      {/* Table Header Section */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-950 font-sans tracking-tight" id="payout-history-title">Payout History</h2>
        
        {/* Dynamic Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Custom Search field */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl w-full sm:w-48 outline-none transition-all"
              id="search-payouts"
            />
          </div>

          {/* Custom Status Filter Dropdown */}
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PayoutStatus | 'All')}
              className="pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl outline-none appearance-none transition-all cursor-pointer font-medium text-slate-600"
              id="filter-payouts-status"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Awaiting Verification">Awaiting Verification</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 h-3 w-3 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-auto" id="payout-records-table">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100">
              <th 
                className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-400 uppercase cursor-pointer select-none hover:text-slate-700 transition-colors"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-1.5">
                  DATE
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              
              <th 
                className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-400 uppercase cursor-pointer select-none hover:text-slate-700 transition-colors"
                onClick={() => handleSort('ordersCount')}
              >
                <div className="flex items-center gap-1.5">
                  ORDERS
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              <th 
                className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-400 uppercase cursor-pointer select-none hover:text-slate-700 transition-colors"
                onClick={() => handleSort('gross')}
              >
                <div className="flex items-center gap-1.5">
                  GROSS
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              <th 
                className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-400 uppercase cursor-pointer select-none hover:text-slate-700 transition-colors"
                onClick={() => handleSort('platformFee')}
              >
                <div className="flex items-center gap-1.5">
                  PLATFORM FEE
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              <th 
                className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-400 uppercase cursor-pointer select-none hover:text-slate-700 transition-colors"
                onClick={() => handleSort('netPayout')}
              >
                <div className="flex items-center gap-1.5">
                  NET PAYOUT
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              <th 
                className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-400 uppercase cursor-pointer select-none hover:text-slate-700 transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1.5">
                  STATUS
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100/80">
            {filteredPayouts.length > 0 ? (
              filteredPayouts.map((record) => {
                const isPendingDate = record.date.toLowerCase() === 'pending';
                return (
                  <tr
                    key={record.id}
                    onClick={() => onRowClick(record)}
                    aria-label={`View payout receipt dated ${record.date}`}
                    className="hover:bg-slate-50/50 cursor-pointer transition-colors duration-150 group"
                    id={`row-${record.id}`}
                  >
                    {/* Column 1: Date */}
                    <td className="px-6 py-4.5 text-sm font-semibold text-slate-900">
                      <span className={isPendingDate ? 'text-slate-500 font-medium' : 'text-slate-900 font-medium'}>
                        {record.date}
                      </span>
                    </td>

                    {/* Column 2: Orders count */}
                    <td className="px-6 py-4.5 text-sm text-slate-500 font-medium font-sans">
                      {record.ordersCount} orders
                    </td>

                    {/* Column 3: Gross */}
                    <td className="px-6 py-4.5 text-sm font-bold text-slate-900 font-mono">
                      ₦{record.gross.toLocaleString('en-NG')}
                    </td>

                    {/* Column 4: Platform fee */}
                    <td className="px-6 py-4.5 text-sm text-slate-500 font-mono">
                      ₦{record.platformFee.toLocaleString('en-NG')}
                    </td>

                    {/* Column 5: Net Payout */}
                    <td className="px-6 py-4.5 text-sm font-semibold text-slate-900 font-mono group-hover:text-indigo-600 transition-colors">
                      ₦{record.netPayout.toLocaleString('en-NG')}
                    </td>

                    {/* Column 6: Status badge */}
                    <td className="px-6 py-4.5">
                      {record.status === 'Paid' ? (
                        <span className="inline-flex items-center bg-emerald-50 text-[11px] font-semibold text-emerald-700 px-3 py-1 rounded-full border border-emerald-100/60 shadow-xs">
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center bg-amber-50 text-[11px] font-semibold text-amber-800 px-3 py-1 rounded-full border border-amber-100/60 shadow-xs">
                          {record.status}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400 font-medium">
                  No records matching your search queries.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Info helper footer bar */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-medium gap-2">
        <span>Click on any row to view breakdown details, bank transfer records, or download receipts.</span>
        <div className="flex gap-4">
          <span>* Includes 10% Platform fee deductions</span>
        </div>
      </div>
    </div>
  );
}
