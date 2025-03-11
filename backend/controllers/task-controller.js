import Task from "../models/task-model.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

// Create Task
export const createTask = async (req, res) => {
  const { title, description, status } = req.body;

  if (!title) {
    throw new BadRequestError("Title is required.");
  }

  const task = await Task.create({
    title,
    description,
    status: status || "pending",
  });

  res.status(StatusCodes.CREATED).json(task);
};

// Get All Tasks
export const getTasks = async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: "desc" });
  res.status(StatusCodes.OK).json(tasks);
};

// Update Task
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const updatedTask = await Task.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedTask) throw new NotFoundError("Task not found.");

  res.status(StatusCodes.OK).json(updatedTask);
};

// Delete Task
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  const deletedTask = await Task.findByIdAndDelete(id);
  if (!deletedTask) throw new NotFoundError("Task not found.");

  res.status(StatusCodes.OK).json({ message: "Task deleted successfully." });
};
