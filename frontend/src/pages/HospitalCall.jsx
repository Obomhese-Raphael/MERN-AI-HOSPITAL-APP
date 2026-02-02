import React, { useEffect, useRef, useState } from "react";
import { FaPhoneSlash, FaPhone, FaHome } from "react-icons/fa";
import assets from "../assets/assets";
import { useUser } from "@clerk/clerk-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getVapiClient, initializeVapi, isUuidV4 } from "../utils/vapi-client";

const PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;
const ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID;

const HospitalCall = () => {
  const { callId: routeCallId } = useParams(); // "new" or a UUID
  const isNewCall = routeCallId === "new";

  const navigate = useNavigate();
  const user = useUser();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState("Ready to start consultation");
  const [latestMessage, setLatestMessage] = useState("");
  // const [messages, setMessages] = useState([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callId, setCallId] = useState(() =>
    isUuidV4(routeCallId) ? routeCallId : null,
  );

  const clientRef = useRef(null);
  const callIdRef = useRef(null);
  const callStartRequested = useRef(false);
  const listenersRegistered = useRef(false); // ✅ Moved to top level (valid hook call)

  useEffect(() => {
    let handleCallStartRef,
      handleCallEndRef,
      handleMessageRef,
      onSpeechStartRef,
      onSpeechEndRef,
      onErrorRef;

    const initVapi = async () => {
      try {
        const client = initializeVapi(PUBLIC_KEY);
        clientRef.current = client;

        if (listenersRegistered.current) {
          console.log("[HospitalCall] Listeners already registered — skipping");
          return;
        }
        listenersRegistered.current = true;

        handleCallStartRef = () => {
          setCallStatus("Consultation in Progress");
          setIsCallActive(true);

          const realCallId = client.call?.id;

          if (isUuidV4(realCallId)) {
            console.log("✅ REAL VAPI CALL ID:", realCallId);
            callIdRef.current = realCallId;
            setCallId(realCallId);
          } else {
            console.warn("[HospitalCall] call-start fired but call.id is not a UUID v4", {
              realCallId,
            });
          }
        };

        handleCallEndRef = () => {
          setCallStatus("Consultation Ended");
          setIsCallActive(false);

          // When the call ends, some SDK versions clear `client.call`.
          // Keep our own source-of-truth in a ref.
          const endedCallId = callIdRef.current || clientRef.current?.call?.id;

          console.log("📞 Call ended | ID:", endedCallId);

          callStartRequested.current = false;

          if (isUuidV4(endedCallId)) {
            navigate(`/hospital-call/${endedCallId}/summary`, { replace: true });
          } else {
            console.warn("[HospitalCall] Not navigating to summary - invalid call id", {
              endedCallId,
            });
            navigate("/", { replace: true });
          }
        };

        handleMessageRef = (msg) => {
          if (msg.type === "transcript" && msg.transcriptType === "final") {
            const speaker = msg.role === "user" ? "You" : "AI Doctor";
            const text = msg.transcript || msg.text || "";
            if (text.trim()) {
              const newMsg = `${speaker}: ${text}`;
              setLatestMessage(newMsg);
              // setMessages((prev) => [...prev, newMsg]);
            }
          }
        };

        onSpeechStartRef = () => setIsSpeaking(true);
        onSpeechEndRef = () => setIsSpeaking(false);

        onErrorRef = (error) => {
          console.error("Vapi error:", error);
          if (error?.errorMsg?.includes("Meeting has ended")) {
            console.log("Expected end-of-call socket close — ignoring");
            return;
          }
          setCallStatus("Call error occurred");
        };

        client.on("call-start", handleCallStartRef);
        client.on("call-end", handleCallEndRef);
        client.on("message", handleMessageRef);
        client.on("speech-start", onSpeechStartRef);
        client.on("speech-end", onSpeechEndRef);
        client.on("error", onErrorRef);

        console.log("[HospitalCall] Listeners attached");
      } catch (err) {
        console.error("Vapi init failed:", err);
        setCallStatus("Voice connection failed");
      }
    };

    initVapi();

    if (isNewCall) {
      console.log("🆕 Starting new call...");
      startCall();
    }

    return () => {
      const client = clientRef.current;
      if (!client) return;

      // Remove using the SAME function references
      if (handleCallStartRef) client.off("call-start", handleCallStartRef);
      if (handleCallEndRef) client.off("call-end", handleCallEndRef);
      if (handleMessageRef) client.off("message", handleMessageRef);
      if (onSpeechStartRef) client.off("speech-start", onSpeechStartRef);
      if (onSpeechEndRef) client.off("speech-end", onSpeechEndRef);
      if (onErrorRef) client.off("error", onErrorRef);

      listenersRegistered.current = false;

      if (client.call?.status === "active") {
        console.log("Stopping active call on unmount");
        client.stop().catch(console.warn);
      }
    };
  }, []); // empty deps — run once; // ← IMPORTANT: empty dependency array = run once on mount

  const startCall = async () => {
    if (callStartRequested.current) {
      console.log("[HospitalCall] startCall already requested - skipping");
      return;
    }

    callStartRequested.current = true;

    try {
      setCallStatus("Connecting...");
      const client = getVapiClient();

      const assistantConfig = {
        assistantId: ASSISTANT_ID,
      };

      const call = await client.start(assistantConfig);
      console.log("Call Started: ", call);

      const realCallId = call?.id;
      if (isUuidV4(realCallId)) {
        callIdRef.current = realCallId;
        setCallId(realCallId);
      }

      return call;
    } catch (error) {
      callStartRequested.current = false;
      console.error("Call start failed:", error);
      throw error;
    }
  };

  const endCall = async () => {
    try {
      setCallStatus("Ending call...");
      const client = clientRef.current;

      if (!client) {
        console.error("No VAPI client instance found");
        setCallStatus("Error: No client instance");
        return;
      }

      console.log("Ending call...");
      console.log("Client:", client);
      console.log("Call details:", client.call);

      // ✅ Capture call ID BEFORE stopping
      const currentCallId = callIdRef.current || client.call?.id;

      if (isUuidV4(currentCallId)) {
        console.log("✅ Captured call ID before ending:", currentCallId);
        callIdRef.current = currentCallId;
        setCallId(currentCallId);
      }

      // ✅ Stop the call
      if (typeof client.stop === "function") {
        await client.stop();
      } else if (typeof client.end === "function") {
        await client.end();
      } else {
        console.warn("No valid stop method found on client");
      }

      setIsCallActive(false);
      setCallStatus("Call ended");
    } catch (error) {
      console.error("Error ending call:", error);
      setCallStatus("Error ending call");
      setIsCallActive(false);
    }
  };

  // ────────────────────────────────────────────────
  //  Removed redundant cleanup useEffect (handled in the main useEffect above)
  // ────────────────────────────────────────────────

  if (callStatus.includes("Failed") || callStatus.includes("Error")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-6 max-w-md bg-white rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Connection Error
          </h2>
          <p className="mb-4 text-gray-700">{callStatus}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      <div className="w-[90%] items-center">
        <div className="flex flex-col sm:flex-row border-b-blue-700 gap-10 justify-center">
          <div className="w-full max-w-lg mb-8 flex-grow">
            <div className="bg-white rounded-xl shadow-md p-6 text-center h-80 w-full flex flex-col items-center justify-center">
              <div className="relative flex mx-auto w-24 h-24 mb-4">
                <img
                  src={assets.aiDoctor4}
                  alt="AI Doctor"
                  width={96}
                  height={96}
                  className="rounded-full object-cover"
                />
                {isSpeaking && (
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full animate-pulse border-2 border-white"></span>
                )}
              </div>
              <h3 className="text-xl font-semibold">AI Doctor</h3>
              <p className="text-sm text-gray-500">{callStatus}</p>
            </div>
          </div>

          <div className="w-full max-w-lg mb-8 flex-grow">
            <div className="bg-white rounded-xl shadow-md p-6 text-center border-2 border-blue-100 h-80 w-full flex flex-col items-center justify-center">
              <div className="mx-auto w-24 h-24 mb-4">
                <img
                  src={
                    user?.user?.hasImage ? user?.user?.imageUrl : assets.johnDoe
                  }
                  alt="Patient"
                  width={100}
                  height={96}
                  className="rounded-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">{user?.user?.firstName}</h3>
            </div>
          </div>
        </div>

        {latestMessage && (
          <div className="w-full justify-center items-center m-auto">
            <div className=" mb-8 bg-white rounded-xl shadow-md p-4 items-center border-2 border-blue-100 flex flex-col justify-center">
              <div className="text-center">
                <p className="text-gray-700 animate-fadeIn">{latestMessage}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-4 justify-center">
          <button
            onClick={isCallActive ? endCall : startCall}
            className={`flex items-center justify-center space-x-2 px-6 py-3 text-white rounded-full ${
              isCallActive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={callStatus === "Connecting..."}
          >
            {isCallActive ? (
              <>
                <FaPhoneSlash className="text-lg" />
                <span>End Consultation</span>
              </>
            ) : (
              <>
                <FaPhone className="text-lg" />
                <span>Start Consultation</span>
              </>
            )}
          </button>

          <Link
            to="/"
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700"
          >
            <FaHome className="text-lg" />
            <span> Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HospitalCall;
