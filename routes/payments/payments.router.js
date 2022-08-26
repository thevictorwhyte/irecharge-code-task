const express = require("express");

const { httpGetPaymentsForCustomer } = require("./payments.controller")

const paymentsRouter = express.Router();

paymentsRouter.get(`/${customerId}`, httpGetPaymentsForCustomer);

module.exports = paymentsRouter;