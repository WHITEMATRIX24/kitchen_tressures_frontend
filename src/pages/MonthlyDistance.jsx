"use client";
import React, { useState } from "react";

export default function MonthlyDistance() {
  const [dataFile, setDataFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setError("");
    setResult(null);
    setDataFile(e.target.files[0] || null);
  };

  const formatNumber = (v) => {
    if (v === null || v === undefined || v === "") return "-";
    const n = Number(v);
    return Number.isFinite(n) ? n.toFixed(2) : "-";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dataFile) {
      setError("⚠️ Please upload the monthly visited shops Excel file.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("data_file", dataFile);

    // Abort if request takes longer than 60s
    const controller = new AbortController();
    const timeoutMs = 60000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      console.log("Uploading file:", dataFile.name);
      const res = await fetch("http://13.60.105.81:8000/monthly-distance/", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        const text = await res.text().catch(() => "");
        throw new Error(
          `Server returned non-JSON response: ${text || res.statusText}`
        );
      }

      if (!res.ok) {
        console.error("Server error response:", data);
        throw new Error(data.message || `Failed to process file (status ${res.status})`);
      }

      console.log("Monthly distance response:", data);
      setResult(data);
    } catch (err) {
      console.error("Upload failed:", err);
      if (err.name === "AbortError") {
        setError(
          "Request timed out after 60 seconds. The file may be large — try a smaller sample first."
        );
      } else {
        setError(err.message || "Failed to process file.");
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const clearFile = () => {
    setDataFile(null);
    setError("");
    setResult(null);
    // also clear the native input by resetting value via re-rendering input (handled by not controlling value here)
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-6 text-gray-800">
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
            <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">
              🧮 Calculating monthly distance... please wait
            </p>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 p-10">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8">
          📅 Monthly Distance Calculator
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Upload Route Output File (Excel)
            </label>

            <div className="flex items-center gap-3">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50"
              />
              {dataFile && (
                <button
                  type="button"
                  onClick={clearFile}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100"
                >
                  Clear
                </button>
              )}
            </div>

            {dataFile && (
              <p className="mt-2 text-sm text-gray-500">
                Selected file: <span className="font-medium">{dataFile.name}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 transition-all text-white font-semibold py-3 rounded-xl shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "🚀 Calculate Monthly Distance"}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center font-medium">{error}</p>
          )}
        </form>

        {/* Results */}
        {result && result.status === "success" && (
          <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              ✅ Monthly Distance Calculated
            </h2>

            {/* Summary Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-3 py-2 text-left">
                      SO NAME
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left">
                      ERP ID
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-right">
                      TOTAL MONTHLY DISTANCE (KM)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(result.summary || []).map((row, i) => (
                    <tr key={i} className="hover:bg-gray-100 transition-colors">
                      <td className="border border-gray-300 px-3 py-2">
                        {row["SO NAME"] ?? "-"}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {row["SO_ERP_ID"] ?? "-"}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-right font-semibold text-blue-700">
                        {formatNumber(row["TOTAL_MONTHLY_DISTANCE_KM"])} km
                      </td>
                    </tr>
                  ))}
                  {(!result.summary || result.summary.length === 0) && (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-gray-500">
                        No summary rows returned.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Daily Breakdown */}
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              📅 Daily Distance Breakdown
            </h3>
            <div className="overflow-y-auto max-h-80 border border-gray-200 rounded-lg">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="border border-gray-200 px-3 py-2 text-left">Week</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Day</th>
                    <th className="border border-gray-200 px-3 py-2 text-right">Distance (km)</th>
                  </tr>
                </thead>
                <tbody>
                  {(result.daily_breakdown || []).map((row, i) => (
                    <tr key={i} className="hover:bg-gray-100">
                      <td className="border border-gray-200 px-3 py-2">{row["WEEK"] ?? "-"}</td>
                      <td className="border border-gray-200 px-3 py-2">{row["DAY"] ?? "-"}</td>
                      <td className="border border-gray-200 px-3 py-2 text-right text-gray-700">
                        {formatNumber(row["DISTANCE_KM"])} km
                      </td>
                    </tr>
                  ))}
                  {(!result.daily_breakdown || result.daily_breakdown.length === 0) && (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-gray-500">
                        No daily breakdown returned.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Server-side error message */}
        {result && result.status === "error" && (
          <p className="text-red-600 mt-4 font-semibold text-center">❌ {result.message}</p>
        )}
      </div>
    </div>
  );
}
