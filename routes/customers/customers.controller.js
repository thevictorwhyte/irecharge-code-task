const { getAllCustomers } = require("../../models/customers.model");

const httpAllCustomers = async (req, res, next) => {
	const data = getAllCustomers(next);
	res.status(200).json({
		status: "success",
		length: data?.length,
		data: data
	})
}