import { Router, Request, Response } from 'express';
import { ReportService } from '../services/ReportService.js';

const router = Router();
const reportService = new ReportService();

// GET /api/reports/:investigationId
router.get('/:investigationId', (req: Request, res: Response) => {
  try {
    const report = reportService.generateReport(req.params.investigationId);
    return res.json(report);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to generate standardized report', message: err.message });
  }
});

export default router;
