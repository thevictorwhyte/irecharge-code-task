const { REDIRECT_URL, TEST_OTP, TEST_PIN } = require("../../constants"); 
const { generateTxRef } = require("../../utils/helperFunctions.js")
const initiateCharge = require("./initiateCharge.flutterwave")
const authorizeCharge = require("./authorizeCharge.flutterwave")
const verifyPayment = require("./verifyPayment.flutterwave")
/**
 * Function accepts the customer information and card details,
 * charges the card and if and authorizes with card pin or user info
 * and if no additional otp or redirect authentication is needed, 
 * it verifies the transaction.
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
			// verify payment
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
			if(authorizationResponse.meta.authorization.mode === "otp") {
				return {
					status: "pending",
					message: "An otp has been sent to your mobile phone",
					ref: authorizationResponse.data.flw_ref
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