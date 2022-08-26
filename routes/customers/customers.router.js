const express = require("express");

const { httpAllCustomers, httpAddNewCustomer, httpChargeCustomerCard } = require("./customers.controller");

const paymentsRouter = express.Router();

paymentsRouter.get("/", httpAllCustomers);
paymentsRouter.post("/", httpAddNewCustomer);
paymentsRouter.post("/:customerId/charge", httpChargeCustomerCard)

module.exports = paymentsRouter;