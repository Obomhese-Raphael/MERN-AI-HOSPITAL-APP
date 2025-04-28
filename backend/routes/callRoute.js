// backend/routes/callRoutes.js
import express from "express";
import {
  getCallSummary,
  saveCallSummary,
} from "../controllers/callController.js";

const callRouter = express.callRouter();

// Protected routes
callRouter.get("/:callId", getCallSummary);
callRouter.post("/", saveCallSummary);

export default callRouter;
