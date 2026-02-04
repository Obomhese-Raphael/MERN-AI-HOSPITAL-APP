import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CallHistory = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("All Calls");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("Newest first");
  const [lastCursor, setLastCursor] = useState(null); // For pagination (createdAtLt)
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchCalls(false); // Initial fetch
  }, []);

  const fetchCalls = async (isLoadMore = false) => {
    setLoading(true);
    try {
      const privateKey = import.meta.env.VITE_VAPI_PRIVATE_KEY;
      if (!privateKey) {
        throw new Error("VAPI_PRIVATE_KEY not set in .env");
      } 

      const params = { limit: 20 };
      if (isLoadMore && lastCursor) {
        params.createdAtLt = lastCursor; // Fetch older calls
      }

      const res = await axios.get("https://api.vapi.ai/call", {
        headers: {
          Authorization: `Bearer ${privateKey}`,
          "Content-Type": "application/json",
        },
        params,
      });

      const newCalls = res.data || [];
      setCalls((prev) => (isLoadMore ? [...prev, ...newCalls] : newCalls));

      if (isLoadMore && newCalls.length > 0) {
        // Smoothly slide to the top of the page
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        // Optional: Show a toast notification
        const toast = document.createElement("div");
        toast.className =
          "fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-50 transition-opacity duration-300";
        toast.textContent = `Loaded ${newCalls.length} more consultations`;
        document.body.appendChild(toast);

        setTimeout(() => {
          toast.style.opacity = "0";
          setTimeout(() => toast.remove(), 300);
        }, 2000);
      }
      if (newCalls.length > 0) {
        const oldestCall = newCalls[newCalls.length - 1];
        setLastCursor(oldestCall.createdAt);
        setHasMore(newCalls.length === 20);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load calls:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to load call history");
    } finally {
      setLoading(false);
    }
  };

  // Compute tab counts
  const tabCounts = {
    "All Calls": calls.length,
    Completed: calls.filter((call) => call.status === "ended").length,
    Urgent: calls.filter(
      (call) =>
        call.endedReason?.includes("emergency") ||
        call.endedReason?.includes("red-flag"),
    ).length,
    "Follow-ups": calls.filter(
      (call) =>
        call.transcript?.toLowerCase().includes("follow-up") || call.cost > 2, // Placeholder logic
    ).length,
  };

  // Filtered & Sorted Calls
  const getFilteredCalls = () => {
    let filtered = calls.filter((call) => {
      const matchesSearch =
        call.transcript?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        call.id.includes(searchQuery);

      switch (activeTab) {
        case "Completed":
          return call.status === "ended" && matchesSearch;
        case "Urgent":
          return (
            (call.endedReason?.includes("emergency") ||
              call.artifact?.structuredOutputs?.[
                Object.keys(call.artifact.structuredOutputs)[0]
              ]?.result?.urgency_level?.toLowerCase() === "urgent") &&
            matchesSearch
          );
        case "Follow-ups":
          return (
            (call.transcript?.toLowerCase().includes("follow-up") ||
              call.cost > 2) && // Placeholder
            matchesSearch
          );
        default:
          return matchesSearch;
      }
    });

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.startedAt);
      const dateB = new Date(b.startedAt);
      return sortOrder === "Newest first" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  const filteredCalls = getFilteredCalls();

  const formatDate = (iso) =>
    new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const getDuration = (start, end) => {
    if (!start || !end) return "N/A";
    const diff = (new Date(end) - new Date(start)) / 1000 / 60;
    return `${Math.floor(diff)} min ${Math.round((diff % 1) * 60)} sec`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Error Loading History
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Consultation History
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              {calls.length} total consultations • Last activity:{" "}
              {calls[0] ? formatDate(calls[0].startedAt) : "N/A"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by ID or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Newest first</option>
              <option>Oldest first</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {["All Calls", "Completed", "Urgent", "Follow-ups"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 font-medium text-sm border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full font-normal">
                  {tabCounts[tab] || 0}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Call List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white border rounded-xl p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))
          ) : filteredCalls.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-500 bg-white rounded-xl border">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No consultations found
              </h3>
              <p className="mt-1">
                Try a different filter or start a new consultation.
              </p>
            </div>
          ) : (
            filteredCalls.map((call) => (
              <Link
                key={call.id}
                to={`/hospital-call/${call.id}/summary`}
                data-call-card
                className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200 group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-mono text-gray-500 truncate">
                      {call.id.slice(0, 8)}...
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        call.status === "ended"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {call.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {formatDate(call.startedAt)}
                  </h3>

                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Duration:</strong>{" "}
                      {getDuration(call.startedAt, call.endedAt)}
                    </p>
                    <p>
                      <strong>Cost:</strong> ${call.cost?.toFixed(4) || "N/A"}
                    </p>
                    {call.endedReason && (
                      <p>
                        <strong>Ended:</strong>{" "}
                        {call.endedReason.replace(/-/g, " ")}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end mt-4">
                    <span className="inline-flex items-center text-blue-600 group-hover:text-blue-800 font-medium transition-colors">
                      View Summary <span className="ml-2">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Load More */}
        {hasMore && !loading && (
          <div className="text-center mt-10">
            <button
              onClick={() => fetchCalls(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition font-medium"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallHistory;
