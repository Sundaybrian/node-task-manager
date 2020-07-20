const User = require("../models/user");
const Task = require("../models/task");
const router = require("express").Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    const result = await user.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/users", (req, res) => {
  User.find({})
    .then((result) => {
      if (!result) {
        return res.status(400).json({ message: "users not found" });
      }
      res.status(201).json(result);
    })
    .catch((error) => res.status(500).json(error));
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

router.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "age", "password"];
  const isValidUpdates = updates.every((item) => allowedUpdates.includes(item));

  if (!isValidUpdates) {
    res.status(400).json({ error: "invalid updates" });
  }

  try {
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    const user = await User.findById(req.params.id);
    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save();

    if (!user) {
      res.status(404).json({ error: "user not found!!" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/tasks/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ error: "not such task exist" });
    }
    res.status(200).json({ task, removed: true });
  } catch (error) {
    res.status(500).json({ task, removed: true });
  }
});

module.exports = router;
