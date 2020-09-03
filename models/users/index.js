const User = require("./user");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

exports.create = async (userDetails) => await User.create(userDetails);

exports.findOne = async (email) => User.findOne({ email }).lean();

exports.findById = async (id) => User.findById(id).lean();

exports.findByAdmin = async (addedBy) => {
  let users = await User.find({ addedBy });
  let result = users.map((user) => {
    user._doc.password = user.get("password", null, { getters: true });
    return user;
  });
  console.log(result);
  return result;
};

exports.checkPass = async (email, password) => {
  let user = await User.findOne({ email });
  if (user) {
    let userPass = user.get("password", null, { getters: false });
    const isOk = await bcrypt.compare(password, userPass);
    if (isOk) return true;
    else return false;
  }
};
