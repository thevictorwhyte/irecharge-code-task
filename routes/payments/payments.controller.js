const fwHandleOtp = require("../../services/flutterwave/otp.flutterwave");
const { addNewPayment } = require("../../models/payments.model");
const AppError = require("../../utils/AppError");
const { doesCustomerExist } = require("../../models/customers.model");

const httpGetCustomerPayments = (req, res, next) => {
	return res.status(200).json({
		status: "success",
		data: "Not yet implemented"
	})
}

const httpHandleOtp = async (req, res, next) => {
	try {
		const { ref, otp, customerId } = req.body;
		if (!ref || !otp || !customerId) {
			return next(new AppError("Please provide a reference number, otp and customerId", 400))
		}
		const isCustomerFound = await doesCustomerExist(customerId);
		if(!isCustomerFound) {
			return next(new AppError("No customer found with that id", 404));
		}
		const response = await fwHandleOtp(ref, otp);
		switch(response?.status) {
			case "success": {
				const { charged_amount, last_4digits, currency, created_at, flw_ref } = response.data
				// add payment record to db
				const newPaymentId = await addNewPayment(
					customerId, 
					charged_amount, 
					last_4digits, 
					currency, 
					flw_ref
				);
				return res.status(200).json({
					status: "success",
					payment: {
						paymentId: newPaymentId,
						customerId: Number(customerId),
						createTime: created_at,
						amount: charged_amount,
						cardLast4Digits: last_4digits,
						currency,
						ref: flw_ref
					}
				})
			}
			default: {
				return res.status(200).json(response);
			}
		}
	} catch(error) {
		next(new AppError(error, 500))
	}
}

module.exports = {
	httpGetCustomerPayments,
	httpHandleOtp
}