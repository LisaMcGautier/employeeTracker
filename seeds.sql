-- SQL QUERIES TO INITIALIZE THE DATA; INSERTS DATA IN THE DATABASE --
USE EMPLOYEE_TRACKER;

INSERT INTO department (name)
VALUES ("Accounting");
INSERT INTO department (name)
VALUES ("Human Resources");


INSERT INTO role (title, salary, department_id)
VALUES ("Lead Accountant", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 75000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("HR Manager", 80000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("HR Coordinator", 600000, 2);


INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Mickey", "Mouse", 1);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Donald", "Duck", 2);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Roger", "Rabbit", 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Minnie", "Mouse", 3);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Jessica", "Rabbit", 4);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Daisy", "Duck", 4);

-- ### Alternative way to insert more than one row
-- INSERT INTO employee (first_name, last_name)
-- VALUES ("Lisa", "Gautier"), ("Roger", "Rabbit"), ("Happy", "Madison");

-- INSERT INTO employee (first_name, last_name) VALUES ("Luke", "Skywalker"), ("Han", "Solo"), ("Harry", "Potter"); --