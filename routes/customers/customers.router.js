const express = require("express");

const { httpAllCustomers, httpAddNewCustomer } = require("./customers.controller");

const paymentsRouter = express.Router();

paymentsRouter.get("/", httpAllCustomers);
paymentsRouter.post("/", httpAddNewCustomer);

module.exports = paymentsRouter;