import { Model, Sequelize, DataTypes } from 'sequelize';
export default class User extends Model {
  public id?: number;
  public email!: string;
  public passwordHash!: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  short() {
    return {
      email: this.email,
    };
  }
}
export const UserMap = (sequelize: Sequelize) => {
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(1000)
    },
    passwordHash: {
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
    tableName: 'User',
    timestamps: false
  });
  User.sync();
}