"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config/config");
const sequelize_1 = require("sequelize");
exports.default = new sequelize_1.Sequelize({
    host: config_1.config.host,
    port: config_1.config.port,
    database: config_1.config.database,
    username: config_1.config.username,
    password: config_1.config.password,
    dialect: "postgres",
    dialectOptions: {},
    // dialectOptions: {
    //   ssl: {
    //     require: true, // This will help you. But you will see nwe error
    //     rejectUnauthorized: false // This line will fix new error
    //   }
    // },
});
