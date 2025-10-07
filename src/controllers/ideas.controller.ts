import { Request, Response } from 'express';
import { ideasService } from '../services/ideas.service';
import { getClientIp } from '../utils/getClientIp';

export class IdeasController {
  async getIdeas(req: Request, res: Response): Promise<void> {
    try {
      const clientIp = await getClientIp(req);
      const ideas = await ideasService.getIdeasWithVotes(clientIp);
      
      res.json(ideas);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      res.status(500).json({ error: 'Failed to fetch ideas' });
    }
  }
}

export const ideasController = new IdeasController();

