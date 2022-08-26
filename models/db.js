const mysql = require("mysql2");

const connection = mysql.createConnection({
	host: "localhost",
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: "whyte_irecharge_task"
});

module.exports = connection;