import { config } from './config/config';
import { Sequelize } from 'sequelize';
export default new Sequelize({
  host: config.host,
  port: config.port,
  database: config.database,
  username: config.username,
  password: config.password,
  dialect: "postgres",
  dialectOptions: {},
  // dialectOptions: {
  //   ssl: {
  //     require: true, // This will help you. But you will see nwe error
  //     rejectUnauthorized: false // This line will fix new error
  //   }
  // },
});