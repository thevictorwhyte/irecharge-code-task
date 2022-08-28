const { REDIRECT_URL, TEST_OTP, TEST_PIN } = require("../../constants"); 
const { generateTxRef } = require("../../utils/helperFunctions.js")
const initiateCharge = require("./initiateCharge.flutterwave")
const authorizeCharge = require("./authorizeCharge.flutterwave")
const verifyPayment = require("./verifyPayment.flutterwave")
const fwHandleOtp = require("./otp.flutterwave.js")

/**
 * Function handles charging the customers account.
 * It accepts the customer information and card details,
 * charges the card if no OTP or redirect is needed. 
 * If OTP is needed, it returns back the ref used to authorize
 * the charge with the otp route.
 * 
 * @param {customer}      Details of the customer 
 * @param {cardDetails}   Card details 
 * 
 * @returns {Object}
 */
const fwChargeCard = async (customer, cardDetails) => {
	const { nameOnCard, cardNumber, expiryMonth, expiryYear, cvv, amount, currency, pin } = cardDetails;
	const { email, firstName, lastName, city, address, state, country, zipcode } = customer;
	// Structure payload
	const payload = {
		card_number: cardNumber,
		cvv: cvv,
		expiry_month: expiryMonth,
		expiry_year: expiryYear,
		currency: currency || "NGN",
		amount: amount,
		email: email,
		fullname: nameOnCard || `${firstName} ${lastName}`,
		tx_ref: generateTxRef(),
		redirect_url: REDIRECT_URL,
		enckey: process.env.FLW_ENCRYPTION_KEY
	}
	// Initiate charge to card
	const response = await initiateCharge(payload);
	if(response.status === "error" || response.status === "failed") return response;
	
	// authorize the charge
	const authorizationResponse = await authorizeCharge(
		response, 
		payload, 
		pin, 
		city, 
		address, 
		country, 
		state, 
		zipcode
	);
	if(authorizationResponse.status === "failed" || authorizationResponse.status === "error") return authorizationResponse;
	
	switch(authorizationResponse?.data?.status) {
		case "successful": {
			// no need for OTP or redirect verification. Verify payment
			const verificationResponse = await verifyPayment(authorizationResponse.data.id)
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
		case "pending": {
			// check if it is required authorization mode is an OTP
			const { data: {flw_ref }} = authorizationResponse
			if(authorizationResponse.meta.authorization.mode === "otp") {
				if(process.env.NODE_ENV === "development") {
					return await fwHandleOtp(flw_ref, TEST_OTP)
				}
				return {
					status: "pending",
					message: "An otp has been sent to your mobile phone",
					ref: flw_ref
				}
			}

			return {
				status: "failed",
				message: "Requires redirect authentication"
			}
		}
		default: {
			return {...response}
		}
	}
	
}

module.exports = fwChargeCard