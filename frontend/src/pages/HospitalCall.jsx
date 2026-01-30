import React, { useEffect, useRef, useState } from "react";
import { FaPhoneSlash, FaPhone, FaHome } from "react-icons/fa";
import assets from "../assets/assets";
import { useUser } from "@clerk/clerk-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getVapiClient, initializeVapi } from "../utils/vapi-client";

const PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;
const ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID;

const HospitalCall = () => {
  const { callId: routeCallId } = useParams(); // Get callId from the route
  const navigate = useNavigate();
  const user = useUser();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState("Ready to start consultation");
  const [latestMessage, setLatestMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callId, setCallId] = useState(routeCallId);

  const clientRef = useRef(null);

  useEffect(() => {
    const initVapi = async () => {
      try {
        const client = initializeVapi(PUBLIC_KEY);
        clientRef.current = client;

        // ✅ Capture call ID when call starts
        const handleCallStart = () => {
          setCallStatus("Consultation in Progress");
          setIsCallActive(true);

          // Try to get call ID immediately
          const startCallId =
            client.call?.id || client.call?.callId || client.call?.callClientId;
          if (startCallId) {
            console.log("✅ Call started with ID:", startCallId);
            setCallId(startCallId);
          } else {
            console.warn("⚠️ Call started but no ID found yet");
          }
        };

        // ✅ Navigate to summary when call ends
        const handleCallEnd = () => {
          setCallStatus("Consultation Ended");
          setIsCallActive(false);

          console.log("📞 Call ended");
          console.log("Client ref:", clientRef.current);
          console.log("Call object:", clientRef.current?.call);

          // Try multiple ways to get call ID
          const finalCallId =
            clientRef.current?.call?.id ||
            clientRef.current?.call?.callId ||
            clientRef.current?.call?.callClientId ||
            callId ||
            routeCallId;

          console.log("Messages: ", messages);
          console.log("Final Call ID:", finalCallId);

          if (finalCallId) {
            // Navigate to summary page
            setTimeout(() => {
              console.log(
                `🔄 Navigating to: /hospital-call/${finalCallId}/summary`,
              );
              navigate(`/hospital-call/${finalCallId}/summary`);
            }, 1000);
          } else {
            console.error("❌ No call ID found - cannot navigate to summary");
            // Fallback to home
            setTimeout(() => {
              navigate("/");
            }, 1000);
          }
        };

        // ✅ Handle Messages/Transcripts
        const handleMessage = (msg) => {
          if (msg.type === "transcript" && msg.transcriptType === "final") {
            const newMessage = `${msg.role === "user" ? "You" : "Doctor"}: ${
              msg.transcript
            }`;
            setLatestMessage(newMessage);
            setMessages((prev) => [...prev, newMessage]);
          }
        };

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        // ✅ Register all Event listeners
        if (client) {
          client.on("call-start", handleCallStart);
          client.on("call-end", handleCallEnd);
          client.on("message", handleMessage);
          client.on("speech-start", onSpeechStart);
          client.on("speech-end", onSpeechEnd);

          // ✅ Add error handler
          client.on("error", (error) => {
            console.error("VAPI Error: ", error);
            setCallStatus("Error occured");
          });
        }
      } catch (error) {
        console.error("VAPI initialization error:", error);
        setCallStatus("Failed to initialize voice assistant");
      }
    };

    initVapi();

    return () => {
      if (clientRef.current?.call?.status === "active") {
        clientRef.current.stop().catch(console.error);
      }
    };
  }, [navigate, routeCallId]);

  const startCall = async () => {
    try {
      setCallStatus("Connecting...");
      const client = getVapiClient();

      const assistantConfig = {
        assistantId: ASSISTANT_ID,
      };

      const call = await client.start(assistantConfig);
      console.log("Call Started: ", call);

      return call;
    } catch (error) {
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
      const currentCallId =
        client.call?.id ||
        client.call?.callId ||
        client.call?.callClientId ||
        callId;

      if (currentCallId) {
        console.log("✅ Captured call ID before ending:", currentCallId);
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

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (clientRef.current?.call?.status === "active") {
        clientRef.current.stop().catch(console.error);
      }
    };
  }, []);

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
