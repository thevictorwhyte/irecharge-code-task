Charge my card
----

## Introduction
Charge my card is a RESTful API service to charge a customer's card using a third party payement gateway (Flutterwave) to process payments

## Overview
The faetures of this service includes:
* Create a new customer
* Charge customer card using Flutterwave
* Store details of the payments
* Retrieve payments done by customers

## Tech Stack (Dependencies)
* **Node** as the javascript runtime engine of choice.
* **Express** as the famework used to build out the API service.
* **MySQL** as the database of choice.

## Main Files: Project Structure

  ```sh
  ├── setup.sql
  ├── server.js 
  ├── README.md
  ├── package.json
  ├── package-lock.json
  ├── constants.js
  ├── gitignore
  ├── utils
  │   ├── appError.js 
  │   ├── errorHandler.js
  ├── routes
  │   ├── api.js
  └── customers
  |   ├── customers.controller.js
  |   ├── customers.router.js
  └── payments
  |   ├── payments.controller.js
  |   ├── payments.router.js
  ├── models
  │   ├── customers.model.js 
  │   ├── db.js
  │   ├── payments.model.js

  ```