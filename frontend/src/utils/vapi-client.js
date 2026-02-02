import Vapi from "@vapi-ai/web";

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

// export const startCall = async (assistantId) => {
//   try {
//     const client = getVapiClient();
//     const call = await client.start(assistantId);
//     console.log("Call Response in Start Call: ", call);
//     return {
//       callId: call.id,
//       callObject: call,
//       status: call.status,
//     };
//   } catch (error) {
//     console.error("Call start failed:", error);
//     throw error;
//   }
// };

export const startCall = async (assistantId) => {
  const client = getVapiClient();

  const call = await client.start({
    assistantId,
  });

  console.log("✅ Call started:", call);

  return call;
};

export const stopCall = async () => {
  const client = getVapiClient();
  if (!client) return;

  try {
    // Try different stop methods for compatibility
    if (typeof client.stop === "function") {
      await client.stop();
    } else if (typeof client.end === "function") {
      await client.end();
    } else if (client.call?.end) {
      await client.call.end();
    }
  } catch (error) {
    console.error("Call stop error:", error);
    throw error;
  }
};

export const getVapiClient = () => {
  if (!vapiClient) {
    throw new Error("Vapi client not initialized. Call initializeVapi first.");
  }
  return vapiClient;
};
