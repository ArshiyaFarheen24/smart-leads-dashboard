import React from 'react';
import { AlertCircle, FileSearch, X } from 'lucide-react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse flex flex-col space-y-4 w-full">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-white border border-slate-200 rounded-xl shadow-sm"></div>
      ))}
    </div>
  );
};

export const EmptyState: React.FC<{ message?: string }> = ({ message = "No leads found." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        <FileSearch className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-900">No results</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm text-center">
        {message} Try adjusting your filters or search query to find what you're looking for.
      </p>
    </div>
  );
};

export const ErrorBanner: React.FC<{ error: string; onDismiss: () => void }> = ({ error, onDismiss }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6 shadow-sm relative animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={onDismiss}
              className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-red-50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
