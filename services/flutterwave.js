const Flutterwave = require('flutterwave-node-v3');
const { REDIRECT_URL, TEST_OTP, TEST_PIN } = require("../constants"); 

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

const fwChargeCard = async (customer, chargeDetails) => {
	const { nameOnCard, cardNumber, expiryMonth, expiryYear, cvv, amount, currency, tx_ref } = chargeDetails;
	const { email, city, address, state, country, zipcode, firstName, lastName } = customer;
	const payload = {
		card_number: cardNumber,
		cvv: cvv,
		expiry_month: expiryMonth,
		expiry_year: expiryYear,
		currency: currency || "NGN",
		amount: amount,
		email: email,
		fullname: nameOnCard || `${firstName} ${lastName}`,
		tx_ref: tx_ref,
		redirect_url: REDIRECT_URL,
		enckey: process.env.FLW_ENCRYPTION_KEY,
		authorization: {
			mode: "pin",
			pin: TEST_PIN
		}
	}
	const response = await flw.Charge.card(payload);
	return {
		ref: response.data ? response.data.flw_ref : null,
		status: response.status,
		message: response.message
	};
}

const fwValidateCharge = async (flw_ref, otp = TEST_OTP) => {
	const response = await flw.Charge.validate({
		otp,
		flw_ref
	})
	return response;
}

module.exports = {
	fwChargeCard,
	fwValidateCharge
};