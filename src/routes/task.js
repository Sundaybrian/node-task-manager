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
// GET /tasks?completed=true
// GET /tasks?limit=3&skip=3
// GET /tasks?sortBy=createdAt:desc
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed == "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] == "desc" ? -1 : 1;
  }

  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit) || 10,
          skip: parseInt(req.query.skip) || 10,
          sort,
        },
      })
      .execPopulate();

    if (!req.user.tasks) {
      return res.status(400).json({ message: "tasks not found" });
    }

    res.status(200).json(req.user.tasks);
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
router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidUpdates = updates.every((item) => allowedUpdates.includes(item));

  if (!isValidUpdates) {
    return res.status(400).json({ error: "invalid updates" });
  }

  try {
    const task = await Task.findBy({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    updates.forEach((update) => (task[update] = req.body[update]));

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const id = req.params.id;

  try {
    const task = await Task.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!task) {
      return res.status(404).json({ error: "not such task exist" });
    }
    res.status(200).json({ task, message: "removed" });
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
});

module.exports = router;
