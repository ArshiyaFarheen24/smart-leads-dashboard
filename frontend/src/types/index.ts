export interface ILead {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdAt: string;
}

export interface LeadsMeta {
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface LeadsResponse {
  leads: ILead[];
  meta: LeadsMeta;
}
