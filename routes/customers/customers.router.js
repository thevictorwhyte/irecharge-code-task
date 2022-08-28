const express = require("express");

const { 
	httpAllCustomers, 
	httpAddNewCustomer, 
	httpChargeCustomerCard,
	httpGetCustomer,
	httpGetPaymentsByCustomer
} = require("./customers.controller");

const customersRouter = express.Router();

customersRouter.get("/", httpAllCustomers);
customersRouter.post("/", httpAddNewCustomer);
customersRouter.get("/:customerId", httpGetCustomer);
customersRouter.post("/:customerId/charge", httpChargeCustomerCard);
customersRouter.get("/:customerId/payments", httpGetPaymentsByCustomer);

module.exports = customersRouter;