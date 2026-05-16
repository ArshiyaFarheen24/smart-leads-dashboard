import React from 'react';
import type { ILead } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Edit2, Trash2, Mail, Calendar } from 'lucide-react';

interface LeadsTableProps {
  leads: ILead[];
  onEdit: (lead: ILead) => void;
  onDelete: (id: string) => void;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onEdit, onDelete }) => {
  const { user } = useAuth();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Qualified': return 'bg-green-100 text-green-800';
      case 'Lost': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="bg-white border-t border-x border-slate-200 rounded-t-xl overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Source
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Added
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-slate-900">{lead.name}</div>
                  <div className="flex items-center text-sm text-slate-500 mt-0.5">
                    <Mail className="w-3 h-3 mr-1.5" />
                    {lead.email}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(lead.status)}`}>
                  {lead.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {lead.source}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5 text-slate-400" />
                  {new Date(lead.createdAt).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(lead)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => onDelete(lead._id as string)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
