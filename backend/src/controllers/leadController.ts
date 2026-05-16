import { Request, Response } from 'express';
import { stringify } from 'csv-stringify';
import { Lead } from '../models/Lead';

export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const leadData = {
      ...req.body,
      createdBy: req.user?._id,
    };
    const lead = await Lead.create(leadData);
    res.status(201).json(lead);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error creating lead' });
  }
};

export const updateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }
    res.json(lead);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error updating lead' });
  }
};

export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }
    res.json({ message: 'Lead removed successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getLeadById = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }
    res.json(lead);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, source, search, sort, page } = req.query;

    const query: any = {};

    if (req.user?.role === 'sales') {
      query.createdBy = req.user._id;
    }

    // 1. Compound filtering
    if (status) query.status = status;
    if (source) query.source = source;

    // 2. Text search using regex for case-insensitivity
    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { email: { $regex: search as string, $options: 'i' } },
      ];
    }

    // 3. Sorting
    let sortOptions: any = { createdAt: -1 }; // Default to 'latest'
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    // 4. Server-side pagination
    const pageNum = parseInt(page as string, 10) || 1;
    const limit = 10;
    const skip = (pageNum - 1) * limit;

    const leads = await Lead.find(query).sort(sortOptions).skip(skip).limit(limit);
    const totalCount = await Lead.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    // 5. Clean JSON Response with 'meta' object
    res.json({
      leads,
      meta: {
        totalCount,
        currentPage: pageNum,
        totalPages,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const exportLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, source, search, sort } = req.query;

    const query: any = {};

    if (req.user?.role === 'sales') {
      query.createdBy = req.user._id;
    }

    if (status) query.status = status;
    if (source) query.source = source;

    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { email: { $regex: search as string, $options: 'i' } },
      ];
    }

    let sortOptions: any = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads_export.csv"');

    // Create CSV stringifier configured with the necessary columns
    const stringifier = stringify({
      header: true,
      columns: ['id', 'name', 'email', 'status', 'source', 'createdAt'],
    });

    // Pipe directly to the response object to stream data to the client
    stringifier.pipe(res);

    // Stream from database instead of loading everything in memory
    const cursor = Lead.find(query).sort(sortOptions).cursor();

    cursor.on('data', (doc) => {
      stringifier.write({
        id: doc._id.toString(),
        name: doc.name,
        email: doc.email,
        status: doc.status,
        source: doc.source,
        createdAt: doc.createdAt ? doc.createdAt.toISOString() : '',
      });
    });

    cursor.on('end', () => {
      stringifier.end();
    });

    cursor.on('error', (err) => {
      console.error('Database Cursor Error during export:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error streaming CSV data' });
      }
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
