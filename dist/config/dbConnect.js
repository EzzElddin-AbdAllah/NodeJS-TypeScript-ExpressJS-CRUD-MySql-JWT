"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
require("dotenv").config();
const sequelize = new sequelize_1.Sequelize(process.env.MYSQL_DATABASE || "", process.env.MYSQL_USER || "", process.env.MYSQL_PASSWORD || "", {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
});
exports.sequelize = sequelize;
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log("Database connection has been established successfully.");
    }
    catch (error) {
        console.error("Unable to connect to the database:", error.message);
    }
}
exports.testConnection = testConnection;
