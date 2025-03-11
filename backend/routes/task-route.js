import express from "express";
import { 
  createTask, 
  getTasks, 
  updateTask, 
  deleteTask, 
} from "../controllers/task-controller.js"

const router = express.Router();

// Task Routes
router.post("/",  createTask); 
router.get("/",  getTasks); 
router.patch("/:id", updateTask); 
router.delete("/:id",  deleteTask); 

export default router;
