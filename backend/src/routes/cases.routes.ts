import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { CaseService } from '../services/CaseService.js';

const router = Router();
const caseService = new CaseService();

const CreateCaseSchema = z.object({
  caseId: z.string().min(1, 'Case ID is required'),
  title: z.string().min(1, 'Title is required'),
  incidentType: z.enum([
    'Investment Fraud',
    'Task Fraud',
    'Phishing',
    'Ransomware',
    'Sextortion',
    'Darknet-related Fraud',
    'Organized Cyber Fraud',
    'Other'
  ]),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  assignedInvestigator: z.string().min(1, 'Investigator name is required'),
  complaintReference: z.string().optional(),
  reportedWallet: z.string().min(1, 'Reported wallet is required'),
  network: z.enum(['ETH', 'POLYGON', 'BSC', 'BTC', 'TRON', 'ARBITRUM']),
  notes: z.string().optional()
});

// GET /api/cases
router.get('/', (req: Request, res: Response) => {
  try {
    const { status, priority, incidentType, search } = req.query;
    const cases = caseService.getAllCases({
      status: status as string,
      priority: priority as string,
      incidentType: incidentType as string,
      search: search as string
    });
    return res.json(cases);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve cases', message: err.message });
  }
});

// GET /api/cases/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const data = caseService.getCaseById(req.params.id);
    if (!data.caseData) {
      return res.status(404).json({ error: `Case ${req.params.id} not found.` });
    }
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch case details', message: err.message });
  }
});

// POST /api/cases
router.post('/', (req: Request, res: Response) => {
  try {
    const parsed = CreateCaseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors });
    }

    const created = caseService.createCase(parsed.data);
    return res.status(201).json(created);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create case', message: err.message });
  }
});

// PATCH /api/cases/:id/status
router.patch('/:id/status', (req: Request, res: Response) => {
  try {
    const { status, user, notes } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const success = caseService.updateCaseStatus(req.params.id, status, user || 'Investigating Officer', notes);
    if (!success) {
      return res.status(404).json({ error: `Case ${req.params.id} not found.` });
    }
    return res.json({ success: true, message: `Status updated to ${status}` });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update case status', message: err.message });
  }
});

export default router;
