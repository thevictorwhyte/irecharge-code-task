DROP DATABASE IF EXISTS whyte_irecharge_task;
CREATE DATABASE whyte_irecharge_task;

DROP TABLE IF EXISTS whyte_irecharge_task.customers;
DROP TABLE IF EXISTS whyte_irecharge_task.payments;

CREATE TABLE whyte_irecharge_task.customers (
  customerId INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  createTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  firstName VARCHAR(255) NOT NULL,
  middleName VARCHAR(255),
  lastName VARCHAR(255),
  city VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  country VARCHAR(32) NOT NULL,
  zipcode INT NOT NULL,
  UNIQUE (email),
  PRIMARY KEY(customerId)
);

CREATE TABLE whyte_irecharge_task.payments (
  paymentId INT NOT NULL AUTO_INCREMENT,
  customerId INT NOT NULL,
  createTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  amount FLOAT(0) NOT NULL,
  PRIMARY KEY(paymentId),
  FOREIGN KEY (customerId) REFERENCES whyte_irecharge_task.customers(customerId)
);