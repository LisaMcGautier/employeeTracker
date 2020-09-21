--SQL CODE FOR CREATING DATABASE, TABLES, RELATIONSHIPS, CONSTRAINTS ETC--

-- Drops the EMPLOYEE_TRACKER database if it exists currently --
DROP DATABASE IF EXISTS EMPLOYEE_TRACKER;

-- Creates the EMPLOYEE_TRACKER database --
CREATE DATABASE EMPLOYEE_TRACKER;

USE EMPLOYEE_TRACKER;

-- Creates the department table --
CREATE TABLE IF NOT EXISTS `department` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(30) NULL,
  PRIMARY KEY (`id`));

-- Creates the role table --
CREATE TABLE IF NOT EXISTS `role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(30) NOT NULL,
  `salary` DECIMAL NOT NULL,
  `department_id` INT NOT NULL,
  PRIMARY KEY (`id`),

  INDEX `fk_role_department1_idx` (`department_id` ASC) VISIBLE,
  CONSTRAINT `fk_role_department1`

    FOREIGN KEY (`department_id`)
    REFERENCES `department` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- Creates the employee table --    
CREATE TABLE IF NOT EXISTS `employee` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(30) NOT NULL,
  `last_name` VARCHAR(30) NOT NULL,
  `role_id` INT NOT NULL,
  `manager_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_employee_role_idx` (`role_id` ASC) VISIBLE,

  INDEX `fk_employee_employee1_idx` (`manager_id` ASC) VISIBLE,
  CONSTRAINT `fk_employee_role`
    FOREIGN KEY (`role_id`)
    REFERENCES `role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    
  CONSTRAINT `fk_employee_employee1`
    FOREIGN KEY (`manager_id`)
    REFERENCES `employee` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);