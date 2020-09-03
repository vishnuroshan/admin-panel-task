const userController = {};
const jwt = require("../utils/jwt");
const User = require("../models/users");
const passwordGen = require("password-generator");

userController.get = (id) =>
  new Promise((resolve, reject) => {
    User.findById(id).then(
      (details) => {
        return resolve(details);
      },
      (err) => {
        console.log(err);
        reject({ status: 500, err });
      }
    );
  });

userController.listEmployees = (user) =>
  new Promise((resolve, reject) => {
    if (user && user._id && user.isAdmin === true) {
      User.findByAdmin(user._id).then(
        (employees) => {
          return resolve({ status: 200, employees });
        },
        (err) => reject({ status: 500, err })
      );
    }
  });

userController.addEmployee = (newEmployee, user) =>
  new Promise((resolve, reject) => {
    if (!newEmployee.password) newEmployee.password = passwordGen(8);

    // if not admin. cannot create employee
    if (user && user._id && user.isAdmin === true) {
      newEmployee.addedBy = user._id;
      User.create(newEmployee).then(
        (user) => {
          const token = jwt.generateJWT({
            email: user.email,
            user_id: user._id,
            isAdmin: false,
          });

          return resolve({
            _id: user._id,
            createdAt: user.createdAt,
            email: user.email,
            password: newEmployee.password,
          });
        },
        (err) => {
          if (err.code === 11000)
            return reject({
              status: 400,
              error: "must be unique",
              field: err.keyValue,
            });
          else return reject({ status: 500, error: err });
        }
      );
    } else {
      return { status: 401, error: "access to resource unauthorized" };
    }
  });

module.exports = userController;
