import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Voting System API',
    version: '1.0.0',
  });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;

