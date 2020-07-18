const Task = require("../models/task");
const router = require("express").Router();

// tasks

router.post("/tasks", (req, res) => {
  const task = new Task(req.body);

  task
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => res.status(400).json(error));
});

router.get("/tasks", (req, res) => {
  Task.find({})
    .then((result) => {
      if (!result) {
        return res.status(400).json({ message: "tasks not found" });
      }
      res.status(200).json(result);
    })
    .catch((error) => res.status(500).json(error));
});

router.get("/tasks/:id", (req, res) => {
  const _id = req.params.id;
  Task.findById(_id)
    .then((result) => {
      if (!result) {
        return res.status(400).json({ message: "task not found" });
      }
      res.status(200).json(result);
    })
    .catch((error) => res.status(500).json(error));
});

router.patch("/tasks/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidUpdates = updates.every((item) => allowedUpdates.includes(item));

  if (!isValidUpdates) {
    return res.status(400).json({ error: "invalid updates" });
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ error: "task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
