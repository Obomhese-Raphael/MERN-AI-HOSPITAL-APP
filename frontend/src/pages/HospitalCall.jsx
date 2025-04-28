import React, { useEffect, useRef, useState } from "react";
import { FaPhoneSlash, FaPhone, FaHome } from "react-icons/fa";
import assets from "../assets/assets";
import { useUser } from "@clerk/clerk-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCallAnalysis, getVapiClient, initializeVapi } from "../utils/vapi-client";

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
  const [feedbackData, setFeedbackData] = useState({
    symptoms: "",
    issue: "",
    timeOfInjury: "",
    presscribedSolution: "",
    followUpRecommendation: "",
    overallAssessment: 0,
    date: new Date().toISOString(),
  });

  const clientRef = useRef(null);

  useEffect(() => {
    const initVapi = async () => {
      try {
        const client = initializeVapi(PUBLIC_KEY);
        clientRef.current = client;

        const handleCallStart = () => {
          setCallStatus("Consultation in Progress");
          setIsCallActive(true);
        };

        const handleCallEnd = () => {
          setCallStatus("Consultation Ended");
          setIsCallActive(false);
          console.log("CLIENT REF IN HANDLECALL END: ", clientRef);
          console.log("CLIENT IN HANDLECALL END: ", client);
          if (clientRef.current?.call?.callClientId) {
            fetchAndLogAnalysis(clientRef.current.call.callClientId);
          } else if (routeCallId) {
            fetchAndLogAnalysis(routeCallId);
          } else {
            console.warn("No call ID available to fetch analysis.");
          }
        };

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

        if (client) {
          client.on("call-start", handleCallStart);
          client.on("call-end", handleCallEnd);
          client.on("message", handleMessage);
          client.on("speech-start", onSpeechStart);
          client.on("speech-end", onSpeechEnd);
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

  const fetchAndLogAnalysis = async () => {
    try {
      const analysis = await getCallAnalysis(callId);
      console.log("Call Analysis Summary: ", analysis);
    } catch (error) {
      console.log("Error fetching call analysis: ", error);
    }
  };

  const startCall = async () => {
    try {
      setCallStatus("Connecting...");
      const client = getVapiClient();
      const assistantConfig = {
        assistantId: ASSISTANT_ID,
        analysis: {
          summaryPrompt:
            "You are a medical assistant. Summarize this consultation including symptoms discussed, potential diagnoses, and recommendations.",
          structuredDataSchema: {
            type: "object",
            properties: {
              symptoms: { type: "string" },
              diagnoses: { type: "string" },
              recommendations: { type: "string" },
              followUpRequired: { type: "boolean" },
            },
            required: ["symptoms", "recommendations"],
          },
          successEvaluationPrompt:
            "Evaluate this medical consultation on: 1) Symptom understanding 2) Appropriate advice 3) Clarity 4) Next steps",
          successEvaluationRubric: "DescriptiveScale",
        },
      };

      const call = await client.start(assistantConfig);
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
      console.log("CLIENT IN END CALL :", client);

      if (!client) {
        console.error("No VAPI client instance found");
        setCallStatus("Error: No client instance");
        return;
      }

      // Capture callId before ending the Call
      const callId = client?.call?.callClientId;
      const callDetails = client?.call;

      if (callDetails) {
        console.log("CALL DETAILS: ", callDetails);
      }

      // Try all possible ways to end the call
      if (typeof client.stop === "function") {
        await client.stop();
      } else if (typeof client.end === "function") {
        await client.end();
      } else if (client.call?.stop) {
        await client.call.stop();
      } else if (client.call?.end) {
        await client.call.end();
      } else {
        console.warn("No valid stop method found on client");
      }

      setIsCallActive(false);
      setCallStatus("Call ended");

      if (callId) {
        setTimeout(() => {
          navigate(`/hospital-call/${callId}/summary`);
        }, 1500);
      } else {
        console.warn(
          "No call ID was captured before ending call for navigation"
        );
        navigate("/consultation-summary");
      }
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
