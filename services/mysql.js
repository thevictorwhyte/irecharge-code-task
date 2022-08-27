const mysql = require("mysql2");

const options = {
	host: "localhost",
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: "whyte_irecharge_task"
}
var connection = mysql.createConnection(options);

function mysqlConnect() {
	// connection = mysql.createConnection(options);
	connection.connect(function(err) {
		if (err) {
		    console.error('error connecting: ' + err.stack);
		    return;
		}

		console.log('connected as id ' + connection.threadId);
	})
}

function mysqlDisconnect() {
	connection.end(function(err) {
		if (err) return console.log("error terminating connection");
		console.log("connection terminated")
	})
}

module.exports = {
	mysqlConnect,
	mysqlDisconnect,
	connection
};