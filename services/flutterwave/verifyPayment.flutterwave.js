const flw = require("./main.flutterwave");
/**
 * STEP THREE
 * Function the response from the authorization or validation step 
 * and if it was successful, it verifies the payment
 * if the status is pending then it requires otp or redirect
 * validation and returns a response with status failed.
 * 
 * @param {response}  This will typically be the response object from the authorize or validate step
 *  
 * 
 * @returns {Object}
 */
const verifyPayment = async (transactionId) => {
	const verificationResponse = await flw.Transaction.verify({ id: transactionId })
	return verificationResponse;
}

module.exports = verifyPayment;