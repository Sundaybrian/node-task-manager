const Task = require("../models/task");
const router = require("express").Router();
const auth = require("../middleware/auth");

// tasks creation
router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json(error);
  }
});

// fetch all your tasks
router.get("/tasks", auth, async (req, res) => {
  try {
    // const tasks = await req.user.populate("tasks").execPopulate();

    const tasks = await Task.find({ owner: req.user._id });

    if (!tasks) {
      return res.status(400).json({ message: "tasks not found" });
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
});

// fetch your task
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user_id });

    if (!task) {
      return res.status(404).json({ message: "task not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

// update a task
router.patch("/tasks/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidUpdates = updates.every((item) => allowedUpdates.includes(item));

  if (!isValidUpdates) {
    return res.status(400).json({ error: "invalid updates" });
  }

  try {
    const task = await Task.findById(req.params.id);

    updates.forEach((update) => (task[update] = req.body[update]));

    await task.save();

    if (!task) {
      return res.status(404).json({ error: "task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error });
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
