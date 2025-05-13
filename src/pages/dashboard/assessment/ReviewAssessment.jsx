import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, User, Building, Droplet, Sun, CircleHelp, Settings as SettingsIcon, LogOut } from 'lucide-react';

export default function AssessmentReview() {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(null);
  const [occupancyData, setOccupancyData] = useState(null);
  const [waterQualityData, setWaterQualityData] = useState(null);
  const [sections, setSections] = useState({
    client: false,
    occupancy: false,
    waterQuality: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate completion percentage based on completed sections
  const completion = Math.round(
    (Object.values(sections).filter(Boolean).length / Object.values(sections).length) * 100
  );

  useEffect(() => {
    // Load data from localStorage
    loadClientData();
    loadOccupancyData();
    loadWaterQualityData();
    loadSectionsStatus();
  }, []);

  const loadClientData = () => {
    const savedClient = localStorage.getItem('selectedClient');
    if (savedClient) {
      setClientData(JSON.parse(savedClient));
    }
  };

  const loadOccupancyData = () => {
    const savedOccupancy = localStorage.getItem('occupancyData');
    if (savedOccupancy) {
      setOccupancyData(JSON.parse(savedOccupancy));
    }
  };

  const loadWaterQualityData = () => {
    const savedWaterQuality = localStorage.getItem('waterQualityData');
    if (savedWaterQuality) {
      setWaterQualityData(JSON.parse(savedWaterQuality));
    }
  };

  const loadSectionsStatus = () => {
    const savedSections = localStorage.getItem('assessmentSections');
    if (savedSections) {
      setSections(JSON.parse(savedSections));
    }
  };

  const handleClientSelect = () => {
    navigate('/client-selection', { 
      state: { 
        returnTo: '/assessment-review',
        sectionKey: 'client'
      } 
    });
  };

  const handleOccupancyDetails = () => {
    navigate('/occupancy-details', { 
      state: { 
        returnTo: '/assessment-review',
        sectionKey: 'occupancy'
      } 
    });
  };

  const handleWaterQuality = () => {
    navigate('/water-quality', { 
      state: { 
        returnTo: '/assessment-review',
        sectionKey: 'waterQuality'
      } 
    });
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleGenerateRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Prepare the data for the API endpoint
      const recommendationData = {
        propertyType: occupancyData?.buildingType || "Residential",
        occupants: occupancyData?.occupants || "4",
        budget: clientData?.budget || "Medium",
        location: clientData?.location || "Urban",
        existingSystem: clientData?.existingSystem || "None",
        timeline: clientData?.timeline || "3-6 months",
        waterSource: waterQualityData?.source || "Municipal Water",
        electricitySource: clientData?.electricitySource || "Grid"
      };
      
      // Make the API call
      const response = await fetch('https://f1-backend-t9zk.onrender.com/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recommendationData),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const recommendationResult = await response.json();
      
      // Save both the request data and the response
      const assessmentData = {
        client: clientData,
        occupancy: occupancyData,
        waterQuality: waterQualityData,
        recommendationRequest: recommendationData,
        recommendationResponse: recommendationResult,
        completedAt: new Date().toISOString()
      };
      
      localStorage.setItem('fullAssessmentData', JSON.stringify(assessmentData));
      
      // Navigate to recommendations page
      navigate('/recommendations');
    } catch (err) {
      console.error("Error generating recommendations:", err);
      setError("Failed to generate recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const [userName, setUserName] = useState('');
  const [userInitials, setUserInitials] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
    
  useEffect(() => {
    // Check if user is logged in and get user data from localStorage
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name);
      // Create initials from name (e.g. John Doe -> JD)
      const initials = name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase();
      setUserInitials(initials);
    } else {
      // Redirect to login if not logged in
      navigate('/login', { replace: true });
    }
  }, [navigate]);
    
  const handleSignOut = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    
    // Redirect to login page
    navigate('/', { replace: true });
  };
  
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };
    
  const goToProfile = () => navigate('/profile');
  const goToSettings = () => navigate('/settings');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Left side - Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-2">
                  <div className="text-blue-500">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  </div>
                </div>
                <span className="font-medium text-lg text-white">AI Solar Water Dashboard</span>
              </div>
            </div>
            
            {/* Middle - Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <a 
                href="/home1" 
                className="px-3 py-2 text-white hover:bg-blue-700 rounded-md transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/home1');
                }}
              >
                <span>Dashboard</span>
              </a>
              <a 
                href="/assessment-dashboard" 
                className="px-3 py-2 text-white hover:bg-blue-700 rounded-md transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/assessment-dashboard');
                }}
              >
                <span>Triage & Sizing</span>
              </a>
              <a 
                href="/solar-system-expansion-planner" 
                className="px-3 py-2 text-white hover:bg-blue-700 rounded-md transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/solar-system-expansion-planner');
                }}
              >
                <span>Future Expansion</span>
              </a>
              <a 
                href="/quote1" 
                className="px-3 py-2 text-white hover:bg-blue-700 rounded-md transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/quote1');
                }}
              >
                <span>Sales Quote</span>
              </a>
              <a 
                href="/proposal-generation" 
                className="px-3 py-2 text-white hover:bg-blue-700 rounded-md transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/proposal-generation');
                }}
              >
                <span>Proposals</span>
              </a>
            </nav>
            
            {/* Right side - User profile */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span className="mr-2">{userName}</span>
                <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center">
                  <span className="text-white font-medium">{userInitials}</span>
                </div>
              </button>
              
              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <button
                    onClick={goToProfile}
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </button>
                  <button
                    onClick={goToSettings}
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Settings
                  </button>
                  <div className="border-t border-gray-100"></div>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Assessment Review</h1>
              <p className="text-gray-600">Review your solar hot water system requirements</p>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full border border-gray-300">
                <CircleHelp className="h-5 w-5 text-gray-500" />
              </button>
              <button 
                className={`bg-black text-white px-4 py-2 rounded flex items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={handleGenerateRecommendations}
                disabled={completion < 100 || isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate Recommendations'}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error message if API call fails */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Main Grid Layout */}
          <div className="grid grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="col-span-1">
              {/* Assessment Progress Card */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold mb-1">Assessment Progress</h2>
                <p className="text-gray-600 text-sm mb-4">Complete all sections</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completion</span>
                    <span>{completion}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-500 rounded-full transition-all duration-500" 
                      style={{ width: `${completion}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    {
                      key: 'client',
                      label: 'Client Selection',
                      desc: sections.client ? 'Client selected' : 'Select a client',
                      onClick: handleClientSelect,
                    },
                    {
                      key: 'occupancy',
                      label: 'Occupancy Details',
                      desc: sections.occupancy ? 
                        `${occupancyData?.occupants || '0'} occupants` : 
                        'Enter occupancy',
                      onClick: handleOccupancyDetails,
                    },
                    {
                      key: 'waterQuality',
                      label: 'Water Quality',
                      desc: sections.waterQuality ? 
                        `${waterQualityData?.source || 'Selected'}` : 
                        'Select water type',
                      onClick: handleWaterQuality,
                    }
                  ].map(({ key, label, desc, onClick }) => (
                    <div 
                      key={key}
                      onClick={onClick}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center">
                        {sections[key] ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border border-gray-300 mr-2"></div>
                        )}
                        <div>
                          <div className="font-medium">{label}</div>
                          <div className="text-sm text-gray-500">{desc}</div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
                
                <button 
                  className={`w-full py-3 rounded mt-6 ${
                    completion === 100 && !isLoading
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={completion < 100 || isLoading}
                  onClick={handleGenerateRecommendations}
                >
                  {isLoading ? 'Processing...' : completion === 100 ? 'Generate Recommendations' : 'Complete All Sections'}
                </button>
              </div>
              
              {/* User Info Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-4">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-bold">{userName || 'John Doe'}</div>
                    <div className="text-sm text-gray-500">Residential Solutions</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content Area - 3 columns */}
            <div className="col-span-3">
              {/* Tabs */}
              <div className="flex mb-6">
                <div 
                  className="px-8 py-3 text-gray-500 cursor-pointer"
                  onClick={() => navigate('/assessment-dashboard')}
                >
                  Overview
                </div>
                <div 
                  className="px-8 py-3 text-gray-500 cursor-pointer"
                  onClick={handleClientSelect}
                >
                  Client
                </div>
                <div 
                  className="px-8 py-3 text-gray-500 cursor-pointer"
                  onClick={handleOccupancyDetails}
                >
                  Occupancy
                </div>
                <div 
                  className="px-8 py-3 text-gray-500 cursor-pointer"
                  onClick={handleWaterQuality}
                >
                  Water Quality
                </div>
                <div className="px-8 py-3 border-b-2 border-black font-medium">
                  Review
                </div>
              </div>
              
              {/* Cards Grid */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                {/* Client Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-50 p-1 rounded-full mr-2">
                      <User className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold">Client</h3>
                  </div>
                  
                  {clientData ? (
                    <div className="mb-5">
                      <h4 className="font-bold">{clientData.name}</h4>
                      <p className="text-sm text-gray-500">{clientData.email || "No email provided"}</p>
                      <p className="text-sm text-gray-500">{clientData.details}</p>
                      {clientData.budget && (
                        <p className="text-sm text-gray-500 mt-1">Budget: {clientData.budget}</p>
                      )}
                      {clientData.location && (
                        <p className="text-sm text-gray-500">Location: {clientData.location}</p>
                      )}
                      {clientData.existingSystem && (
                        <p className="text-sm text-gray-500">Existing System: {clientData.existingSystem}</p>
                      )}
                      {clientData.timeline && (
                        <p className="text-sm text-gray-500">Timeline: {clientData.timeline}</p>
                      )}
                    </div>
                  ) : (
                    <div className="mb-5 text-gray-500">
                      <p>No client selected</p>
                    </div>
                  )}
                  
                  <button 
                    className="w-full border border-gray-300 py-2 rounded"
                    onClick={handleClientSelect}
                  >
                    {clientData ? "Change Client" : "Select Client"}
                  </button>
                </div>
                
                {/* Building & Occupancy Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-50 p-1 rounded-full mr-2">
                      <Building className="h-5 w-5 text-green-500" />
                    </div>
                    <h3 className="text-lg font-bold">Building & Occupancy</h3>
                  </div>
                  
                  {occupancyData ? (
                    <div className="mb-5">
                      <h4 className="font-bold">{occupancyData.buildingType || 'Residential'}</h4>
                      <p className="text-sm text-gray-500">{occupancyData.occupants} occupants</p>
                      <p className="text-sm text-gray-600 font-medium mt-2">
                        {occupancyData.waterDemand} liters daily demand
                      </p>
                    </div>
                  ) : (
                    <div className="mb-5 text-gray-500">
                      <p>No occupancy details provided</p>
                    </div>
                  )}
                  
                  <button 
                    className="w-full border border-gray-300 py-2 rounded"
                    onClick={handleOccupancyDetails}
                  >
                    {occupancyData ? "Edit Details" : "Add Details"}
                  </button>
                </div>
                
                {/* Water Quality Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-50 p-1 rounded-full mr-2">
                      <Droplet className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold">Water Quality</h3>
                  </div>
                  
                  {waterQualityData ? (
                    <div className="mb-5">
                      <h4 className="font-bold">{waterQualityData.source}</h4>
                      <p className="text-sm text-gray-500">
                        {waterQualityData.source === "Borehole Water" 
                          ? "Requires indirect system with heat exchanger" 
                          : "Suitable for direct systems"}
                      </p>
                    </div>
                  ) : (
                    <div className="mb-5 text-gray-500">
                      <p>No water quality selection</p>
                    </div>
                  )}
                  
                  <button 
                    className="w-full border border-gray-300 py-2 rounded"
                    onClick={handleWaterQuality}
                  >
                    {waterQualityData ? "Change Selection" : "Select Water Type"}
                  </button>
                </div>
              </div>
              
              {/* Assessment Status Message */}
              {completion === 100 ? (
                <div className="bg-green-50 border border-green-100 rounded-lg p-6">
                  <div className="flex">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-green-800">Assessment Complete</h3>
                      <p className="text-green-700">
                        All required information has been provided. You can now generate recommendations.
                      </p>
                      
                      <button 
                        className={`bg-black text-white px-6 py-3 rounded flex items-center mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        onClick={handleGenerateRecommendations}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Generating...' : 'Generate Recommendations'}
                        {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-6">
                  <div className="flex">
                    <CircleHelp className="h-6 w-6 text-amber-500 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-amber-800">Assessment Incomplete</h3>
                      <p className="text-amber-700">
                        Please complete all required sections before generating recommendations.
                      </p>
                      
                      <div className="mt-4">
                        {!sections.client && (
                          <button 
                            className="bg-amber-100 text-amber-800 px-4 py-2 rounded mr-2 mb-2"
                            onClick={handleClientSelect}
                          >
                            Select Client
                          </button>
                        )}
                        
                        {!sections.occupancy && (
                          <button 
                            className="bg-amber-100 text-amber-800 px-4 py-2 rounded mr-2 mb-2"
                            onClick={handleOccupancyDetails}
                          >
                            Complete Occupancy
                          </button>
                        )}
                        
                        {!sections.waterQuality && (
                          <button 
                            className="bg-amber-100 text-amber-800 px-4 py-2 rounded mr-2 mb-2"
                            onClick={handleWaterQuality}
                          >
                            Select Water Quality
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Technical Summary (only shows when assessment is complete) */}
              {completion === 100 && (
                <div className="bg-white rounded-lg shadow p-6 mt-6">
                  <h3 className="text-lg font-bold mb-4">Technical Summary</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">System Requirements</h4>
                      <div className="bg-gray-50 p-4 rounded">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Hot Water Demand:</span>
                          <span className="font-medium">{occupancyData?.waterDemand || 0} L/day</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">System Type:</span>
                          <span className="font-medium">
                            {waterQualityData?.source === "Borehole Water" ? "Indirect" : "Direct"}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Building Type:</span>
                          <span className="font-medium">{occupancyData?.buildingType || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Budget:</span>
                          <span className="font-medium">{clientData?.budget || 'Medium'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Timeline:</span>
                          <span className="font-medium">{clientData?.timeline || '3-6 months'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Recommendations</h4>
                      <div className="bg-gray-50 p-4 rounded">
                        <p className="text-gray-600 mb-2">
                          Based on your inputs, we recommend:
                        </p>
                        {occupancyData && (
                          <ul className="list-disc pl-5 text-gray-700">
                            <li>Storage tank size: {Math.ceil(occupancyData.waterDemand * 1.2 / 100) * 100} liters</li>
                            <li>
                              {waterQualityData?.source === "Borehole Water" 
                                ? "Indirect system with heat exchanger" 
                                : "Direct system configuration"}
                            </li>
                            <li>
                              {Number(occupancyData.occupants) > 20 
                                ? "Commercial grade solar collectors" 
                                : "Residential grade solar collectors"}
                            </li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}