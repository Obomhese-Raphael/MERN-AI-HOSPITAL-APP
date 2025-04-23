// backend/routes/webhook.js
import express from "express";
import { clerkWebhookHandler } from "../controllers/webhookController.js";

const webhookRouter = express.Router();

webhookRouter.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhookHandler
);

export default webhookRouter;
