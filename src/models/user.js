const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

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
    unique: true,
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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// adding a custom method to the model
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("unable to login in");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("unable to log in");
  }

  return user;
};

// create virtual field for tasks :thus u can do something
// like user.tasks
userSchema.virtual("tasks", {
  ref: "Task", //collections
  localField: "_id", //pk
  foreignField: "owner", //fk
});

// method to return nonsensive user data
userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.tokens;

  return userObj;
};

// generate tokens - user instance
userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id.toString() }, "mytopsecret", {
    expiresIn: 3600,
  });

  // add token to user tokens array
  user.tokens = user.tokens.concat({ token });

  await user.save();
  return token;
};

// run middleware before saving user,wether on creation or updating to hash password
userSchema.pre("save", async function (next) {
  const user = this;

  // check if password is updated/created
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// cascading user tasks when a user is deleted
userSchema.pre("remove", async function (next) {
  const user = this;

  await Task.deleteMany({ owner: user._id });

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
