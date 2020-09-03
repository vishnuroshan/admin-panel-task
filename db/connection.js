/* eslint-disable no-undef */
const mongoose = require("mongoose");
const config = require("../config/app-config");
mongoose.connect(config.DBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
module.exports = mongoose;
