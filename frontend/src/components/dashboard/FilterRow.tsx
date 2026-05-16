import React from 'react';
import { Search, Download, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface FilterRowProps {
  filters: { status: string; source: string; search: string; sort: string };
  updateFilter: (key: any, value: string) => void;
  onExport: () => void;
  onAddNew: () => void;
}

export const FilterRow: React.FC<FilterRowProps> = ({ filters, updateFilter, onExport, onAddNew }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search leads..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
          />
        </div>
        
        <select
          value={filters.status}
          onChange={(e) => updateFilter('status', e.target.value)}
          className="block w-full sm:w-40 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm rounded-lg border bg-white text-slate-700"
        >
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
        </select>

        <select
          value={filters.source}
          onChange={(e) => updateFilter('source', e.target.value)}
          className="block w-full sm:w-40 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm rounded-lg border bg-white text-slate-700"
        >
          <option value="">All Sources</option>
          <option value="Website">Website</option>
          <option value="Instagram">Instagram</option>
          <option value="Referral">Referral</option>
        </select>
        
        <select
          value={filters.sort}
          onChange={(e) => updateFilter('sort', e.target.value)}
          className="block w-full sm:w-32 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm rounded-lg border bg-slate-50 text-slate-700"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        {user?.role === 'admin' && (
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        )}
        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Lead</span>
        </button>
      </div>
    </div>
  );
};
