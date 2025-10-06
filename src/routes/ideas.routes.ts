import { Router } from 'express';
import { ideasController } from '../controllers/ideas.controller';

const router = Router();

router.get('/', (req, res) => ideasController.getIdeas(req, res));

export default router;

