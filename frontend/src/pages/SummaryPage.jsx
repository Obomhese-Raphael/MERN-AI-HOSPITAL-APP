import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { isUuidV4 } from "../utils/vapi-client";

const CallSummary = () => {
  const location = useLocation();
  const { callId } = useParams();

  const [callData, setCallData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const VAPI_PRIVATE_KEY = import.meta.env.VITE_VAPI_PRIVATE_KEY;

  console.log("=== CallSummary Debug ===");
  console.log("Location pathname:", location.pathname);
  console.log("callId from useParams:", callId);
  console.log("Is valid UUID?", isUuidV4(callId));

  useEffect(() => {
    const cleanCallId = callId?.trim();

    if (!cleanCallId || !isUuidV4(cleanCallId)) {
      console.error("❌ Invalid call ID:", callId);
      setError(
        "Invalid call ID. The consultation may not have started properly.",
      );
      setLoading(false);
      return;
    }

    const fetchSummary = async () => {
      try {
        // ✅ Call VAPI API directly
        const vapiUrl = `https://api.vapi.ai/call/${cleanCallId}`;
        console.log("📞 Fetching from VAPI:", vapiUrl);

        const response = await fetch(vapiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${VAPI_PRIVATE_KEY}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(
            `VAPI returned ${response.status}: ${response.statusText}`,
          );
        }

        const data = await response.json();
        console.log("✅ Call data received:", data);

        setCallData(data);
      } catch (err) {
        console.error("❌ Summary fetch failed:", err);
        setError(err.message || "Could not load summary. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [callId, VAPI_PRIVATE_KEY]);

  // Helper to handle typos and spaces in Vapi structured keys
  const getClinicalValue = (data, possibleKeys) => {
    if (!data) return null;
    const actualKey = Object.keys(data).find((k) =>
      possibleKeys.includes(k.trim().toLowerCase()),
    );
    return data[actualKey];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">
            Loading consultation summary...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            (Analysis may take a few seconds after call ends)
          </p>
        </div>
      </div>
    );
  }

  if (error || !callData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Summary
          </h2>
          <p className="text-gray-700 mb-2">
            {error || "No data available for this call."}
          </p>
          <div className="bg-gray-100 p-3 rounded mt-4 mb-6">
            <p className="text-xs text-gray-600 font-mono break-all">
              Call ID: {callId}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Valid UUID: {isUuidV4(callId) ? "✅ Yes" : "❌ No"}
            </p>
          </div>
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

  const { transcript = "", cost, startedAt, endedAt, artifact = {} } = callData;

  // Extract messages from artifact
  const messages =
    artifact?.messages?.filter(
      (msg) =>
        msg.role === "user" || msg.role === "assistant" || msg.role === "bot",
    ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-3xl font-bold">Consultation Summary</h1>
          <p className="mt-2 opacity-90 font-mono text-sm break-all">
            Call ID: {callId}
          </p>
          <p className="text-sm mt-1">
            Duration:{" "}
            {startedAt && endedAt
              ? `${((new Date(endedAt) - new Date(startedAt)) / 60000).toFixed(1)} min`
              : "N/A"}
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Transcript */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Conversation Transcript
            </h2>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
              {transcript ? (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {transcript}
                </p>
              ) : messages.length > 0 ? (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`mb-3 ${
                      msg.role === "assistant" || msg.role === "bot"
                        ? "text-blue-800"
                        : "text-green-800"
                    }`}
                  >
                    <strong>
                      {msg.role === "assistant" || msg.role === "bot"
                        ? "AI Doctor:"
                        : "You:"}
                    </strong>{" "}
                    {msg.message || msg.content}
                  </div>
                ))
              ) : (
                <p className="text-gray-600 italic">
                  No transcript available yet.
                </p>
              )}
            </div>
          </section>

          {/* Cost & Metadata */}
          <section className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>Status:</strong> {callData.status || "N/A"}
            </p>
            <p>
              <strong>Estimated Cost:</strong> ${cost?.toFixed(4) || "N/A"}
            </p>
            {callData.endedReason && (
              <p>
                <strong>Ended:</strong>{" "}
                {callData.endedReason.replace(/-/g, " ")}
              </p>
            )}
          </section>

          {/* Recording (if available) */}
          {callData.recordingUrl && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Call Recording
              </h2>
              <audio controls className="w-full">
                <source src={callData.recordingUrl} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </section>
          )}
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
      {/* 📋 STRUCTURED CLINICAL SUMMARY SECTION */}
      {callData?.artifact?.structuredOutputs && (
        <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mt-10">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span className="text-blue-600">📋</span> Clinical Record
            </h2>

            {/* Fix: Map from callData.artifact.structuredOutputs */}
            {Object.values(callData.artifact.structuredOutputs || {}).map(
              (output, idx) => (
                <span
                  key={idx}
                  className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                    output.result?.urgency_level?.toLowerCase() === "urgent"
                      ? "bg-red-100 text-red-700 animate-pulse"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {output.result?.urgency_level || "Routine"}
                </span>
              ),
            )}
          </div>

          {/* Fix: Use callData.artifact.structuredOutputs here too */}
          {Object.entries(callData.artifact.structuredOutputs || {}).map(
            ([id, output]) => {
              const data = output.result;
              if (!data) return null;

              return (
                <div key={id} className="space-y-10">
                  {/* Patient Bio-Data */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Patient Name
                      </p>
                      <p className="text-lg font-bold text-slate-800">
                        {data.patient_name || "N/A"} - {data.patient_phone}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Date of Birth
                      </p>
                      <p className="text-lg font-bold text-slate-800">
                        {data.patient_dob || "N/A"}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Appointment Time
                      </p>
                      <p className="text-lg font-bold text-slate-800">
                        {data.appointment_time || "TBD"}
                      </p>
                    </div>
                  </div>

                  {/* Clinical Assessment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                      <h3 className="text-sm font-black text-blue-900 uppercase tracking-tighter mb-3">
                        Presenting Complaint
                      </h3>
                      <p className="text-slate-700 leading-relaxed">
                        {/* Correcting for "cheif_complaint" typo in JSON */}
                        {getClinicalValue(data, [
                          "cheif_complaint",
                          "chief_complaint",
                        ])}
                      </p>
                      <div className="mt-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                        <p className="text-xs font-bold text-blue-800 uppercase mb-1">
                          Provider Rationale
                        </p>
                        <p className="text-sm text-blue-900 italic">
                          {data.urgency_rationale}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-blue-900 uppercase tracking-tighter mb-3">
                        Symptom Analysis
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {data.symptoms_described}
                      </p>
                    </div>
                  </div>

                  {/* Safety & Care */}
                  <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
                    <h3 className="text-rose-900 font-bold mb-4 flex items-center gap-2">
                      ⚠️ Urgent Care Instructions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-xs font-bold text-rose-700 uppercase">
                          Follow-up Protocol
                        </p>
                        <p className="text-slate-800 text-sm mt-2">
                          {data.follow_up_care_instructions}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-rose-200">
                        <p className="text-xs font-bold text-red-600 uppercase">
                          Emergency Red Flags
                        </p>
                        <p className="text-red-900 text-sm mt-2 font-bold">
                          {data.when_to_seek_immediate_care}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Full Summary Narrative */}
                  <div className="pt-8 border-t border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                      Complete Case Narrative
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed italic bg-slate-50 p-6 rounded-2xl">
                      {/* Handling the " full_conversation_summary" (leading space) in JSON */}
                      {getClinicalValue(data, ["full_conversation_summary"])}
                    </p>
                  </div>
                </div>
              );
            },
          )}
        </section>
      )}{" "}
    </div>
  );
};

export default CallSummary;
