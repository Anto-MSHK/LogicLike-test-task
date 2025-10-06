import { Sequelize } from 'sequelize';
import * as path from 'path';
import * as fs from 'fs';

const env = process.env.NODE_ENV || 'development';
const configPath = path.join(__dirname, '..', '..', 'config', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging === false ? false : console.log,
  }
);

import { IdeaModel, initializeIdeaModel } from './idea.model';
import { VoteModel, initializeVoteModel } from './vote.model';

const Idea = initializeIdeaModel(sequelize);
const Vote = initializeVoteModel(sequelize);

Idea.hasMany(Vote, {
  foreignKey: 'ideaId',
  as: 'votes',
  onDelete: 'CASCADE',
});

Vote.belongsTo(Idea, {
  foreignKey: 'ideaId',
  as: 'idea',
});

export { sequelize, Idea, Vote };
export type { IdeaModel, VoteModel };

