import React from 'react';

export default function Panel({ title, buttonText, onClick }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <button
        className="mt-auto bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
        onClick={onClick}
      >
        {buttonText}
      </button>
    </div>
  );
}