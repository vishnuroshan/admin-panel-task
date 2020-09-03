const jwt = require("./jwt");
const User = require("../models/users");

exports.checkToken = async (request, response, next) => {
  console.log(request.headers.authorization)
  let token = request.headers.authorization;
  if (token) {
    if (token.startsWith("Bearer ")) token = token.slice(7, token.length);
    let result = jwt.validateJWT(token);
    console.log('jwt result::>', result)
    if (result) {
      let user = await User.findOne(result.email);
      console.log(user)
      if (user) request.user = user;
      next();
    } else
      return response.status(401).json({ status: 500, error: "token error" });
  } else {
    // token not sent
    return response.status(401).json({ status: 401, message: "unauthorized" });
  }
};
