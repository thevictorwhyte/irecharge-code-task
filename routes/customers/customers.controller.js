const { getAllCustomers, createNewCustomer, getCustomer } = require("../../models/customers.model");
const AppError = require("../../utils/AppError");
const { fwChargeCard, fwValidateCharge } = require("../../services/flutterwave.js")

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
		const { email, firstName, middleName, lastName, city, address, state, country, zipcode } = req.body;
		const newCustomerId = await createNewCustomer(
										email, 
										firstName, 
										middleName,
										lastName, 
										city, 
										address, 
										state, 
										country, 
										zipcode, 
									);
		res.status(201).json({
			status: "success",
			customer: {
				customerId: newCustomerId,
				...req.body
			}
		})
	} catch(err) {
		next(new AppError(err, 500));
	}
	
}

const httpChargeCustomerCard = async (req, res, next) => {
	try {
		const { nameOnCard, cardNumber, expiryMonth, expiryYear, cvv, amount, currency, tx_ref } = req.body;
		if (!nameOnCard || !cardNumber || !expiryMonth || !expiryYear || !cvv || !amount || !tx_ref) {
			next(new AppError("Missing charge details, please complete all required fields", 401))
		}
		const chargeDetails = {
			nameOnCard, cardNumber, expiryMonth, expiryYear, cvv, amount, currency, tx_ref
		};
		const customer = await getCustomer(req.params.customerId);
		const response = await fwChargeCard(customer, chargeDetails);

		const finalResponse = await fwValidateCharge(response.ref);

		res.status(200).json(finalResponse)
	} catch(err) {
		next(new AppError(err, 500));
	}

}

module.exports = {
	httpAllCustomers,
	httpAddNewCustomer,
	httpChargeCustomerCard
}