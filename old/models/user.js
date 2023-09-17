const mongoose = require("mongoose");

const User = mongoose.model("User", {
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin","supervisor", "consultant"],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = User;
