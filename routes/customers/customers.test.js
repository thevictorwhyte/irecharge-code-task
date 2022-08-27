const request = require("supertest");
const {faker} = require("@faker-js/faker")
require('dotenv').config();
const { mysqlConnect, mysqlDisconnect } = require("../../services/mysql")
const app = require("../../app");

describe("Launches API", () => {
	beforeAll(() => {
		jest.setTimeout(30000);
		mysqlConnect();
	});
	afterAll(() => {
		mysqlDisconnect();
	});
	describe("Test POST /v1/customers to create new customers", () => {
		const completedCustomerData = {
		    email: faker.internet.email(),
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
		test("it should respond with 400 bad request", async () => {
			const response = await request(app)
			.post("/v1/customers")
			.send(missingRequiredCustomerData)
			.expect("Content-Type", /json/)
			.expect(400);
		});
	});

	describe("Test POST /v1/customers/:customer_id/charge to charge customer card", () => {
		const completedCardInfo = {
			nameOnCard: "Victor Whyte",
			cardNumber: "5061460410120223210",
			expiryMonth: "12",
			expiryYear: "31",
			cvv: "780",
			amount: "7500",
			currency: "NGN",
			tx_ref: "ms_1212"
		};

		const missingRequiredCardInfo = {
		    nameOnCard: "Victor Whyte",
		    expiryMonth: "12",
		    expiryYear: "31",
		    cvv: "780",
		    amount: "7500",
		    currency: "NGN",
		    tx_ref: faker.word.adjective()
		}

		test("it should respond with 200 OK", async () => {
			const response = await request(app)
			.post("/v1/customers/1/charge")
			.send(completedCardInfo)
			.expect("Content-Type", /json/)
			.expect(200);
		});
		test("it should respond with 400 bad request", async () => {
			const response = await request(app)
			.post("/v1/customers/1/charge")
			.send(missingRequiredCardInfo)
			.expect("Content-Type", /json/)
			.expect(400);
		});
	});
});


