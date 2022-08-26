const { getAllCustomers, createNewCustomer, getCustomer } = require("../../models/customers.model");
const AppError = require("../../utils/AppError");
const { fwChargeCard, fwValidateCharge } = require("../../services/flutterwave.js");
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
		// throw error if one or more required detail is missing
		if (!nameOnCard || !cardNumber || !expiryMonth || !expiryYear || !cvv || !amount || !tx_ref) {
			next(new AppError("Missing charge details, please complete all required fields", 401))
		}
		const chargeDetails = {
			nameOnCard, cardNumber, expiryMonth, expiryYear, cvv, amount, currency, tx_ref
		};
		const customer = await getCustomer(req.params.customerId);
		// charge card
		const chargeResponse = await fwChargeCard(customer, chargeDetails);
		if (chargeResponse.status === "error") {
			next(new AppError(chargeResponse.message, 401))
		}
		// validate card
		const validateResponse = await fwValidateCharge(chargeResponse.ref);
		const { data: { charged_amount, created_at, flw_ref, card: { last_4digits } }} = validateResponse;
		// add payment record to db
		if (validateResponse.data.status === "successful") {
			var newPaymentId = await addNewPayment(
				req.params.customerId, 
				charged_amount, 
				last_4digits, 
				currency, 
				chargeResponse.ref
			);
		}
		res.status(200).json({
			status: "success",
			payment: {
				paymentId: newPaymentId,
				customerId: Number(req.params.customerId),
				createTime: created_at,
				amount: charged_amount,
				cardLast4Digits: last_4digits,
				currency,
				ref: chargeResponse.ref
			}
		})
	} catch(err) {
		next(new AppError(err, 500));
	}

}

module.exports = {
	httpAllCustomers,
	httpAddNewCustomer,
	httpChargeCustomerCard
}