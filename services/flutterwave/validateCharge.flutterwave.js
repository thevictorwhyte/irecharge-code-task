const flw = require("./main.flutterwave");

const validateCharge = async (ref, otp) => {
	const response = await flw.Charge.validate({
		otp,
		flw_ref: ref
	});
	return response
} 

module.exports = validateCharge