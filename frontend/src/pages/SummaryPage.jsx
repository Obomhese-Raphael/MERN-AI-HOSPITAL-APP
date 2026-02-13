import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { isUuidV4 } from "../utils/vapi-client";

const CallSummary = () => {
  const { callId } = useParams();

  const [callData, setCallData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const VAPI_PRIVATE_KEY = import.meta.env.VITE_VAPI_PRIVATE_KEY;

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
        const vapiUrl = `https://api.vapi.ai/call/${cleanCallId}`;
        const response = await fetch(vapiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${VAPI_PRIVATE_KEY}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `VAPI returned ${response.status}: ${response.statusText}`,
          );
        }

        const data = await response.json();
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

  const getClinicalValue = (data, possibleKeys) => {
    if (!data) return null;
    const actualKey = Object.keys(data).find((k) =>
      possibleKeys.includes(k.trim().toLowerCase()),
    );
    return data[actualKey];
  };

  // Helper to make "AI Doctor:" and "You:" bold in the transcript string
  const formatTranscript = (text) => {
    if (!text) return null;
    const parts = text.split(/(AI Doctor:|You:)/g);
    return parts.map((part, i) =>
      part === "AI Doctor:" || part === "You:" ? (
        <strong key={i} className="text-gray-900 font-bold">
          {part}
        </strong>
      ) : (
        part
      ),
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">
            Loading consultation summary...
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
          <p className="text-gray-700 mb-6">{error || "No data available."}</p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const { transcript = "", cost, startedAt, endedAt } = callData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Optimized Header for Mobile */}
        <div className="bg-blue-600 text-white p-5 md:p-8">
          <h1 className="text-xl md:text-3xl font-bold leading-tight">
            Consultation Summary
          </h1>
          <p className="mt-2 opacity-90 font-mono text-[10px] md:text-sm break-all leading-relaxed">
            Call ID: {callId}
          </p>
          <p className="text-xs md:text-sm mt-1">
            Duration:{" "}
            {startedAt && endedAt
              ? `${((new Date(endedAt) - new Date(startedAt)) / 60000).toFixed(1)} min`
              : "N/A"}
          </p>
        </div>

        <div className="p-5 md:p-8 space-y-8">
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
              Conversation Transcript
            </h2>
            <div className="bg-gray-50 p-4 md:p-5 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
              {transcript ? (
                <p className="text-gray-700 whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                  {formatTranscript(transcript)}
                </p>
              ) : (
                <p className="text-gray-600 italic">
                  No transcript available yet.
                </p>
              )}
            </div>
          </section>

          <section className="text-xs md:text-sm text-gray-600 space-y-2">
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

          {callData.recordingUrl && (
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
                Call Recording
              </h2>
              <audio controls className="w-full h-10 md:h-12">
                <source src={callData.recordingUrl} type="audio/wav" />
              </audio>
            </section>
          )}
        </div>

        {/* Updated Buttons: Home & Summary on Mobile */}
        <div className="p-5 md:p-6 bg-gray-50 border-t flex justify-center gap-3">
          <Link
            to="/"
            className="flex-1 max-w-[140px] text-center px-4 py-3 bg-purple-600 text-white rounded-full font-bold text-sm shadow-md transition-all hover:bg-purple-700"
          >
            Back to Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 max-w-[140px] px-4 py-3 bg-blue-600 text-white rounded-full font-bold text-sm shadow-md transition-all hover:bg-blue-700"
          >
            <span className="sm:inline">Refresh </span>
          </button>
        </div>
      </div>

      {/* 📋 Clinical Record Section */}
      {callData?.artifact?.structuredOutputs && (
        <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-8 shadow-sm mt-8 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-3">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-blue-600">📋</span> Clinical Record
            </h2>

            {Object.values(callData.artifact.structuredOutputs || {}).map(
              (output, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
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

          {Object.entries(callData.artifact.structuredOutputs || {}).map(
            ([id, output]) => {
              const data = output.result;
              if (!data) return null;

              return (
                <div key={id} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Patient Name
                      </p>
                      <p className="text-lg font-bold text-slate-800 truncate">
                        {data.patient_name || "N/A"}
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
                        Appt Time
                      </p>
                      <p className="text-lg font-bold text-slate-800">
                        {data.appointment_time || "TBD"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                      <h3 className="text-sm font-black text-blue-900 uppercase tracking-tighter mb-3">
                        Presenting Complaint
                      </h3>
                      <p className="text-slate-700 leading-relaxed text-sm md:text-base">
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
                      <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                        {data.symptoms_described}
                      </p>
                    </div>
                  </div>

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
                          {data.follow_up_care_instructuons}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-sm">
                        <p className="text-xs font-bold text-red-600 uppercase">
                          Emergency Red Flags
                        </p>
                        <p className="text-red-900 text-sm mt-2 font-bold">
                          {data.when_to_seek_immediate_care}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                      Complete Case Narrative
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed italic bg-slate-50 p-6 rounded-2xl">
                      {getClinicalValue(data, ["full_conversation_summary"])}
                    </p>
                  </div>
                </div>
              );
            },
          )}
        </section>
      )}
    </div>
  );
};

export default CallSummary;
