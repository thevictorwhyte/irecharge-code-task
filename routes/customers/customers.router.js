const express = require("express");

const { 
	httpAllCustomers, 
	httpAddNewCustomer, 
	httpChargeCustomerCard,
	httpGetCustomer
} = require("./customers.controller");

const paymentsRouter = express.Router();

paymentsRouter.get("/", httpAllCustomers);
paymentsRouter.post("/", httpAddNewCustomer);
paymentsRouter.get("/:customerId", httpGetCustomer)
paymentsRouter.post("/:customerId/charge", httpChargeCustomerCard)

module.exports = paymentsRouter;