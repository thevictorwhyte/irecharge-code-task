const request = require("supertest");
require('dotenv').config();
const { mysqlConnect, mysqlDisconnect } = require("../../services/mysql")
const app = require("../../app");
const { generateUniqueEmailForTest } = require("../../utils/helperFunctions.js")

jest.useRealTimers();

describe("Launches API", () => {
	beforeAll(() => {
		mysqlConnect();
	});
	afterAll(() => {
		mysqlDisconnect();
	});
	describe("Test POST /v1/customers to create new customers", () => {
		const completedCustomerData = {
		    email: generateUniqueEmailForTest(),
		    firstName: "test",
		    lastName: "test",
		    city: "Port Harcourt",
		    address: "33 Victoria Street",
		    state: "Rivers",
		    country: "NG",
		    zipcode: 110001
		};

		const missingRequiredCustomerData = {
		    firstName: "test",
		    lastName: "test",
		    city: "Port Harcourt",
		    address: "33 Victoria Street",
		    state: "Rivers",
		    country: "NG",
		    zipcode: 110001
		}
		test("it should respond with 201 created", async () => {
			const response = await request(app)
			.post("/v1/customers")
			.send(completedCustomerData)
			.expect("Content-Type", /json/)
			.expect(201);
		});
		test("it should respond with 400 bad request from missing required data", async () => {
			const response = await request(app)
			.post("/v1/customers")
			.send(missingRequiredCustomerData)
			.expect("Content-Type", /json/)
			.expect(400);
		});
	});

	describe("Test POST /v1/customers/:customer_id/charge to charge customer card", () => {
		const successfulCardInfo = {
			nameOnCard: "Victor Whyte",
			cardNumber: "5061460166976054667",
			expiryMonth: "10",
			expiryYear: "22",
			cvv: "470",
			amount: "7500",
			currency: "NGN",
			pin: "3310"
		};

		const missingRequiredCardInfo = {
		    nameOnCard: "Victor Whyte",
		    expiryMonth: "12",
		    expiryYear: "31",
		    cvv: "780",
		    amount: "7500",
		    currency: "NGN",
			pin: "3310"
		}

		test("it should charge card and respond with 200 OK", async () => {
			const response = await request(app)
			.post("/v1/customers/1/charge")
			.send(successfulCardInfo)
			.expect("Content-Type", /json/)
			.expect(200);
		}, 30000);
		test("it should respond with 400 bad request from missing card data", async () => {
			const response = await request(app)
			.post("/v1/customers/1/charge")
			.send(missingRequiredCardInfo)
			.expect("Content-Type", /json/)
			.expect(400);
		});
	});
});


