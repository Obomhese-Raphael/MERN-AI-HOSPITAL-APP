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
  const [lastCursor, setLastCursor] = useState(null); // For pagination
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
        // Smoothly slide to the top of the page after loading more
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

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
        call.artifact?.structuredOutputs?.[
          Object.keys(call.artifact?.structuredOutputs || {})[0]
        ]?.result?.urgency_level?.toLowerCase() === "urgent"
    ).length,
    "Follow-ups": calls.filter(
      (call) =>
        call.transcript?.toLowerCase().includes("follow-up") || call.cost > 2
    ).length,
  };

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
                Object.keys(call.artifact?.structuredOutputs || {})[0]
              ]?.result?.urgency_level?.toLowerCase() === "urgent") &&
            matchesSearch
          );
        case "Follow-ups":
          return (
            (call.transcript?.toLowerCase().includes("follow-up") ||
              call.cost > 2) &&
            matchesSearch
          );
        default:
          return matchesSearch;
      }
    });

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
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading History</h2>
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
    <div className="min-h-screen bg-gray-50 py-6 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div className="w-full lg:w-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              Consultation History
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              {calls.length} total consultations • Last activity:{" "}
              {calls[0] ? formatDate(calls[0].startedAt) : "N/A"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search by ID or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 text-sm shadow-sm"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-xl px-5 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm cursor-pointer"
            >
              <option>Newest first</option>
              <option>Oldest first</option>
            </select>
          </div>
        </div>

        {/* Tabs - Mobile Responsive with horizontal scroll */}
        <div className="border-b border-gray-200 mb-8 overflow-x-auto scrollbar-hide">
          <nav className="flex space-x-4 md:space-x-8 min-w-max pb-1">
            {["All Calls", "Completed", "Urgent", "Follow-ups"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tabCounts[tab] || 0}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Call List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {loading && !calls.length ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))
          ) : filteredCalls.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-500 bg-white rounded-xl border">
              <h3 className="text-lg font-medium text-gray-900">No consultations found</h3>
              <p className="mt-1 text-sm text-gray-400">Try a different filter or search term.</p>
            </div>
          ) : (
            filteredCalls.map((call) => (
              <Link
                key={call.id}
                to={`/hospital-call/${call.id}/summary`}
                className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-200 group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-gray-400 truncate">
                      {call.id.slice(0, 12)}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        call.status === "ended"
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                      }`}
                    >
                      {call.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {formatDate(call.startedAt)}
                  </h3>

                  <div className="space-y-2 text-xs text-gray-600 border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Duration</span>
                      <span className="font-semibold">{getDuration(call.startedAt, call.endedAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Cost</span>
                      <span className="font-semibold text-gray-900">
                        ${call.cost?.toFixed(3) || "0.000"}
                      </span>
                    </div>
                    {call.endedReason && (
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-medium">End Reason</span>
                        <span className="text-gray-500 truncate ml-4 capitalize">
                          {call.endedReason.replace(/-/g, " ")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <span className="inline-flex items-center text-xs text-blue-600 group-hover:text-blue-800 font-bold transition-colors">
                      VIEW SUMMARY <span className="ml-1.5">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-12 pb-8">
            <button
              onClick={() => fetchCalls(true)}
              disabled={loading}
              className="bg-white border-2 border-blue-600 text-blue-600 px-10 py-3 rounded-full hover:bg-blue-600 hover:text-white transition-all font-bold text-sm shadow-sm disabled:opacity-50"
            >
              {loading ? "LOADING..." : "LOAD MORE"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallHistory;