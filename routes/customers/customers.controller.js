const { getAllCustomers, createNewCustomer } = require("../../models/customers.model");
const AppError = require("../../utils/AppError");

const httpAllCustomers = async (req, res, next) => {
	try {
		const data = await getAllCustomers(next);
		res.status(200).json({
			status: "success",
			length: data?.length,
			data: data
		})
	} catch(err) {
		next(new AppError(err, 500));
	}
	
}

const httpAddNewCustomer = async (req, res, next) => {
	try {
		const { email, firstName, lastName } = req.body;

		const newCustomerId = await createNewCustomer(email, firstName, lastName);
		res.status(201).json({
			status: "success",
			customer: {
				customerId: newCustomerId,
				email,
				firstName,
				lastName
			}
		})
	} catch(err) {
		next(new AppError("Error occured adding new user", 500));
	}
	
}

module.exports = {
	httpAllCustomers,
	httpAddNewCustomer
}