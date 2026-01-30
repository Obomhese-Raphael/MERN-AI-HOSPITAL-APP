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

// ✅ Get call by ID
vapiRoute.get("/call/:callId", async (req, res) => {
  const { callId } = req.params;

  console.log('📞 Fetching call:', callId);

  try {
    const call = await vapi.calls.get(callId);
    console.log("✅ Call retrieved successfully");
    
    // Return structured data
    res.json({
      id: call.id,
      status: call.status,
      endedReason: call.endedReason,
      startedAt: call.startedAt,
      endedAt: call.endedAt,
      cost: call.cost,
      messages: call.messages || call.artifact?.messages || [],
      transcript: call.transcript || call.artifact?.transcript || "No transcript available",
      analysis: call.analysis || {}, // summary, structuredData, successEvaluation
      recordingUrl: call.recordingUrl || call.artifact?.recording?.stereoUrl || null,
      structuredOutputs: call.structuredOutputs || null, // ✅ Your structured outputs!
    });
  } catch (error) {
    console.error("❌ VAPI fetch error:", error.message);
    console.error("Error details:", error);
    
    res.status(error.statusCode || 500).json({ 
      error: "Failed to fetch call details",
      message: error.message,
      callId: callId
    });
  }
});

export default vapiRoute; 