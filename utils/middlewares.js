const jwt = require("./jwt");
const User = require("../models/users");

exports.checkToken = async (request, response, next) => {
  let token = request.headers.authorization;
  if (token) {
    if (token.startsWith("Bearer ")) token = token.slice(7, token.length);
    let result = jwt.validateJWT(token);
    if (result) {
      let user = await User.findOne(result.email);
      if (user) request.user = user;
      return next();
    } else
      return response.status(401).json({ status: 500, error: "token error" });
  } else {
    // token not sent
    return response.status(401).json({ status: 401, message: "unauthorized" });
  }
};
