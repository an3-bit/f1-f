import React from 'react';
import Panel from '../../../components/panel/Panel';

import ClientSelection from '../assessment/ClientSelection';
import OccupancyDetails from './occupancy';
import WaterQualityAssesment from './waterquality';

export default function Assessment() {
  return (
    <div className="min-h-screen bg-white p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Assessment Dashboard</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Generate Recommendations →
        </button>
      </header>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Panel title="Client" buttonText="Select Client" onClick={() => {ClientSelection}} />
        <Panel title="Building & Occupancy" buttonText="Add Details" onClick={() => {OccupancyDetails}} />
        <Panel title="Water Quality" buttonText="Specify Water Quality" onClick={() => {WaterQualityAssesment}} />
      </div>

      <div className="mt-12 p-6 bg-gray-100 rounded-lg flex items-center">
        <p className="flex-1 text-gray-600">Assessment Incomplete. Please complete all required sections to generate recommendations.</p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => window.location.href = '/'}
        >
          Start Assessment →
        </button>
      </div>
    </div>
  );
}
