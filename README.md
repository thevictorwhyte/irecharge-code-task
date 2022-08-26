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
```