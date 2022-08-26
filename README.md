iRecharge code task
----

## Introduction
iRecharge code task is a RESTful API service to charge a customer's card using a third party payement gateway (Flutterwave) to process payments

## Overview
The faetures of this service includes:
* Create a new customer
* Charge customer card using Flutterwave
* Store details of the payments
* Retrieve payments done by customers

## Prerequisite
For you to run this project on your local computer, ensure you have install and setup the following:
* **Node** as the javascript runtime engine of choice.
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
  ├   ├── customers.controller.js
  ├   ├── customers.router.js
  ├── payments
  ├   ├── payments.controller.js
  ├   ├── payments.router.js
  ├── models
  ├   ├── customers.model.js 
  ├   ├── db.js
  ├   ├── payments.model.js
  ```

## Development Setup
1. Clone the repo, change into the directory and install packages using npm.
```
git clone https://github.com/thevictorwhyte/irecharge-code-task.git
cd irecharge-code-task
npm install
```

2. Run the setup SQL script. This runs the necessary command to create a database and the necessary tables in that database.
```
mysql --user=[your_db_username] --password=[your_db_user_password] < setup.sql
```

3. Create a `.env` file at the root of the folder and fill in the following.
```
DB_USER=[your_db_username]
DB_PASSWORD=[your_db_user_password]
```

4. Start the server.
```
npm run dev

<!-- Server will start running by default of port 3000 -->
```

## v1 Endpoints Documentation (current release)
Documentation of available API endpoints including the URL, request parameters, and the response body
### `GET '/v1/customers'`
- Fetches all customers.
- Returns a list of customers, status message and number of customers.
- Sample: `curl http://localhost:3000/v1/customers`

```json
{
	"status": "success",
	"length": 1,
	"data": [
	    {
	        "customerId": 1,
	        "email": "victordavidwhyte@gmail.com",
	        "createTime": "2022-08-26T14:26:40.000Z",
	        "firstName": "victor",
	        "lastName": "whyte"
	    }
	]
}
```

### `POST '/v1/customers'`
- Add a new customer.
- Request body:
  - `firstName`: String (required).
  - `lastName`: String (optional)
  - `email`: String (required).
- Returns a list of customers, status message and number of customers.
- Sample: `curl http://localhost:3000/v1/customers`
- Returns:
  - `status`: success or error.
  - `customer`: customer details.

#### Sample request
```json
{
    "email": "victorahyte@gmail.com",
    "firstName": "victor",
    "lastName": "whyte"
}
```

#### Sample response
```json
{
    "status": "success",
    "customer": {
        "customerId": 1,
        "email": "victordavidwhyte@gmail.com",
        "firstName": "victor",
        "lastName": "whyte"
    }
}
```