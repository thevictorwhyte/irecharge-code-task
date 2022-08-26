const connection = require("./db.js");
const AppError = require("../utils/AppError")

const getAllCustomers = async () => {
	const customers = await connection.promise().query({
		sql: 'SELECT * FROM whyte_irecharge_task.customers;'
	});
	return customers[0];
}

const createNewCustomer = async (
									email, 
									firstName, 
									middleName,
									lastName, 
									city, 
									address, 
									state, 
									country, 
									zipcode
								) => {
	const newCustomer = await connection.promise().query({
		sql: 'INSERT INTO whyte_irecharge_task.customers (email, firstName, middleName, lastName, city, address, state, country, zipcode) VALUES(?)',
		values: [[email, firstName, middleName, lastName, city, address, state, country, zipcode]]
	});
	return newCustomer[0].insertId;
}

const getCustomer = async (customerId) => {
	const customer = await connection.promise().query({
		sql: `SELECT email, firstName, lastName FROM whyte_irecharge_task.customers WHERE customerId = ${customerId};`
	});
	return customer[0][0];
}

module.exports = {
	getAllCustomers,
	createNewCustomer,
	getCustomer
}