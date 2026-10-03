import { Router, Request, Response } from 'express';
import { EntityAttributionService } from '../services/EntityAttributionService.js';

const router = Router();
const entityService = new EntityAttributionService();

// GET /api/entities
router.get('/', (req: Request, res: Response) => {
  try {
    const { network } = req.query;
    const entities = entityService.getAllEntities(network as string);
    return res.json(entities);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve entity intelligence', message: err.message });
  }
});

// GET /api/entities/lookup/:address
router.get('/lookup/:address', (req: Request, res: Response) => {
  try {
    const { network = 'ETH' } = req.query;
    const entity = entityService.lookupWallet(req.params.address, network as string);
    if (!entity) {
      return res.json({
        found: false,
        attribution: 'UNKNOWN',
        message: 'No verified VASP or service cluster match found for this wallet address in known registries.'
      });
    }
    return res.json({ found: true, entity });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to lookup entity', message: err.message });
  }
});

export default router;
