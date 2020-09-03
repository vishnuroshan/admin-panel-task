const mongoose = require("../../db/connection");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      set: (pass) => bcrypt.hashSync(pass, 10),
      get: () => "*********",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    addedBy: {
      type: mongoose.Types.ObjectId,
    },
  },
  { timestamps: true }
);

// UserSchema.post("save", async (doc) => {
//   if (doc.password) {
//     doc.password = await bcrypt.hash(doc.password, 10);
//     doc.save();
//   }
// });

const User = mongoose.model("users", UserSchema);

module.exports = User;
