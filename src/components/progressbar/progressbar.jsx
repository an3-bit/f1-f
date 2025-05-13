import React from 'react';
import { useState } from 'react';
import { ArrowRight, Info } from 'lucide-react';
const ProgressBar = ({ progress }) => {
    return (
      <div className="mb-6">
        <h2 className="text-lg font-medium text-blue-800 mb-1">Complete all sections</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">Completion {progress}%</p>
      </div>
    );
  };
  
  export default ProgressBar;