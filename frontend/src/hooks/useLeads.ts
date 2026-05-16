import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../api/client';
import type { ILead, LeadsResponse } from '../types';
import { useDebounce } from './useDebounce';

export interface LeadFilters {
  status: string;
  source: string;
  search: string;
  sort: string;
}

export const useLeads = () => {
  const [leads, setLeads] = useState<ILead[]>([]);
  const [filters, setFilters] = useState<LeadFilters>({
    status: '',
    source: '',
    search: '',
    sort: 'latest',
  });
  
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Debounce the search input to avoid API spam
  const debouncedSearch = useDebounce(filters.search, 500);
  
  // Track previous debounced search to determine if page needs to be reset specifically due to search
  const prevDebouncedSearch = useRef(debouncedSearch);

  // 2. Reset page to 1 safely when the debounced search output changes
  useEffect(() => {
    if (prevDebouncedSearch.current !== debouncedSearch) {
      setPage(1);
      prevDebouncedSearch.current = debouncedSearch;
    }
  }, [debouncedSearch]);

  // 3. Centralized fetch function
  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.source) params.append('source', filters.source);
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (filters.sort) params.append('sort', filters.sort);
      params.append('page', page.toString());

      const response = await apiClient.get<LeadsResponse>(`/leads?${params.toString()}`);
      
      setLeads(response.data.leads);
      setTotalPages(response.data.meta.totalPages);
      setTotalCount(response.data.meta.totalCount);
      
      // Ensure local state syncs with backend page state bounds
      setPage(response.data.meta.currentPage);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  }, [filters.status, filters.source, debouncedSearch, filters.sort, page]);

  // 4. Auto-fetch on any dependency update
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // 5. Handlers
  const updateFilter = (key: keyof LeadFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    // Immediately reset pagination to 1 for all direct filter changes (excluding search, handled by the debouncer)
    if (key !== 'search') {
      setPage(1);
    }
  };

  const changePage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return {
    leads,
    filters,
    page,
    totalPages,
    totalCount,
    isLoading,
    error,
    updateFilter,
    changePage,
    refresh: fetchLeads,
  };
};
