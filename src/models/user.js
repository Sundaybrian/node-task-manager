const mongoose = require("mongoose");
const validator = require("validator");


const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email is invalid");
        }
      },
    },
    age: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
  });
  
const User = mongoose.model("User", userSchema);
  
module.exports = User;