const express = require("express");

const { httpGetCustomerPayments, httpHandleOtp } = require("./payments.controller")

const paymentsRouter = express.Router();

paymentsRouter.get("/:customerId", httpGetCustomerPayments);
paymentsRouter.post("/otp", httpHandleOtp);

module.exports = paymentsRouter;