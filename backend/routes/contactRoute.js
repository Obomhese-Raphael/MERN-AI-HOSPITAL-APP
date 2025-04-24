import express from "express";
import { submitContactForm } from "../controllers/contactController.js";

const contactRouter = express.Router();
contactRouter.post("/", submitContactForm);

export default contactRouter;
