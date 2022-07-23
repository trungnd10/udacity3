import { Model, Sequelize, DataTypes } from 'sequelize';
export default class FeedItem extends Model {
  public id?: number;
  public caption!: string;
  public url!: string;
  public createdAt?: Date;
  public updatedAt?: Date;
}
export const FeedItemMap = (sequelize: Sequelize) => {
    FeedItem.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    caption: {
      type: DataTypes.STRING(1000)
    },
    url: {
      type: DataTypes.STRING(1000)
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'FeedItem',
    timestamps: false
  });
  FeedItem.sync();
}