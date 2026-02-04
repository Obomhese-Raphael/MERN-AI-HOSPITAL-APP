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
  res.json({
    message: "Debug route works",
    receivedParam: req.params.testId,
    fullUrl: req.originalUrl,
  });
});

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isUuidV4 = (value) =>
  typeof value === "string" && UUID_V4_REGEX.test(value);

vapiRoute.get("/call/:callId", async (req, res) => {
  const { callId } = req.params;

  if (!callId) {
    return res.status(400).json({ error: "Missing callId" });
  }

  // Defensive: never forward bad IDs to VAPI
  if (!isUuidV4(callId)) {
    return res.status(400).json({
      error: "Invalid callId (must be a UUID v4)",
      callId,
    });
  }

  // try {
  //   const call = await vapi.calls.get(callId);
  //   console.log("CALL FROM VAPI.JS: ", call);
  //   res.json(call);
  // } catch (error) {
  //   console.error("VAPI fetch failed:", error);
  //   res.status(error.statusCode || 500).json({
  //     error: error.body?.message || error.message,
  //     callId,
  //   });
  // }

  // routes/vapi.js
try {
  const response = await axios.get(`https://api.vapi.ai/call/${callId}`, {
    headers: { Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}` },
  });
  res.json(response.data);
} catch (error) {
  console.error("Vapi proxy error:", error.response?.data || error.message);
  res.status(error.response?.status || 500).json({
    error: "Failed to fetch call",
    details: error.response?.data?.message || error.message,
  });
}
});

export default vapiRoute;
