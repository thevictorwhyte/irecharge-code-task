const connection = require("./db.js");
const AppError = require("../utils/AppError")

const getAllCustomers = (next) => {
	connection.query({
		sql: 'SELECT * FROM customers;'
	}, (err, results, fields) => {
		if(error) return next(new AppError(err));
		return results
	});
}

module.exports = {
	getAllCustomers
}