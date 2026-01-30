import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const CallSummary = () => {
  const { callId } = useParams();
  const [callData, setCallData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/vapi/call/${callId}`
        );
        setCallData(res.data);
      } catch (err) {
        setError("Could not load summary. Call may still be processing.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [callId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading consultation summary...</p>
          <p className="text-sm text-gray-500 mt-2">(Analysis may take a few seconds after call ends)</p>
        </div>
      </div>
    );
  }

  if (error || !callData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Summary</h2>
          <p className="text-gray-700 mb-6">{error || "No data available for this call."}</p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const { analysis = {}, messages = [], transcript = "", cost, startedAt, endedAt } = callData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-3xl font-bold">Consultation Summary</h1>
          <p className="mt-2 opacity-90">Call ID: {callId}</p>
          <p className="text-sm mt-1">
            Duration: {startedAt && endedAt ? `${((new Date(endedAt) - new Date(startedAt)) / 60000).toFixed(1)} min` : "N/A"}
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* AI Summary */}
          {analysis.summary && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">AI-Generated Summary</h2>
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">{analysis.summary}</p>
              </div>
            </section>
          )}

          {/* Structured Data */}
          {analysis.structuredData && Object.keys(analysis.structuredData).length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Extracted Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(analysis.structuredData).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-700 capitalize">{key}</h3>
                    <p className="mt-1 text-gray-700">
                      {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Transcript Preview */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Conversation Transcript</h2>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
              {messages.length > 0 ? (
                messages.map((msg, idx) => (
                  <div key={idx} className={`mb-3 ${msg.role === "assistant" ? "text-blue-800" : "text-green-800"}`}>
                    <strong>{msg.role === "assistant" ? "AI Doctor:" : "You:"}</strong> {msg.message}
                  </div>
                ))
              ) : (
                <p className="text-gray-600 italic">{transcript || "No transcript available yet."}</p>
              )}
            </div>
          </section>

          {/* Cost & Metadata */}
          <section className="text-sm text-gray-600">
            <p>Estimated Cost: ${cost?.toFixed(4) || "N/A"}</p>
          </section>
        </div>

        <div className="p-6 bg-gray-50 border-t flex justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700"
          >
            Back to Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            Refresh Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallSummary;