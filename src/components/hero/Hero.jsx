import React from "react";
import { useNavigate } from "react-router-dom";
const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-b from-secondary_blue to-white py-28 px-6 flex flex-col sm:flex-col md:flex-row justify-center ">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-6xl font-semibold text-gray-900">
          Solar Hot Water System Assistant
        </h1>
        <p className="text-gray-600 mt-4 text-xl">
          Streamline your triaging, sizing, and quotation process with our
          AI-powered solution for solar hot water systems.
        </p>
        <div className="mt-6 flex justify-start gap-4">
          <button onClick={() => navigate('/system-advisor')} className="bg-primary_yellow text-white px-5 py-2 rounded-lg font-medium hover:opacity-85">
            Start Triaging
          </button>
          <button onClick={() => navigate('/product-manual')} className="bg-white text-gray-900 border border-gray-300 px-5 py-2 rounded-lg font-medium hover:bg-gray-200">
            Check Product Manual
          </button>
        </div>
      </div>

      <div className="mt-12 bg-gradient-to-tr from-white via-white to-red-100 shadow-lg rounded-xl p-7 md:min-w-7xl max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center p-4 border rounded-lg">
          <span className="text-orange-500 text-3xl">☀️</span>
          <h3 className="font-semibold text-lg mt-3">Solar Triaging</h3>
          <p className="text-gray-500 text-sm text-center">
            Intelligent assessment of customer needs
          </p>
        </div>

        <div className="flex flex-col items-center p-4 border rounded-lg">
          <span className="text-blue-500 text-3xl">📊</span>
          <h3 className="font-semibold text-lg mt-3">System Sizing</h3>
          <p className="text-gray-500 text-sm text-center">
            Precise calculations for optimal performance
          </p>
        </div>

        <div className="flex flex-col items-center p-4 border rounded-lg">
          <span className="text-blue-400 text-3xl">💧</span>
          <h3 className="font-semibold text-lg mt-3">Smart Quotation</h3>
          <p className="text-gray-500 text-sm text-center">
            Automated product selection and pricing
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
