iRecharge code task
----

## Introduction
iRecharge code task is a RESTful API service to charge a customer's card using a third party payement gateway (Flutterwave) to process payments

## Documentation
Please visit the [Official Postman documentation](https://documenter.getpostman.com/view/10703028/VUr1HtAY) for the API.

## Overview
The faetures of this service includes:
* Create a new customer
* Charge customer card using Flutterwave
* Store details of the payments
* Retrieve payments done by customers

## Prerequisite
For you to run this project on your local computer, ensure you have install and setup the following:
* [**Node**](https://nodejs.org/en/) as the javascript runtime engine of choice.
* [**MySQL**](https://www.mysql.com/downloads/) as the database of choice.

## Main Files: Project Structure
  ```sh
  ├── setup.sql
  ├── server.js 
  ├── README.md
  ├── package.json
  ├── package-lock.json
  ├── constants.js
  ├── app.js
  ├── .gitignore
  ├── utils
  │   ├── appError.js 
  │   ├── errorHandler.js
  │   ├── helperFunctions.js
  ├── services
  │   ├── flutterwave.js 
  │   ├── mysql.js
  ├── routes
  │   ├── api.js
  └── customers
  │    ├── customers.controller.js
  │    ├── customers.router.js
  │    ├── customers.test.js
  ├── payments
  │    ├── payments.controller.js
  │    ├── payments.router.js
  ├── models
     ├── customers.model.js 
     ├── payments.model.js
  ```

## Development Setup
1. Clone the repo, change into the directory and install packages using npm.
```
git clone https://github.com/thevictorwhyte/irecharge-code-task.git
cd irecharge-code-task
npm install
```

2. Run the setup SQL script in your bash terminal. This runs the necessary command to create a database and the all the needed tables in that database.
```
mysql --user=[your_db_username] --password=[your_db_user_password] < setup.sql
```
Replace [your_db_username] with your mysql user account name, and [your_db_user_password] with your account password.

3. Create a `.env` file at the root of the folder and fill in the following.
```
DB_USER=[your_db_username]
DB_PASSWORD=[your_db_user_password]
FLW_PUBLIC_KEY=[your flutterwave public key]
FLW_SECRET_KEY=[your flutterwave secret key]
FLW_ENCRYPTION_KEY=[your flutterwave encryption key]
PORT=3000
NODE_ENV=development
```

4. Start the server.
```
npm run dev

<!-- Server will start running by default of port 3000 -->
```


### [Go to documentation](https://documenter.getpostman.com/view/10703028/VUr1HtAY) 