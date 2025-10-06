import { Request, Response } from 'express';
import { votesService } from '../services/votes.service';
import { getClientIp } from '../utils/getClientIp';

export class VotesController {
  async voteForIdea(req: Request, res: Response): Promise<void> {
    try {
      const ideaId = parseInt(req.params.id, 10);
      
      if (isNaN(ideaId)) {
        res.status(400).json({ error: 'Invalid idea ID' });
        return;
      }

      const clientIp = getClientIp(req);
      
      await votesService.voteForIdea(ideaId, clientIp);
      
      res.status(201).json({ message: 'Vote added successfully' });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'ALREADY_VOTED') {
          res.status(409).json({ error: 'You have already voted for this idea' });
          return;
        }
        
        if (error.message === 'VOTE_LIMIT_REACHED') {
          res.status(409).json({ error: 'You have reached the limit of 10 votes' });
          return;
        }
        
        if (error.message === 'IDEA_NOT_FOUND') {
          res.status(404).json({ error: 'Idea not found' });
          return;
        }
      }
      
      console.error('Error voting for idea:', error);
      res.status(500).json({ error: 'Failed to vote for idea' });
    }
  }
}

export const votesController = new VotesController();

