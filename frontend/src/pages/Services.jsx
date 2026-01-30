import React, { useEffect, useState } from "react";
import { FaPhoneAlt, FaBrain, FaHeartbeat, FaShieldAlt } from "react-icons/fa";
import {
  isCallActive,
  startCall,
} from "../utils/vapi-client";
import { useNavigate } from "react-router-dom";
const ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID;
const Services = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        // Check for existing active call
        if (isCallActive()) {
          setIsCalling(true);
          setCallStatus("Call in progress...");
        }
      } catch (error) {
        console.error("Initialization error:", error);
        setCallStatus("Failed to initialize voice assistant");
      }
    };

    init();
  }, []);

  const handleCallClick = async () => {
    try {
      setIsCalling(true);
      setCallStatus("Connecting to AI Doctor...");

      const { callId } = await startCall(ASSISTANT_ID);
      setCallStatus("Connected! Redirecting...");

      // Navigate to the call page after a brief delay for UX
      setTimeout(() => {
        navigate(`/hospital-call/${callId}`);
      }, 1000); // 1 second delay to show the "Connected" message
    } catch (error) {
      let errorMsg = "Failed to connect. Please try again.";
      if (error.message.includes("Unauthorized") || error.status === 401) {
        errorMsg = "Authentication failed. Please check your API keys.";
      } else if (error.message.includes("No callId")) {
        errorMsg = "Connection established but failed to start call session.";
      }
      setCallStatus(errorMsg);
      setIsCalling(false);
    }
  };
  return (
    <section className="py-16 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-8 animate-pulse">
          Experience the Future of Health with AI
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-8 lg:px-16">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition duration-300 transform hover:scale-105">
            <div className="text-blue-500 text-3xl mb-4">
              <FaBrain />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Intelligent Symptom Analysis
            </h3>
            <p className="text-gray-700 text-sm">
              Our AI meticulously analyzes your symptoms to provide insightful
              preliminary guidance.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition duration-300 transform hover:scale-105">
            <div className="text-purple-500 text-3xl mb-4">
              <FaHeartbeat />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Personalized Health Insights
            </h3>
            <p className="text-gray-700 text-sm">
              Get tailored information based on your unique health profile and
              reported concerns.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition duration-300 transform hover:scale-105">
            <div className="text-pink-500 text-3xl mb-4">
              <FaPhoneAlt />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Instant AI Call Connection
            </h3>
            <p className="text-gray-700 text-sm">
              Connect with our AI health assistant instantly through a simple
              click. No waiting rooms, just answers.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition duration-300 transform hover:scale-105">
            <div className="text-green-500 text-3xl mb-4">
              <FaShieldAlt />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Secure & Confidential
            </h3>
            <p className="text-gray-700 text-sm">
              Your health data and conversations are protected with advanced
              security measures. Your privacy matters.
            </p>
          </div>
        </div>
        <div className="mt-12">
          {!isCalling ? (
            <button
              onClick={handleCallClick}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white font-extrabold py-4 px-8 rounded-full shadow-xl text-lg transition duration-300 animate-pulse hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-75 cursor-pointer"
              disabled={callStatus.includes("Connecting")}
            >
              <FaPhoneAlt className="inline-block mr-2" />
              {callStatus.includes("Connecting")
                ? "Connecting..."
                : "Initiate Call"}
            </button>
          ) : (
            <button
              className="bg-gradient-to-r from-green-500 to-teal-600 text-white font-extrabold py-4 px-8 rounded-full shadow-xl text-lg cursor-default"
              disabled
            >
              <FaPhoneAlt className="inline-block mr-2" /> Redirecting to
              Call...
            </button>
          )}
          <p className="mt-4 text-sm text-gray-600">
            {callStatus ||
              "Experience the power of AI-driven healthcare from the comfort of your own space."}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Services;
