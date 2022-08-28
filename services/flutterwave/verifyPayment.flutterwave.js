const flw = require("./main.flutterwave");
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

module.exports = verifyPayment;