const flw = require("./main.flutterwave");
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

module.exports = initiateCharge