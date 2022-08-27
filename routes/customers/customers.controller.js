const { getAllCustomers, 
		createNewCustomer, 
		getCustomer, 
		getCustomerPayments,
		doesCustomerExist
	} = require("../../models/customers.model");
const AppError = require("../../utils/AppError");
const { fwChargeCard } = require("../../services/flutterwave.js");
const { addNewPayment } = require("../../models/payments.model");

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

		// throw error if one or more required detail is missing
		if(!email || !firstName || !lastName || !city || !address || !state || !country || !zipcode) {
			next(new AppError("Missing card details, please complete all required fields", 400))
		}
		
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

const httpGetCustomer = async (req, res, next) => {
	try {
		const customerId = req.params.customerId;
		const customerDetails = await getCustomer(customerId);
		if(!customerDetails) {
			return next(new AppError("No customer found with that ID", 404));
		}
		const paymentsByCustomer = await getCustomerPayments(customerId);
		res.status(200).json({
			status: "success",
			data: {
				...customerDetails,
				payments: {
					length: paymentsByCustomer?.length,
					data: paymentsByCustomer
				}
			}
		})
	} catch(err) {
		next(new AppError(err, 404));
	}
}

const httpGetPaymentsByCustomer = async (req, res, next) => {
	try {
		const customerId = req.params.customerId;
		const isCustomerFound = await doesCustomerExist(customerId);
		if(!isCustomerFound) {
			return next(new AppError("No customer found with that id", 404));
		}
		const payments = await getCustomerPayments(customerId);
		res.status(200).json({
			status: "success",
			length: payments?.length,
			data: payments
		})
	} catch(err) {
		next(new AppError(err, 500));
	}
}



const httpChargeCustomerCard = async (req, res, next) => {
	try {
		const { nameOnCard, cardNumber, expiryMonth, expiryYear, cvv, amount, currency, pin } = req.body;
		// throw error if one or more required detail is missing
		if (!nameOnCard || !cardNumber || !expiryMonth || !expiryYear || !cvv || !amount) {
			next(new AppError("Missing card details, please complete all required fields", 400))
		}
		const cardDetails = {
			nameOnCard, cardNumber, expiryMonth, expiryYear, cvv, amount, currency, pin
		};
		const customer = await getCustomer(req.params.customerId);
		// charge card
		const chargeResponse = await fwChargeCard(customer, cardDetails);

		switch(chargeResponse?.status) {
			case "success": {
				const { charged_amount, last_4digits, currency, created_at, flw_ref } = chargeResponse.data
				// add payment record to db
				const newPaymentId = await addNewPayment(
					req.params.customerId, 
					charged_amount, 
					last_4digits, 
					currency, 
					flw_ref
				);
				res.status(200).json({
					status: "success",
					payment: {
						paymentId: newPaymentId,
						customerId: Number(req.params.customerId),
						createTime: created_at,
						amount: charged_amount,
						cardLast4Digits: last_4digits,
						currency,
						ref: flw_ref
					}
				})
			}
			default: {
				res.status(200).json(chargeResponse);
			}
		}
	} catch(err) {
		next(new AppError(err, 500));
	}
}

module.exports = {
	httpAllCustomers,
	httpAddNewCustomer,
	httpGetCustomer,
	httpChargeCustomerCard,
	httpGetPaymentsByCustomer
}