import express from "express";
import { subscribeNewsletter } from "../controllers/newsletterController.js";

const newsletterRoute = express.Router();
newsletterRoute.post("/", subscribeNewsletter);

export default newsletterRoute;