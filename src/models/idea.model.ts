import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

export interface IdeaAttributes {
  id: number;
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IdeaCreationAttributes extends Optional<IdeaAttributes, 'id'> {}

export class IdeaModel extends Model<IdeaAttributes, IdeaCreationAttributes> implements IdeaAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initializeIdeaModel(sequelize: Sequelize): typeof IdeaModel {
  IdeaModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'Ideas',
      timestamps: true,
    }
  );

  return IdeaModel;
}

