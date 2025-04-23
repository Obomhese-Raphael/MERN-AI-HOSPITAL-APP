// backend/routes/users.js
import express from "express";
import { addUser } from "../controllers/UserController.js";

const userRouter = express.Router();
userRouter.post("/sync", addUser);

export default userRouter;