import { Sequelize } from "sequelize";
require("dotenv").config();

const sequelize = new Sequelize(
	process.env.MYSQL_DATABASE || "",
	process.env.MYSQL_USER || "",
	process.env.MYSQL_PASSWORD || "",
	{
		host: "localhost",
		port: 3306,
		dialect: "mysql",
	}
);

async function testConnection() {
	try {
		await sequelize.authenticate();
		console.log("Database connection has been established successfully.");
	} catch (error: any) {
		console.error("Unable to connect to the database:", error.message);
	}
}

export { sequelize, testConnection };
