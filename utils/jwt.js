const jwt = require("jsonwebtoken");
const config = require("../config/app-config");

const jwtHead = {
  algorithm: "HS256",
  expiresIn: "7d",
};

exports.generateJWT = (payload) => {
  try {
    let token = jwt.sign(payload, config.KEY, jwtHead);
    return { token };
  } catch (err) {
    console.log(err);
    return { err };
  }
};

exports.validateJWT = (token) => {
  try {
    const payload = jwt.verify(token, config.KEY);
    return payload;
  } catch (err) {
    console.log(err);
    return false;
  }
};
