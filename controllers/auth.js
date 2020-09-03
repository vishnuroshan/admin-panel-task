const authController = {};
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwt");

authController.create = async (newUser) =>
  new Promise((resolve, reject) => {
    User.create(newUser).then(
      (user) => {
        const token = jwt.generateJWT({
          email: user.email,
          user_id: user._id,
          isAdmin: user.isAdmin,
        });

        return resolve({
          status: 200,
          _id: user._id,
          createdAt: user.createdAt,
          token,
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
  });

authController.login = async ({ email, password }) =>
  new Promise((resolve, reject) => {
    User.findOne(email).then(
      async (user) => {
        try {
          console.log("1", email);
          const isAuth = await User.checkPass(email, password);
          if (isAuth) {
            const token = jwt.generateJWT({
              email,
              user_id: user._id,
              isAdmin: user.isAdmin,
            });
            console.log("check pass", isAuth, token);
            return resolve({ status: 200, token });
          } else
            return resolve({ status: 400, message: "invalid credentials" });
        } catch (err) {
          return reject({ status: 500, error: err });
        }
      },
      (err) => {
        console.log(err);
        return reject({ status: 500, error: err });
      }
    );
  });

module.exports = authController;
