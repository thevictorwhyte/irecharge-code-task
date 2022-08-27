const { connection } = require("../services/mysql");
const AppError = require("../utils/AppError")

const getAllCustomers = async () => {
	const customers = await connection.promise().query({
		sql: 'SELECT * FROM customers;'
	});
	return customers[0];
}

const createNewCustomer = async (
	email, 
	firstName, 
	middleName = null,
	lastName, 
	city, 
	address, 
	state, 
	country, 
	zipcode
) => {
	const newCustomer = await connection.promise().query({
		sql: 'INSERT INTO customers (email, firstName, middleName, lastName, city, address, state, country, zipcode) VALUES(?)',
		values: [[email, firstName, middleName, lastName, city, address, state, country, zipcode]]
	});
	return newCustomer[0].insertId;
}

const getCustomer = async (customerId) => {
	const customer = await connection.promise().query({
		sql: `SELECT * 
				FROM customers 
				WHERE customerId = ${customerId};`,
	});
	return customer[0][0];
};

const getCustomerPayments = async (customerId) => {
	const payments = await connection.promise().query({
		sql: `SELECT * 
				FROM payments 
				WHERE customerId = ${customerId};`,
	});
	return payments[0];
}

const doesCustomerExist = async (customerId) => {
	const isFound = await connection.promise().query({
		sql: `SELECT customerId
				FROM customers
				WHERE EXISTS
				(SELECT customerId FROM customers WHERE customerId = ${customerId});`
	});
	return isFound[0].length > 0;
}

module.exports = {
	getAllCustomers,
	createNewCustomer,
	getCustomer,
	getCustomerPayments,
	doesCustomerExist
}