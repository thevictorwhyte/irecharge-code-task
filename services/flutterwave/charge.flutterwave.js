const { REDIRECT_URL, TEST_OTP, TEST_PIN } = require("../../constants"); 
const { generateTxRef } = require("../../utils/helperFunctions.js")
const initiateCharge = require("./initiateCharge.flutterwave")
const authorizeCharge = require("./authorizeCharge.flutterwave")
const verifyPayment = require("./verifyPayment.flutterwave")
/**
 * MAIN
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
	if(response.status === "error") return response;
	
	// authorize the charge
	const authorizationResponse = await authorizeCharge(response, payload, pin, city, address, country, state, zipcode);
	if(authorizationResponse.status === "error") return authorizationResponse
	// verify payment
	const verificationResponse = await verifyPayment(authorizationResponse);
	return verificationResponse;
	
}

module.exports = fwChargeCard