import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { getDatabase } from './db/database.js';
import { seedDatabase } from './db/seed.js';

import investigationsRouter from './routes/investigations.routes.js';
import casesRouter from './routes/cases.routes.js';
import walletsRouter from './routes/wallets.routes.js';
import transactionsRouter from './routes/transactions.routes.js';
import entitiesRouter from './routes/entities.routes.js';
import evidenceRouter from './routes/evidence.routes.js';
import alertsRouter from './routes/alerts.routes.js';
import reportsRouter from './routes/reports.routes.js';
import systemRouter from './routes/system.routes.js';
import searchRouter from './routes/search.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database & Seeds
const db = getDatabase();
seedDatabase(db);

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// Request Logger
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API Routes
app.use('/api/investigations', investigationsRouter);
app.use('/api/cases', casesRouter);
app.use('/api/wallets', walletsRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/entities', entitiesRouter);
app.use('/api/evidence', evidenceRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/system', systemRouter);
app.use('/api/search', searchRouter);

// Health check root
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'SIH26183 Blockchain Forensics Engine',
    timestamp: new Date().toISOString()
  });
});

// Central Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[API Error]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred in forensics engine.'
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  I4C BLOCKCHAIN FORENSICS ENGINE (SIH26183) ONLINE   `);
  console.log(`  Listening on http://localhost:${PORT}               `);
  console.log(`  Relational SQLite DB Initialized with WAL Mode      `);
  console.log(`=======================================================`);
});
