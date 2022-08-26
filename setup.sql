DROP DATABASE IF EXISTS whyte_irecharge_task;
CREATE DATABASE whyte_irecharge_task;

DROP TABLE IF EXISTS whyte_irecharge_task.customers;
DROP TABLE IF EXISTS whyte_irecharge_task.payments;

CREATE TABLE whyte_irecharge_task.customers (
  customerId INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  createTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255),
  userName VARCHAR(36) NOT NULL,
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