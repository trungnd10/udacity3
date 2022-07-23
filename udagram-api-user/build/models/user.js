"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMap = void 0;
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
    short() {
        return {
            email: this.email,
        };
    }
}
exports.default = User;
const UserMap = (sequelize) => {
    User.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: sequelize_1.DataTypes.STRING(1000)
        },
        passwordHash: {
            type: sequelize_1.DataTypes.STRING(1000)
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true
        },
    }, {
        sequelize,
        tableName: 'users',
        timestamps: false
    });
    User.sync();
};
exports.UserMap = UserMap;
