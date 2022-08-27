const express = require("express");

const { 
	httpAllCustomers, 
	httpAddNewCustomer, 
	httpChargeCustomerCard,
	httpGetCustomer,
	httpGetPaymentsByCustomer
} = require("./customers.controller");

const paymentsRouter = express.Router();

paymentsRouter.get("/", httpAllCustomers);
paymentsRouter.post("/", httpAddNewCustomer);
paymentsRouter.get("/:customerId", httpGetCustomer);
paymentsRouter.post("/:customerId/charge", httpChargeCustomerCard);
paymentsRouter.get("/:customerId/payments", httpGetPaymentsByCustomer);

module.exports = paymentsRouter;