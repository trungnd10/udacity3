"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedItemMap = void 0;
const sequelize_1 = require("sequelize");
class FeedItem extends sequelize_1.Model {
}
exports.default = FeedItem;
const FeedItemMap = (sequelize) => {
    FeedItem.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        caption: {
            type: sequelize_1.DataTypes.STRING(1000)
        },
        url: {
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
        tableName: 'FeedItem',
        timestamps: false
    });
    FeedItem.sync();
};
exports.FeedItemMap = FeedItemMap;
