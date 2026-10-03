import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { InvestigationService } from '../services/InvestigationService.js';
import { seedDatabase } from '../db/seed.js';

const router = Router();
const invService = new InvestigationService();

const InvestigationSchema = z.object({
  caseId: z.string().min(1, 'Case ID is required'),
  walletAddress: z.string().min(1, 'Wallet Address is required'),
  network: z.enum(['ETH', 'POLYGON', 'BSC', 'BTC', 'TRON', 'ARBITRUM']),
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
  hopDepth: z.number().int().min(1).max(5).default(3),
  dataMode: z.enum(['DEMO', 'LIVE']).default('DEMO'),
  complaintReference: z.string().optional(),
  notes: z.string().optional()
});

// Seed DB on start if needed
seedDatabase();

// POST /api/investigations
router.post('/', async (req: Request, res: Response) => {
  try {
    const parseResult = InvestigationSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors
      });
    }

    const investigation = await invService.runInvestigation(parseResult.data);
    return res.status(201).json(investigation);
  } catch (err: any) {
    return res.status(500).json({
      error: 'Investigation execution failed',
      message: err.message || 'Unknown error occurred during analysis.'
    });
  }
});

// GET /api/investigations/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const inv = invService.getInvestigationById(req.params.id);
    if (!inv) {
      return res.status(404).json({ error: `Investigation with ID ${req.params.id} not found.` });
    }
    return res.json(inv);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve investigation', message: err.message });
  }
});

// GET /api/investigations (Recent list)
router.get('/', (req: Request, res: Response) => {
  try {
    const list = invService.getRecentInvestigations();
    return res.json(list);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch investigations list', message: err.message });
  }
});

// POST /api/investigations/validate
router.post('/validate', (req: Request, res: Response) => {
  const { address, network } = req.body;
  if (!address || !network) {
    return res.status(400).json({ isValid: false, error: 'Address and network are required.' });
  }
  const result = invService.validateWallet(address, network);
  return res.json(result);
});

export default router;
