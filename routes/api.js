const express = require("express");

const customersRouter = require("./customers/customers.router");
const paymentsRouter = require("./payments/payments.router");

const api = express.Router();

api.use("/customers", customersRouter);
api.use("/payments", paymentsRouter);

module.exports = api;