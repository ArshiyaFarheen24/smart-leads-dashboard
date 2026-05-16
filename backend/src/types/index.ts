export interface IUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'sales';
}

export interface ILead {
  id?: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdBy: string;
  createdAt: Date;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
