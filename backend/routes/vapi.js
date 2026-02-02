import express from "express";
import { VapiClient } from "@vapi-ai/server-sdk";

const vapiRoute = express.Router();

// ✅ Check if API key exists
if (!process.env.VAPI_PRIVATE_KEY) {
  console.error("❌ VAPI_PRIVATE_KEY is not set in environment variables!");
}

const vapi = new VapiClient({
  token: process.env.VAPI_PRIVATE_KEY,
});

// ✅ Test route
vapiRoute.get("/test", (req, res) => {
  res.json({
    message: "VAPI routes are working!",
    hasApiKey: !!process.env.VAPI_PRIVATE_KEY,
  });
});

vapiRoute.get("/debug/:testId", (req, res) => {
  console.log("DEBUG ROUTE HIT!");
  console.log("req.params:", req.params);
  console.log("req.originalUrl:", req.originalUrl);
  res.json({
    message: "Debug route works",
    receivedParam: req.params.testId,
    fullUrl: req.originalUrl,
  });
});

vapiRoute.get("/call/:callId", async (req, res) => {
  const { callId } = req.params;

  if (!callId) {
    return res.status(400).json({ error: "Missing callId" });
  }

  try {
    const call = await vapi.calls.get(callId);
    console.log("CALL FROM VAPI.JS: ", call);
    res.json(call);
  } catch (error) {
    console.error("VAPI fetch failed:", error);
    res.status(error.statusCode || 500).json({
      error: error.body?.message || error.message,
      callId,
    });
  }
});

export default vapiRoute;
