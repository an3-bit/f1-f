import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Droplets, Info } from 'lucide-react';

export default function OccupancyDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [buildingType, setBuildingType] = useState('Domestic residential houses');
  const [occupants, setOccupants] = useState('');
  const [waterDemand, setWaterDemand] = useState(0);
  const [sections, setSections] = useState({
    client: false,
    occupancy: false,
    waterQuality: false
  });

  const returnTo = location.state?.returnTo || '/assessment-dashboard';
  const sectionKey = location.state?.sectionKey || 'occupancy';

  // Calculate completion percentage
  const completion = (Object.values(sections).filter(Boolean).length / Object.values(sections).length) * 100;

  useEffect(() => {
    // Load saved sections and selected client from localStorage
    const savedSections = localStorage.getItem('assessmentSections');
    const savedOccupants = localStorage.getItem('selectedOccupants');
    
    if (savedSections) {
      const parsed = JSON.parse(savedSections);
      setSections(parsed);
    }
    
    if (savedOccupants) {
      const value = Number(savedOccupants);
      setOccupants(value);
      setWaterDemand(calculateWaterDemand(value));
    }
  }, []);

  const calculateWaterDemand = (num) => num * 30;

  const handleOccupantsChange = (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value > 0) {
      setOccupants(value);
      setWaterDemand(calculateWaterDemand(value));
      
      // Save to localStorage
      localStorage.setItem('selectedOccupants', value);
      
      // Update sections status
      const updatedSections = { ...sections, occupancy: true };
      localStorage.setItem('assessmentSections', JSON.stringify(updatedSections));
      setSections(updatedSections);
    } else {
      setOccupants('');
      setWaterDemand(0);
      
      // Remove from localStorage
      localStorage.removeItem('selectedOccupants');
      
      // Update sections status
      const updatedSections = { ...sections, occupancy: false };
      localStorage.setItem('assessmentSections', JSON.stringify(updatedSections));
      setSections(updatedSections);
    }
  };

  // Handler functions for navigation
  const handleNextStep = () => {
    if (occupants) {
      navigate('/water-quality', {
        state: {
          returnTo: returnTo,
          sectionKey: 'waterQuality'
        }
      });
    } else {
      alert('Please enter the number of occupants to continue');
    }
  };

  const handleBackToClient = () => {
    navigate('/client-selection', {
      state: {
        returnTo: returnTo,
        sectionKey: 'client'
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
    navigate('/occupancy-details', {
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
    setSections({
      client: false,
      occupancy: false,
      waterQuality: false
    });
    setOccupants('');
    setWaterDemand(0);
  };

  const saveProgress = () => {
    // Already saving to localStorage in other functions
    alert('Progress saved successfully!');
  };

  const handleGenerateRecommendations = () => {
    navigate('/recommendations');
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

  // Computed property for enabling/disabling the generate recommendations button
  const canGenerateRecommendations = completion >= 66; // At least 2 sections completed

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
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
              <h2 className="text-2xl font-bold mb-1">Occupancy Details</h2>
              <p className="text-gray-600 mb-6">Information about the people using hot water</p>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <label className="font-medium">Type of Building Premises</label>
                  <Info className="ml-2 text-gray-400" size={16} />
                </div>
                <select
                  className="w-full border rounded-md py-2 px-3 text-gray-700"
                  value={buildingType}
                  onChange={(e) => setBuildingType(e.target.value)}
                >
                  {[
                    'Domestic residential houses',
                    'Commercial buildings',
                    'Multi-family residential',
                    'Hotels and resorts',
                    'Industrial facilities',
                    'Healthcare facilities',
                    'Educational institutions',
                    'Recreational facilities',
                    'Government buildings',
                  ].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="flex items-center mb-2 font-medium">
                  <svg className="h-5 w-5 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Number of Occupants
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full border rounded-md py-2 px-3 text-gray-700"
                  value={occupants}
                  onChange={handleOccupantsChange}
                  placeholder="Enter number of occupants"
                />
              </div>

              {occupants && (
                <div className="bg-blue-50 p-4 rounded-md mb-6">
                  <div className="flex items-center mb-2">
                    <Droplets className="text-blue-600 mr-2" size={20} />
                    <h3 className="text-blue-800 font-medium">Estimated Daily Hot Water Demand</h3>
                  </div>
                  <p className="text-blue-700">
                    Based on your inputs, the estimated daily hot water demand is{' '}
                    <span className="font-bold">{waterDemand} liters</span> at 60°C.
                  </p>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button onClick={handleBackToClient} className="px-5 py-2 border rounded text-gray-700 hover:bg-gray-50">
                  Back to Client
                </button>
                <button
                  onClick={handleNextStep}
                  className={`flex items-center px-5 py-2 ${
                    occupants ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
                  } text-white rounded`}
                  disabled={!occupants}
                >
                  Next: Water Quality
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