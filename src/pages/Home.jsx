"use client";
import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  const [dataFile, setDataFile] = useState(null);
  const [formatFile, setFormatFile] = useState(null);
  const [soName, setSoName] = useState("");
  const [soErp, setSoErp] = useState("");
  const [week, setWeek] = useState("");
  const [day, setDay] = useState("");
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [totalDistance, setTotalDistance] = useState("");
  const [visitList, setVisitList] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [showVisitList, setShowVisitList] = useState(true);

  // ==========================================
  // Submit route generation form
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dataFile || !formatFile || !soName || !soErp || !week || !day) {
      setError("⚠️ Please fill all fields and upload both files");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    const formData = new FormData();
    formData.append("data_file", dataFile);
    formData.append("format_file", formatFile);
    formData.append("so_name", soName);
    formData.append("so_erp", soErp);
    formData.append("week", week);
    formData.append("day", day);

    try {
      const res = await fetch("http://13.60.105.81:8000/generate-route/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Fetch Map + Visit Order List
  // ==========================================
  const handleViewMap = async () => {
    if (!response || !response.excel_file) {
      setError("⚠️ Please generate the route first.");
      return;
    }
    if (!selectedWeek || !selectedDay) {
      setError("⚠️ Please select week and day to view the map.");
      return;
    }

    setMapLoading(true);
    setError("");
    setMapUrl("");

    try {
      const res = await fetch(
        `http://13.60.105.81:8000/day-summary/?so_name=${encodeURIComponent(
          soName
        )}&week=${selectedWeek}&day=${selectedDay}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Map not found");

      if (data.map_file) {
        setMapUrl(data.map_file);
        setTotalDistance(`📏 Total Distance: ${data.total_distance_km} km`);
        setVisitList(data.visit_list || []);
      } else {
        setMapUrl("");
        setTotalDistance("⚠️ Map not available for this day");
        setVisitList([]);
      }
    } catch (err) {
      setError("❌ Failed to fetch map. Please try again.");
    } finally {
      setMapLoading(false);
    }
  };

  // ==========================================
  // UI Layout
  // ==========================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900 py-10 px-6">
      {/* Loading Overlay */}
      {(loading || mapLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
            <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">
              {loading
                ? "🚀 Generating route, please wait..."
                : "🗺️ Loading map, please wait..."}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 p-10">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8">
          🗺️ Route Planner Dashboard
        </h1>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Upload Data File (input_file_2.xlsx)
            </label>
            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => setDataFile(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Upload Format File (Route Plan Format.xlsx)
            </label>
            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => setFormatFile(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                SO Name
              </label>
              <input
                type="text"
                value={soName}
                onChange={(e) => setSoName(e.target.value)}
                placeholder="e.g., ABHIJITH B"
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                SO ERP ID
              </label>
              <input
                type="text"
                value={soErp}
                onChange={(e) => setSoErp(e.target.value)}
                placeholder="e.g., FU_INGR_805029"
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Week
              </label>
              <input
                type="number"
                min="1"
                max="4"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Day
              </label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
              >
                <option value="">Select</option>
                {["MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 transition-all text-white font-semibold py-3 rounded-xl shadow-md"
          >
            {loading ? "Processing..." : "🚀 Generate Route"}
          </button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>

        {/* Results */}
        {response && (
          <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl text-green-700 font-semibold mb-3">
              ✅ {response.message}
            </h2>

            <a
              href={response.excel_file}
              download
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transform transition-all"
            >
              📥 Download Excel File
            </a>

            {/* Map Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                🗺️ View Map
              </h3>

              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2"
                >
                  <option value="">Select Week</option>
                  {[1, 2, 3, 4].map((w) => (
                    <option key={w} value={w}>
                      Week {w}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2"
                >
                  <option value="">Select Day</option>
                  {["MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleViewMap}
                  disabled={mapLoading}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2 rounded-lg shadow transition-all"
                >
                  {mapLoading ? "Loading..." : "🔍 View Map"}
                </button>
              </div>

              {mapUrl ? (
                <>
                  <iframe
                    src={mapUrl}
                    className="w-full h-[500px] rounded-lg border border-gray-300"
                    title="Route Map"
                  ></iframe>
                  <p className="text-sm text-gray-600 mt-3">{totalDistance}</p>

                  {/* Visit Order List */}
                  {visitList.length > 0 && (
                    <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                      <button
                        onClick={() => setShowVisitList(!showVisitList)}
                        className="w-full text-left px-5 py-3 font-semibold text-gray-700 flex justify-between items-center hover:bg-gray-50 transition"
                      >
                        🧾 Visit Order List ({visitList.length} Outlets)
                        <span className="text-gray-500">
                          {showVisitList ? "▲" : "▼"}
                        </span>
                      </button>

                      {showVisitList && (
                        <ul className="text-sm border-t border-gray-100 p-3 max-h-60 overflow-y-auto">
                          {visitList.map((v) => (
                            <li
                              key={v.VISIT_ORDER}
                              className="py-1 border-b border-gray-100"
                            >
                              #{v.VISIT_ORDER} →{" "}
                              <span className="font-medium">
                                {v.Outlet_Name}
                              </span>{" "}
                              ({v.Latitude.toFixed(3)},{" "}
                              {v.Longitude.toFixed(3)})
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500 italic">
                  Select week & day and click “View Map” to display.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
