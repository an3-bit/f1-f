import React, { useState } from "react";
import axios from "axios";

const Test = () => {
  const [city, setCity] = useState("Nairobi");
  const [sunData, setSunData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setSunData(null);

    try {
      const response = await axios.get(`http://localhost:8000/solar/radiation?city=${city}`);
      setSunData(response.data);
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.detail || "Failed to fetch solar data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Solar Radiation Insights
      </h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter city name"
          className="flex-1 border border-gray-300 px-3 py-2 rounded"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "Loading..." : "Get Solar Data"}
        </button>
      </div>

      {loading && (
        <div className="text-center py-4">
          <p>Fetching solar data for {city}...</p>
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 p-4 bg-red-50 rounded">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {sunData && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            Solar Radiation for {sunData.city} (
            {sunData.latitude.toFixed(2)}, {sunData.longitude.toFixed(2)})
          </h3>
          <p className="mb-4 text-gray-700">
            Annual Average:{" "}
            <strong className="text-green-600">
              {sunData.annual_average} kWh/m²/day
            </strong>
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Month</th>
                  <th className="border px-4 py-2">Radiation (kWh/m²/day)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(sunData.monthly_radiation).map(
                  ([month, radiation]) => (
                    <tr key={month} className="text-center hover:bg-gray-50">
                      <td className="border px-4 py-2">{month}</td>
                      <td className="border px-4 py-2">
                        {radiation.toFixed(2)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Test;
