import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

export interface VoteAttributes {
  id: number;
  ideaId: number;
  ipAddress: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VoteCreationAttributes extends Optional<VoteAttributes, 'id'> {}

export class VoteModel extends Model<VoteAttributes, VoteCreationAttributes> implements VoteAttributes {
  public id!: number;
  public ideaId!: number;
  public ipAddress!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initializeVoteModel(sequelize: Sequelize): typeof VoteModel {
  VoteModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ideaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Ideas',
          key: 'id',
        },
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'Votes',
      timestamps: true,
    }
  );

  return VoteModel;
}

