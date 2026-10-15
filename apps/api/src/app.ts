import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { z } from 'zod';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  const origin = process.env.CLIENT_ORIGIN;
  app.use(cors({ origin: origin ? origin.split(',').map((value) => value.trim()) : false }));
  app.use(express.json({ limit: '100kb' }));
  app.get('/api/health', (_req, res) => res.status(200).json({ status: 'ok', service: 'moundweb-api' }));
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));
  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const message = error instanceof z.ZodError ? 'Invalid request' : 'Internal server error';
    res.status(error instanceof z.ZodError ? 400 : 500).json({ error: message });
  });
  return app;
}
