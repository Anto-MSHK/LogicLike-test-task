import { sequelize, Vote, Idea } from '../models';
import { getSocketIO } from '../socket';

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

    const newVoteCount = await Vote.count({
      where: { ideaId },
    });

    try {
      const io = getSocketIO();
      io.emit('vote_update', {
        ideaId,
        newVoteCount,
      });
      console.log(`✓ Emitted vote_update for idea ${ideaId}, new count: ${newVoteCount}`);
    } catch (error) {
      console.error('Warning: Failed to emit socket event:', error);
    }
  }
}

export const votesService = new VotesService();

