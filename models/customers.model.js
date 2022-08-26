const connection = require("./db.js");
const AppError = require("../utils/AppError")

const getAllCustomers = async (next) => {
	const results = await connection.promise().query({
		sql: 'SELECT * FROM whyte_irecharge_task.customers;'
	});
	return results
}

const createNewCustomer = async (email, firstName, lastName) => {
	const newCustomer = await connection.promise().query({
		sql: 'INSERT INTO whyte_irecharge_task.customers (email, firstName, lastName) VALUES(?)',
		values: [[email, firstName, lastName]]
	});
	return newCustomer[0].insertId;
}

module.exports = {
	getAllCustomers,
	createNewCustomer
}