const User = require("../models/user");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = require("express").Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.status(200).json({ user, token });
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token !== token);

    await req.user.save();

    res.status(200).json({ message: "logged out" });
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.status(200).json({ message: "logged out of all devices" });
  } catch (error) {
    res.status(500).json({ error: "something went wrong", error });
  }
});

router.get("/users/me", auth, async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "something went wrong" });
  }
});

router.get("/users/:id", (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: "users not found" });
      }
      res.status(201).json(result);
    })
    .catch((error) => res.status(500).json(error));
});

// update user profile
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "age", "password"];
  const isValidUpdates = updates.every((item) => allowedUpdates.includes(item));

  if (!isValidUpdates) {
    res.status(400).json({ error: "invalid updates" });
  }

  try {
    const user = req.user;
    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

// remove a user profile
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.status(200).json({ message: "account deleted" });
  } catch (error) {
    res.send(500).json({ error: "something went wrong" });
  }
});

module.exports = router;
