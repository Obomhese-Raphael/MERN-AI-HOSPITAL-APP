// utils/vapi-client.js
import Vapi from '@vapi-ai/web';

let vapiClient = null;

export const initializeVapi = (publicKey) => {
  if (vapiClient) return vapiClient; // Return existing client if already initialized

  vapiClient = new Vapi(publicKey);

  // Add basic event listeners
  vapiClient.on("call-start", () => console.log("Call started"));
  vapiClient.on("call-end", () => console.log("Call ended"));
  vapiClient.on("error", (error) => console.error("VAPI error:", error));

  return vapiClient;
};

export const startCall = async (assistantId) => {
  const client = getVapiClient();
  try {
    const call = await client.start(assistantId);
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

export const stopCall = async () => {
  if (!vapiClient) return;
  try {
    await vapiClient.stop();
  } catch (error) {
    console.error('Call stop error:', error);
    throw error;
  }
};

export const isCallActive = () => {
  return vapiClient?.call?.status === 'active';
};

export const getVapiClient = () => vapiClient;