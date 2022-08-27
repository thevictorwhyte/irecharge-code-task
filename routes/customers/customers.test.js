const request = require("supertest");
const server = require("../../server");

describe("Test POST /v1/customers to create new customers", () => {
	const completedCustomerData = {
	    "email": "test@gmail.com",
	    "firstName": "test",
	    "lastName": "test",
	    "city": "Port Harcourt",
	    "address": "33 Victoria Street",
	    "state": "Rivers",
	    "country": "NG",
	    "zipcode": "110001"
	};

	const missingRequiredCustomerData = {
	    "firstName": "test",
	    "lastName": "test",
	    "city": "Port Harcourt",
	    "address": "33 Victoria Street",
	    "state": "Rivers",
	    "country": "NG",
	    "zipcode": "110001"
	}
	test("it should respond with 201 created", async () => {
		const response = await request(server)
		.post("v1/customers", completedCustomerData)
		.expect("Content-Type", /json/)
		.expect(200);
	});
	test("it should respond with 401 bad request", async () => {
		const response = await request(server)
		.post("v1/customers", missingCustomerData)
		.expect("Content-Type", /json/)
		.expect(401);
	});
});

describe("Test POST /v1/customers/:customer_id/charge to charge customer card", () => {
	const completedCardInfo = {
		"nameOnCard": "Victor Whyte",
		"cardNumber": "5061460410120223210",
		"expiryMonth": "12",
		"expiryYear": "31",
		"cvv": "780",
		"amount": "7500",
		"currency": "NGN",
		"tx_ref": "MS_1422"
	};

	const missingRequiredCardInfo = {
	    "nameOnCard": "Victor Whyte",
	    "expiryMonth": "12",
	    "expiryYear": "31",
	    "cvv": "780",
	    "amount": "7500",
	    "currency": "NGN",
	    "tx_ref": "MS_1422"
	}

	test("it should respond with 200 OK", async () => {
		const response = await request(server)
		.post("v1/customers/1/charge", completedCardInfo)
		.expect("Content-Type", /json/)
		.expect(200);
	});
	test("it should respond with 401 bad request", async () => {
		const response = await request(server)
		.post("v1/customers/1/charge", missingRequiredCardInfo)
		.expect("Content-Type", /json/)
		.expect(401);
	});
});
