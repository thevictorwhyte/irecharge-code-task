const Flutterwave = require('flutterwave-node-v3');
require('dotenv').config();
const { REDIRECT_URL, TEST_OTP, TEST_PIN } = require("../constants"); 
const { generateTxRef } = require("../utils/helperFunctions.js")

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

/**
 * Function accepts the customer information and card details,
 * charges the card and if no authorization or authentication
 * is needed, it verifies the transaction.
 * 
 * @param {customer}      Details of the customer 
 * @param {cardDetails}   Card details 
 * 
 * @returns {Object}
 */
const fwChargeCard = async (customer, cardDetails) => {
	const { nameOnCard, cardNumber, expiryMonth, expiryYear, cvv, amount, currency, pin } = cardDetails;
	const { email, firstName, lastName } = customer;
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
		enckey: process.env.FLW_ENCRYPTION_KEY,
		authorization: {
			mode: "pin",
			pin: pin || TEST_PIN
		}
	}
	// Initiate charge to card
	const response = await flw.Charge.card(payload);
	switch(response?.data?.status) {
		case "successful": {
			// verify payment
			const verificationResponse = await flw.Transaction.verify({ id: response.data.id })
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
			return {
				status: "failed",
				message: "Additional authentication or authorization needed"
			}
		}
		default: {
			 // if there is an authorization object then further authentication is needed
			 if(response?.meta?.authorization) {
			 	return {
			 		status: "failed",
			 		message: "Additional authentication or authorization needed"
			 	}
			 }
			return {...response}
		}
	}
}

module.exports = {
	fwChargeCard,
};