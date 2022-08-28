const Flutterwave = require('flutterwave-node-v3');
require('dotenv').config();
const { REDIRECT_URL, TEST_OTP, TEST_PIN } = require("../constants"); 
const { generateTxRef } = require("../utils/helperFunctions.js")

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

/**
 * STEP ONE
 * This function charges the card to typically know the authorization mode.
 * Which could be either pin, avs_noauth or redirect.
 * 
 * @param {payload}  User and card information to charge to.
 *  
 * @returns {Object}
 */
const initiateCharge = async (payload) => {
	return await flw.Charge.card(payload);
}

/**
 * STEP TWO
 * Function accepts the customer information, card details 
 * as well as the same payload used in step one.
 * Based on the authorization mode (pin, avs or redirect) 
 * it authorizes charge with card pin or user info only and 
 * returns a message with failed status if the mode is redirect.
 * 
 * @param {response}  This will typically be the response object from the initiate transaction step
 * @param {payload}   Same payload used to initiate charge
 * @param {pin}   	  Card pin. Defaults to 3310 which is the test pin. 
 * @param {city}   	  Customer city
 * @param {address}   Customer address 
 * @param {country}   Customer country 
 * @param {state}     Customer state 
 * @param {zipcode}   Customer zipcode 
 *  
 * 
 * @returns {Object}
 */
const authorizeCharge = async (response, payload, pin, city, address, country, state, zipcode) => {
	switch(response?.meta?.authorization?.mode) {
		case "pin": {
			payload["authorization"] = {
				mode: "pin",
				pin: pin || TEST_PIN
			}
			return await flw.Charge.card(payload);
		}
		case "avs_noauth": {
			payload["authorization"] = {
				mode: "avs_noauth",
				city,
				address,
				state,
				country,
				zipcode
			}
			return await flw.Charge.card(payload);
		}
		case "redirect": {
			return {
				status: "failed",
				message: "Additional verification is needed."
			}
		}
		default: {
			return {
				...response
			}
		}
	}
}

/**
 * STEP THREE
 * Function the response from the authorization step 
 * and if it was successful, it verifies the payment
 * if the status is pending then it requires otp or redirect
 * validation and returns a response with status failed.
 * 
 * @param {response}  This will typically be the response object from the authorize step
 *  
 * 
 * @returns {Object}
 */
const verifyPayment = async (response) => {
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
			 } else {
			 	return {...response}
			 }
			
		}
	}
}

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

module.exports = {
	fwChargeCard,
};