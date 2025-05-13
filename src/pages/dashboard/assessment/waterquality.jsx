import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Info } from 'lucide-react';

export default function WaterQualityAssessment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [waterSource, setWaterSource] = useState('');
  const [sections, setSections] = useState({
    client: false,
    occupancy: false,
    waterQuality: false
  });

  const returnTo = location.state?.returnTo || '/assessment-dashboard';
  const sectionKey = location.state?.sectionKey || 'waterQuality';

  // Calculate completion percentage
  const completion = (Object.values(sections).filter(Boolean).length / Object.values(sections).length) * 100;

  useEffect(() => {
    // Load saved sections and selected water source from localStorage
    const savedSections = localStorage.getItem('assessmentSections');
    const savedWaterSource = localStorage.getItem('selectedWaterSource');
    
    if (savedSections) {
      const parsed = JSON.parse(savedSections);
      setSections(parsed);
    }
    
    if (savedWaterSource) {
      setWaterSource(savedWaterSource);
    }
  }, []);

  const handleWaterSelection = (source) => {
    setWaterSource(source);
    
    // Save to localStorage
    localStorage.setItem('selectedWaterSource', source);
    
    // Update sections status
    const updatedSections = { ...sections, waterQuality: true };
    localStorage.setItem('assessmentSections', JSON.stringify(updatedSections));
    setSections(updatedSections);
  };

  // Handler functions for navigation
  const handleNextStep = () => {
    if (waterSource) {
      navigate('/review-assessment', {
        state: {
          returnTo: returnTo
        }
      });
    } else {
      alert('Please select a water source to continue');
    }
  };

  const handleBackToOccupancy = () => {
    navigate('/occupancy', {
      state: {
        returnTo: returnTo,
        sectionKey: 'occupancy'
      }
    });
  };

  // Handler functions for sidebar navigation
  const handleClientSelect = () => {
    navigate('/client-selection', {
      state: {
        returnTo: '/assessment-dashboard',
        sectionKey: 'client'
      }
    });
  };

  const handleOccupancyDetails = () => {
    navigate('/occupancy', {
      state: {
        returnTo: '/assessment-dashboard',
        sectionKey: 'occupancy'
      }
    });
  };

  const handleWaterQuality = () => {
    navigate('/water-quality', {
      state: {
        returnTo: '/assessment-dashboard',
        sectionKey: 'waterQuality'
      }
    });
  };

  const resetProgress = () => {
    localStorage.removeItem('assessmentSections');
    localStorage.removeItem('selectedClient');
    localStorage.removeItem('selectedOccupants');
    localStorage.removeItem('selectedWaterSource');
    setSections({
      client: false,
      occupancy: false,
      waterQuality: false
    });
    setWaterSource('');
  };

  const saveProgress = () => {
    // Already saving to localStorage in other functions
    alert('Progress saved successfully!');
  };

  const handleGenerateRecommendations = () => {
    navigate('/recommendations');
  };

  // Computed property for enabling/disabling the generate recommendations button
  const canGenerateRecommendations = completion >= 66; // At least 2 sections completed

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-orange-500 mr-2">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              </div>
            </div>
            <span className="font-bold text-lg">AI Solar Water Assistant</span>
          </div>
          <nav className="flex items-center space-x-4">
            {[
              { label: 'Triage & Sizing', path: '/assessment-dashboard' },
              { label: 'Future Expansion', path: '/assessment-dashboard' },
              { label: 'Sales Quote', path: '/quote1' },
              { label: 'Proposals', path: '/proposal-generation' },
            ].map(({ label, path }) => (
              <a
                key={label}
                href="#"
                onClick={(e) => { e.preventDefault(); navigate(path); }}
                className="px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="text-gray-700">John Doe (Local Mode)</div>
        </div>
      </header>

      {/* Dashboard Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Assessment Dashboard</h1>
            <p className="text-gray-600">Configure solar hot water system requirements</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={resetProgress}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center"
            >
              Reset Progress
            </button>
            <button 
              onClick={saveProgress}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              Save Progress
              <svg className="ml-1 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="17 21 17 13 7 13 7 21" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="7 3 7 8 15 8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              onClick={handleGenerateRecommendations}
              className={`${canGenerateRecommendations 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-gray-400 cursor-not-allowed'} text-white px-4 py-2 rounded-md flex items-center`}
              disabled={!canGenerateRecommendations}
            >
              Generate Recommendations
              <svg className="ml-1 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="container mx-auto">
        <div className="grid grid-cols-4 mb-6 border-b">
          <div
            className="text-center py-4 cursor-pointer border-b-2 border-transparent hover:border-blue-500 hover:text-blue-500"
            onClick={() => navigate('/assessment-dashboard')}
          >
            Overview
          </div>
          <div
            className={`text-center py-4 cursor-pointer border-b-2 ${sections.client ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'} hover:border-blue-500 hover:text-blue-500`}
            onClick={handleClientSelect}
          >
            Client
          </div>
          <div
            className={`text-center py-4 cursor-pointer border-b-2 ${sections.occupancy ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'} hover:border-blue-500 hover:text-blue-500`}
            onClick={handleOccupancyDetails}
          >
            Occupancy
          </div>
          <div
            className={`text-center py-4 cursor-pointer border-b-2 ${sections.waterQuality ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'} hover:border-blue-500 hover:text-blue-500`}
            onClick={handleWaterQuality}
          >
            Water Quality
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 flex flex-1">
        {/* Assessment Progress Sidebar */}
        <div className="w-full lg:w-80 bg-white p-6 rounded-lg shadow-sm border border-gray-200 mr-6">
          <h2 className="text-xl font-bold mb-2">Assessment Progress</h2>
          <p className="text-gray-600 mb-4">Complete all sections</p>

          <div className="flex justify-between items-center mb-2">
            <span>Completion</span>
            <span>{completion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            ></div>
          </div>

          <div className="space-y-4">
            {[
              {
                key: 'client',
                label: 'Client Selection',
                desc: 'Select a client',
                status: sections.client,
                onClick: handleClientSelect,
              },
              {
                key: 'occupancy',
                label: 'Occupancy Details',
                desc: 'Enter occupancy',
                status: sections.occupancy,
                onClick: handleOccupancyDetails,
              },
              {
                key: 'waterQuality',
                label: 'Water Quality',
                desc: 'Select water type',
                status: sections.waterQuality,
                onClick: handleWaterQuality,
              }
            ].map(({ key, label, desc, status, onClick }) => (
              <div
                key={key}
                className={`border ${status ? 'border-green-200 bg-green-50' : 'border-gray-200'} rounded-md p-4 cursor-pointer hover:shadow-sm transition`}
                onClick={onClick}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full ${status ? 'bg-green-100' : 'bg-blue-100'} flex items-center justify-center mr-3`}>
                      {status ? (
                        <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="9" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{label}</h3>
                      <p className="text-gray-500 text-sm">{status ? `${label} completed` : desc}</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/assessment-dashboard')}
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center justify-center"
          >
            {completion === 100 ? 'Review All Sections' : 'Complete All Sections'}
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-1">Water Quality Information</h2>
              <p className="text-gray-600 mb-6">Details about water quality and source</p>

              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-4">Water Hardness / Quality</h3>
                <div className="space-y-4">
                  {['Pretreated Water', 'City Council Water', 'Borehole Water'].map((source) => (
                    <div 
                      key={source} 
                      className={`flex items-center border ${waterSource === source ? 'border-blue-200 bg-blue-50' : 'border-gray-200'} rounded-md p-4 hover:border-blue-200 cursor-pointer transition-colors`}
                      onClick={() => handleWaterSelection(source)}
                    >
                      <input
                        id={source}
                        type="radio"
                        name="waterSource"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        checked={waterSource === source}
                        onChange={() => handleWaterSelection(source)}
                      />
                      <label htmlFor={source} className="ml-3 text-sm font-medium text-gray-700 cursor-pointer flex-grow">
                        {source}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-md p-4 mb-6">
                <div className="flex space-x-3">
                  <div className="mt-0.5">
                    <Info className="text-amber-600" size={18} />
                  </div>
                  <div>
                    <h4 className="font-medium text-amber-800 mb-2">Water Quality Considerations</h4>
                    <p className="text-amber-700 text-sm mb-2">
                      Water quality affects system performance and longevity. Hard water may require additional treatment or specific system components to prevent scale buildup and ensure optimal performance of your solar hot water system.
                    </p>
                    <p className="text-amber-700 text-sm font-medium">
                      Note: Pretreated or City Council water typically works with direct systems, while Borehole water usually requires an indirect system with a heat exchanger.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  className="px-5 py-2 border rounded text-gray-700 hover:bg-gray-50"
                  onClick={handleBackToOccupancy}
                >
                  Back to Occupancy
                </button>
                <button
                  className={`flex items-center px-5 py-2 ${
                    waterSource ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
                  } text-white rounded`}
                  disabled={!waterSource}
                  onClick={handleNextStep}
                >
                  Next: Review Assessment
                  <ArrowRight className="ml-2" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}