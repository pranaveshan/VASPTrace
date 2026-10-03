import { Router, Request, Response } from 'express';
import { AlertService } from '../services/AlertService.js';

const router = Router();
const alertService = new AlertService();

// GET /api/alerts
router.get('/', (req: Request, res: Response) => {
  try {
    const { caseId } = req.query;
    const alerts = alertService.getAllAlerts(caseId as string);
    return res.json(alerts);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve alerts', message: err.message });
  }
});

// POST /api/alerts
router.post('/', (req: Request, res: Response) => {
  try {
    const { caseId, wallet, trigger, severity, evidence } = req.body;
    if (!caseId || !wallet || !trigger || !severity) {
      return res.status(400).json({ error: 'Missing required alert fields' });
    }
    const alert = alertService.createAlert({
      caseId,
      wallet,
      trigger,
      severity,
      evidence: evidence || 'System trigger condition met'
    });
    return res.status(201).json(alert);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create alert', message: err.message });
  }
});

// PATCH /api/alerts/:id/status
router.patch('/:id/status', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (status !== 'ACKNOWLEDGED' && status !== 'DISMISSED') {
      return res.status(400).json({ error: 'Invalid status. Must be ACKNOWLEDGED or DISMISSED' });
    }
    const success = alertService.updateAlertStatus(req.params.id, status);
    if (!success) {
      return res.status(404).json({ error: `Alert ${req.params.id} not found.` });
    }
    return res.json({ success: true, message: `Alert status updated to ${status}` });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update alert', message: err.message });
  }
});

export default router;
