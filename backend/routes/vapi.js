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

// ✅ Get call by ID
// vapiRoute.get("/call/:callId", async (req, res) => {
//   const { callId } = req.params;

//   console.log('📞 Fetching call:', callId);

//   try {
//     const call = await vapi.calls.get(callId);
//     console.log("✅ Call retrieved successfully");
    
//     // Return structured data
//     res.json({
//       id: call.id,
//       status: call.status,
//       endedReason: call.endedReason,
//       startedAt: call.startedAt,
//       endedAt: call.endedAt,
//       cost: call.cost,
//       messages: call.messages || call.artifact?.messages || [],
//       transcript: call.transcript || call.artifact?.transcript || "No transcript available",
//       analysis: call.analysis || {}, // summary, structuredData, successEvaluation
//       recordingUrl: call.recordingUrl || call.artifact?.recording?.stereoUrl || null,
//       structuredOutputs: call.structuredOutputs || null, // ✅ Your structured outputs!
//     });
//   } catch (error) {
//     console.error("❌ VAPI fetch error:", error.message);
//     console.error("Error details:", error);
    
//     res.status(error.statusCode || 500).json({ 
//       error: "Failed to fetch call details",
//       message: error.message,
//       callId: callId
//     });
//   }
// });

// vapiRoute.get("/call/:callId", async (req, res) => {
//   const callId = req.params.callId;

//   console.log("=== VAPI CALL ROUTE HIT ===");
//   console.log("Raw req.params:", req.params);
//   console.log("Extracted callId:", callId);
//   console.log("Original URL:", req.originalUrl);
//   console.log("Full request path:", req.path);
//   console.log("VAPI_PRIVATE_KEY length:", process.env.VAPI_PRIVATE_KEY?.length || "MISSING");

//   if (!callId) {
//     return res.status(400).json({ 
//       error: "No callId received in params",
//       debug: { params: req.params, url: req.originalUrl }
//     });
//   }

//   try {
//     const call = await vapi.calls.get(callId);
//     res.json(call);
//   } catch (error) {
//     console.error("VAPI ERROR:", error);
//     res.status(500).json({ error: error.message, callIdUsed: callId });
//   }
// });

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