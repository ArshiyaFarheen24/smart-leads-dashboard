import React, { useState } from 'react';
import { useLeads } from '../hooks/useLeads';
import { FilterRow } from '../components/dashboard/FilterRow';
import { LeadsTable } from '../components/dashboard/LeadsTable';
import { Pagination } from '../components/dashboard/Pagination';
import { LoadingSkeleton, EmptyState, ErrorBanner } from '../components/common/FeedbackUI';
import { LeadModal } from '../components/modals/LeadModal';
import apiClient from '../api/client';
import type { ILead } from '../types';

export const Dashboard: React.FC = () => {
  const { leads, filters, page, totalPages, totalCount, isLoading, error, updateFilter, changePage, refresh } = useLeads();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<ILead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleExport = () => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    
    apiClient.get(`/leads/export?${params.toString()}`, { responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'leads_export.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(() => {
        setActionError('Failed to export leads.');
      });
  };

  const handleAddNew = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const handleEdit = (lead: ILead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await apiClient.delete(`/leads/${id}`);
        refresh();
      } catch (err: any) {
        setActionError(err.response?.data?.message || 'Failed to delete lead');
      }
    }
  };

  const handleModalSubmit = async (data: Partial<ILead>) => {
    setIsSubmitting(true);
    setActionError(null);
    try {
      if (editingLead && editingLead._id) {
        await apiClient.put(`/leads/${editingLead._id}`, data);
      } else {
        await apiClient.post('/leads', data);
      }
      setIsModalOpen(false);
      refresh();
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to save lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads Overview</h1>
          <p className="mt-1 text-sm text-slate-500">Manage and track your lead pipeline</p>
        </div>
      </div>

      {(error || actionError) && (
        <ErrorBanner 
          error={(error || actionError) as string} 
          onDismiss={() => {
            setActionError(null);
          }} 
        />
      )}

      <FilterRow 
        filters={filters} 
        updateFilter={updateFilter} 
        onExport={handleExport} 
        onAddNew={handleAddNew} 
      />

      <div className="flex-1 min-h-0 flex flex-col">
        {isLoading && leads.length === 0 ? (
          <LoadingSkeleton />
        ) : leads.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex-1 shadow-sm rounded-xl flex flex-col mb-10">
            <LeadsTable leads={leads} onEdit={handleEdit} onDelete={handleDelete} />
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              totalCount={totalCount} 
              onPageChange={changePage} 
            />
          </div>
        )}
      </div>

      {isModalOpen && (
        <LeadModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleModalSubmit} 
          initialData={editingLead}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};
