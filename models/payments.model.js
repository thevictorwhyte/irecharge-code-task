const connection = require("./db.js");
const AppError = require("../utils/AppError")

const addNewPayment = async (customerId, amount, cardLast4Digits, currency, ref) => {
	const newPayment = await connection.promise().query({
		sql: 'INSERT INTO whyte_irecharge_task.payments (customerId, amount, cardLast4Digits, currency, ref) VALUES(?)',
		values: [[customerId, amount, cardLast4Digits, currency, ref]]
	})

	return newPayment[0].insertId;
};

module.exports = {
	addNewPayment
}