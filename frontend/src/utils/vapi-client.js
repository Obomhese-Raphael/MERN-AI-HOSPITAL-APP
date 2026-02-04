import Vapi from "@vapi-ai/web";

// ✅ Updated regex to accept BOTH UUID v4 and v7 (VAPI uses v7)
const UUID_V4_V7_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[47][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isUuidV4 = (value) =>
  typeof value === "string" && UUID_V4_V7_REGEX.test(value);

let vapiClient = null;

export const initializeVapi = (publicKey) => {
  if (!vapiClient) {
    vapiClient = new Vapi(publicKey);
    // Add basic event listeners
    vapiClient.on("call-start", () => console.log("Call started"));
    vapiClient.on("call-end", () => console.log("Call ended"));
    vapiClient.on("error", (error) => console.error("VAPI error:", error));
  }
  return vapiClient;
};

export const isCallActive = () => {
  if (!vapiClient) return false;

  // Check for different versions of the SDK
  return (
    vapiClient.isActive?.() || // Newer versions
    vapiClient.call?.status === "active" || // Older versions
    vapiClient.active
  ); // Alternative property
};

export const startCall = async (assistantId) => {
  try {
    const client = getVapiClient();
    const call = await client.start(assistantId);
    console.log("Call Response in Start Call: ", call);
    return {
      callId: call.id,
      callObject: call,
      status: call.status,
    };
  } catch (error) {
    console.error("Call start failed:", error);
    throw error;
  }
};

export const getVapiClient = () => {
  if (!vapiClient) {
    throw new Error("Vapi client not initialized. Call initializeVapi first.");
  }
  return vapiClient;
};