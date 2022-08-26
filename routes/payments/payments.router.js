const express = require("express");

const { httpGetCustomerPayments } = require("./payments.controller")

const paymentsRouter = express.Router();

paymentsRouter.get("/:customerId", httpGetCustomerPayments);

module.exports = paymentsRouter;