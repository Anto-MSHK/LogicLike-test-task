import { sequelize, Vote, Idea } from '../models';

export class VotesService {
  async voteForIdea(ideaId: number, clientIp: string): Promise<void> {
    await sequelize.transaction(async (t) => {
      const existingVote = await Vote.findOne({
        where: { ideaId, ipAddress: clientIp },
        transaction: t,
      });

      if (existingVote) {
        throw new Error('ALREADY_VOTED');
      }

      const votesCount = await Vote.count({
        where: { ipAddress: clientIp },
        distinct: true,
        col: 'ideaId',
        transaction: t,
      });

      if (votesCount >= 10) {
        throw new Error('VOTE_LIMIT_REACHED');
      }

      const idea = await Idea.findByPk(ideaId, { transaction: t });
      if (!idea) {
        throw new Error('IDEA_NOT_FOUND');
      }

      await Vote.create(
        { ideaId, ipAddress: clientIp },
        { transaction: t }
      );
    });
  }
}

export const votesService = new VotesService();

