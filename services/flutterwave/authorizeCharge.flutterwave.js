const flw = require("./main.flutterwave");
/**
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
				message: "Requires redirect authentication"
			}
		}
		default: {
			return {
				...response
			}
		}
	}
}

module.exports = authorizeCharge