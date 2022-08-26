const express = require("express");

const { httpAllCustomers } = require("./customers.controller");

const paymentsRouter = express.Router();

paymentsRouter.get("/", httpAllCustomers);

module.exports = paymentsRouter;