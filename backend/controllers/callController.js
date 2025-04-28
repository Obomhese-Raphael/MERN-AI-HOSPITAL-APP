// backend/controllers/callController.js
import Vapi from "@vapi-ai/node";
import CallModel from "../models/CallModel";

const vapi = new Vapi(process.env.VITE_VAPI_PUBLIC_KEY);

export const getCallSummary = async (req, res) => {
  try {
    const { callId } = req.params;
    const userId = req.user.id; // Assuming you have auth middleware

    // First check if we have it in DB
    const savedCall = await CallModel.findOne({ callId, userId });
    if (savedCall) {``
      return res.json(savedCall);
    }

    // Fetch from Vapi API if not in DB
    const callData = await vapi.calls.retrieve(callId);

    if (!callData) {
      return res.status(404).json({ error: "Call not found" });
    }

    // Save to database for future requests
    const newCall = new Call({
      callId,
      userId,
      summary: callData.summary,
      transcript: callData.transcript,
      analysis: callData.analysis,
    });
    await newCall.save();

    res.json(newCall);
  } catch (error) {
    console.error("Error getting call summary:", error);
    res.status(500).json({ error: "Failed to get call summary" });
  }
};

export const saveCallSummary = async (req, res) => {
  try {
    const { callId, summary, transcript, analysis } = req.body;
    const userId = req.user.id;

    const call = new Call({
      callId,
      userId,
      summary,
      transcript,
      analysis,
    });

    await call.save();
    res.status(201).json(call);
  } catch (error) {
    console.error("Error saving call summary:", error);
    res.status(500).json({ error: "Failed to save call summary" });
  }
};
