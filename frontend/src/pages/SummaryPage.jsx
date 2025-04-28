import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaFileMedical,
  FaUserMd,
  FaNotesMedical,
  FaCheckCircle,
  FaExclamationTriangle,
  FaStar,
  FaHome,
  FaArrowLeft,
} from "react-icons/fa";
import {
  getVapiClient,
  initializeVapi,
} from "../utils/vapi-client";

const PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;

const SummaryPage = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        // Initialize Vapi if not already done
        initializeVapi(PUBLIC_KEY);
        const client = getVapiClient();
        idDetails = client.calls.get("id");
        console.log("ID Details: ", idDetails);
        console.log("CLIENT IN SUMMARY PAGE", client);
        console.log("Fetching analysis for call ID:", id);

        // Add a short delay to ensure the analysis is ready
        if (retryCount === 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        const analysisData = await getCallAnalysis(id);
        console.log("Retrieved analysis data:", analysisData);

        if (!analysisData) {
          throw new Error("Analysis data not available yet");
        }

        setAnalysis(analysisData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch analysis:", err);

        // Only retry a limited number of times
        if (retryCount < 3 && err.message.includes("not available")) {
          setRetryCount((prevCount) => prevCount + 1);
          setError("Analysis is still being generated. Retrying...");

          // Exponential backoff for retries
          const retryDelay = 3000 * Math.pow(2, retryCount);
          setTimeout(fetchAnalysis, retryDelay);
        } else {
          setError(
            "Unable to retrieve consultation summary. Please try again later."
          );
          setLoading(false);
        }
      }
    };

    fetchAnalysis();
  }, [id, retryCount]);

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <FaFileMedical className="text-blue-500 text-3xl mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">
              Consultation Summary
            </h1>
          </div>

          <div className="flex flex-col items-center justify-center p-10">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-gray-600 text-center">
              {error || "Generating your consultation summary..."}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              This may take a few moments to complete
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-blue-50 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <FaExclamationTriangle className="text-orange-500 text-3xl mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">
              Summary Unavailable
            </h1>
          </div>

          <div className="text-center p-6">
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FaHome className="mr-2" /> Return Home
              </Link>
              <button
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  setRetryCount(0);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render the summary content when data is available
  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center mb-6">
          <FaFileMedical className="text-blue-500 text-3xl mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">
            Consultation Summary
          </h1>
        </div>

        {/* Summary Section */}
        <div className="mb-8">
          <div className="flex items-center mb-3">
            <FaUserMd className="text-blue-500 text-xl mr-2" />
            <h2 className="text-xl font-semibold text-gray-700">
              Consultation Overview
            </h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-700">
              {analysis?.summary ||
                "No summary available for this consultation."}
            </p>
          </div>
        </div>

        {/* Structured Data Section */}
        {analysis?.structuredData && (
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <FaNotesMedical className="text-blue-500 text-xl mr-2" />
              <h2 className="text-xl font-semibold text-gray-700">
                Key Information
              </h2>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <dl className="divide-y divide-gray-200">
                {Object.entries(analysis.structuredData).map(([key, value]) => (
                  <div key={key} className="py-3 flex flex-col">
                    <dt className="text-sm font-medium text-gray-500 capitalize">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {typeof value === "boolean" ? (
                        value ? (
                          <FaCheckCircle className="text-green-500" />
                        ) : (
                          <FaExclamationTriangle className="text-orange-500" />
                        )
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}

        {/* Success Evaluation Section */}
        {analysis?.successEvaluation && (
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <FaStar className="text-blue-500 text-xl mr-2" />
              <h2 className="text-xl font-semibold text-gray-700">
                Consultation Quality
              </h2>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-700">{analysis.successEvaluation}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between mt-8">
          <Link
            to="/"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FaHome className="mr-2" /> Return Home
          </Link>

          <button
            onClick={() => window.print()}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Print Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
