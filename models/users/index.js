const User = require("./user");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

exports.create = async (userDetails) => await User.create(userDetails);

exports.findOne = async (email) => User.findOne({ email }).lean();

exports.findById = async (id) => User.findById(id).lean();

const parseQuery = (filters) => {
  let query = {};

  if (filters.range && filters.range.from && filters.range.to) {
    query.$and = [
      {
        createdAt: { $gte: new Date(filters.range.from) },
      },
      {
        createdAt: { $lte: new Date(filters.range.to) },
      },
    ];
  }

  if (filters.search) {
    query.$or = [
      { firstname: { $regex: filters.search, $options: "i" } },
      { lastname: { $regex: filters.search, $options: "i" } },
    ];
  }

  return query;
};

exports.findByAdmin = async (addedBy, filters) => {
  let query = parseQuery(filters);
  query.addedBy = addedBy;
  console.log(query);
  let users = await User.find(query);
  let result = users.map((user) => {
    user._doc.password = user.get("password", null, { getters: true });
    return user;
  });
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
