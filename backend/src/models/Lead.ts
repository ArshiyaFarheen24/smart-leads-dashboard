import mongoose, { Schema, Document } from 'mongoose';
import { ILead } from '../types';

export interface ILeadDocument extends Document, Omit<ILead, 'id'> {}

const leadSchema = new Schema<ILeadDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'],
      default: 'New',
    },
    source: {
      type: String,
      enum: ['Website', 'Instagram', 'Referral'],
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Lead = mongoose.model<ILeadDocument>('Lead', leadSchema);
