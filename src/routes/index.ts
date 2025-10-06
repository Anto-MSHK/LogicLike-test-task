import { Router } from 'express';
import ideasRoutes from './ideas.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

router.use('/ideas', ideasRoutes);

export default router;

