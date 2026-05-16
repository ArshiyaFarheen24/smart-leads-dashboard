import express from 'express';
import {
  createLead,
  updateLead,
  deleteLead,
  getLeadById,
  getLeads,
  exportLeads,
} from '../controllers/leadController';
import { protect, restrictTo } from '../middleware/auth';

const router = express.Router();

// Apply protect middleware to all routes below
router.use(protect);

router.route('/')
  .get(getLeads)
  .post(createLead);

// Must be defined BEFORE /:id route, otherwise 'export' is treated as an id
router.get('/export', restrictTo('admin'), exportLeads);

router.route('/:id')
  .get(getLeadById)
  .put(updateLead)
  .delete(restrictTo('admin'), deleteLead);

export default router;
