import { Router } from 'express';
import { ideasController } from '../controllers/ideas.controller';
import { votesController } from '../controllers/votes.controller';

const router = Router();

router.get('/', (req, res) => ideasController.getIdeas(req, res));
router.post('/:id/vote', (req, res) => votesController.voteForIdea(req, res));

export default router;

