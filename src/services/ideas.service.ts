import { Sequelize } from 'sequelize';
import { Idea, Vote } from '../models';

export interface IdeaWithVotes {
  id: number;
  title: string;
  description: string;
  votesCount: number;
  votedByMe: boolean;
}

export class IdeasService {
  async getIdeasWithVotes(clientIp: string): Promise<IdeaWithVotes[]> {
    const ideas = await Idea.findAll({
      attributes: [
        'id',
        'title',
        'description',
        [Sequelize.fn('COUNT', Sequelize.col('votes.id')), 'votesCount'],
      ],
      include: [
        {
          model: Vote,
          as: 'votes',
          attributes: [],
        },
      ],
      group: ['IdeaModel.id', 'IdeaModel.title', 'IdeaModel.description'],
      order: [[Sequelize.literal('"votesCount"'), 'DESC']],
      raw: true,
      subQuery: false,
    });

    const userVotes = await Vote.findAll({
      where: { ipAddress: clientIp },
      attributes: ['ideaId'],
      raw: true,
    });

    const votedIdeaIds = new Set(userVotes.map((vote) => vote.ideaId));

    return ideas.map((idea: any) => ({
      id: idea.id,
      title: idea.title,
      description: idea.description,
      votesCount: parseInt(idea.votesCount, 10) || 0,
      votedByMe: votedIdeaIds.has(idea.id),
    }));
  }
}

export const ideasService = new IdeasService();

