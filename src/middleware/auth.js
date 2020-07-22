const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decode = jwt.verify(token, "mytopsecret");
    const user = await User.findOne({ _id: decode._id, "tokens.token": token });

    if (!user) {
      return res.status(404).json({ error: "user does not exist" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "unathorized access" });
  }
};

module.exports = auth;
