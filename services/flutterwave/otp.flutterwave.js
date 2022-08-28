const validateCharge = require("./validateCharge.flutterwave");
const verifyPayment = require("./verifyPayment.flutterwave.js");

const fwHandleOtp = async (ref, otp) => {
	const validationResponse = await validateCharge(ref, otp);
	if(validationResponse.status === "error" || validationResponse.status === "failed") return validationResponse
	switch(validationResponse?.data?.status) {
		case "successful": {
			// verify payment
			const verificationResponse = await verifyPayment(validationResponse.data.id)
			const {  data: { charged_amount, currency, created_at, flw_ref, card: { last_4digits } }} = verificationResponse;
			return {
				status: "success",
				data: {
					charged_amount,
					created_at,
					flw_ref,
					last_4digits,
					currency
				}
			}
		}
		default: {
			return {...validationResponse}
		}
	}
}

module.exports = fwHandleOtp;