import React from 'react';

export default function Card({ title, description, buttonText, onClick }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-500 mb-4">{description}</p>
      </div>
      <button
        className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        onClick={onClick}
      >
        {buttonText} →
      </button>
    </div>
  );
}
