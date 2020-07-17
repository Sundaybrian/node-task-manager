const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");

const app = express();
app.use(express.json());

app.post("/users", (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => res.status(400).json(error));
});

app.get("/users", (req, res) => {
  User.find({})
    .then((result) => {
      if (!result) {
        return res.status(400).json({ message: "users not found" });
      }
      res.status(201).json(result);
    })
    .catch((error) => res.status(500).json(error));
});

app.get("/users/:id", (req, res) => {
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

app.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "age", "password"];
  const isValidUpdates = updates.every((item) => allowedUpdates.includes(item));

  if (!isValidUpdates) {
    res.status(400).json({ error: "invalid updates" });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      res.status(404).json({ error: "user not found!!" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tasks
app.post("/tasks", (req, res) => {
  const task = new Task(req.body);

  task
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => res.status(400).json(error));
});

app.get("/tasks", (req, res) => {
  Task.find({})
    .then((result) => {
      if (!result) {
        return res.status(400).json({ message: "tasks not found" });
      }
      res.status(200).json(result);
    })
    .catch((error) => res.status(500).json(error));
});

app.get("/tasks/:id", (req, res) => {
  const _id = req.param.id;
  Task.findById(_id)
    .then((result) => {
      if (!result) {
        return res.status(400).json({ message: "task not found" });
      }
      res.status(200).json(result);
    })
    .catch((error) => res.status(500).json(error));
});

app.listen(5000, () => {
  console.log("server started at port 5000");
});
