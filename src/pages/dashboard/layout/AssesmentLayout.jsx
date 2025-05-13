// src/layouts/AssessmentLayout.jsx
import React from 'react';
import Header from '../../../components/header/Header';
import { Outlet } from 'react-router-dom';

const AssessmentLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="p-6">
        {/* Sidebar Navigation Tabs */}
        <div className="grid grid-cols-4 mb-6 border-b">
          <div className="text-center py-4 cursor-pointer border-b-2 border-blue-500 text-blue-500">
            Overview
          </div>
          <div className="text-center py-4 cursor-pointer hover:text-blue-500 hover:border-blue-500 border-b-2 border-transparent">
            Client
          </div>
          <div className="text-center py-4 cursor-pointer hover:text-blue-500 hover:border-blue-500 border-b-2 border-transparent">
            Occupancy
          </div>
          <div className="text-center py-4 cursor-pointer hover:text-blue-500 hover:border-blue-500 border-b-2 border-transparent">
            Water Quality
          </div>
        </div>

        {/* This is where child routes like /client-selection, /occupancy-details will load */}
        <Outlet />
      </div>
    </div>
  );
};

export default AssessmentLayout;
