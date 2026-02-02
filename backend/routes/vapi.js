import express from "express";
import { VapiClient } from "@vapi-ai/server-sdk";

const vapiRoute = express.Router(); 

// ✅ Check if API key exists
if (!process.env.VAPI_PRIVATE_KEY) {
  console.error('❌ VAPI_PRIVATE_KEY is not set in environment variables!');
}

const vapi = new VapiClient({
  token: process.env.VAPI_PRIVATE_KEY,
});

// ✅ Test route
vapiRoute.get("/test", (req, res) => {
  res.json({ 
    message: "VAPI routes are working!",
    hasApiKey: !!process.env.VAPI_PRIVATE_KEY 
  });
});

vapiRoute.get("/debug/:testId", (req, res) => {
  console.log("DEBUG ROUTE HIT!");
  console.log("req.params:", req.params);
  console.log("req.originalUrl:", req.originalUrl);
  res.json({
    message: "Debug route works",
    receivedParam: req.params.testId,
    fullUrl: req.originalUrl
  });
});

vapiRoute.get("/call/:callId", async (req, res) => {
  const { callId } = req.params;

  console.log("Received callId:", callId);

  // TEMP TEST: force a known good ID from dashboard
  const testId = "019c1f8a-0cc3-7002-9f51-e1d40b86e676"; // ← your ID

  try {
    console.log("Trying to fetch with forced ID:", testId);
    const call = await vapi.calls.get(testId);  // ← use testId here
    res.json(call);
  } catch (error) {
    console.error("Forced fetch error:", error);
    res.status(500).json({ error: error.message, attemptedId: testId });
  }
});

export default vapiRoute; 