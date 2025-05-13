import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ClientSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [sections, setSections] = useState({
    client: false,
    occupancy: false,
    waterQuality: false
  });

  const completion =
    (Object.values(sections).filter(Boolean).length /
      Object.values(sections).length) *
    100;

  const returnTo = location.state?.returnTo || '/assessment-dashboard';
  const sectionKey = location.state?.sectionKey || 'client';

  useEffect(() => {
    const savedSections = localStorage.getItem('assessmentSections');
    if (savedSections) {
      const parsed = JSON.parse(savedSections);
      setSections(parsed);
      if (parsed.client && localStorage.getItem('selectedClient')) {
        setSelectedClient(JSON.parse(localStorage.getItem('selectedClient')));
      }
    }
  }, []);

  // Handle search input changes
  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
    
    // Reset error when user types
    if (error) setError('');
    
    // Only search if the user has entered at least 3 characters
    if (e.target.value.length >= 3) {
      searchClients(e.target.value);
    } else {
      setFilteredClients([]);
    }
  };

  // Function to search clients
  const searchClients = async (term) => {
    setIsLoading(true);
    setError('');
    
    try {
      // API call to fetch clients by phone number
      const response = await axios.get(
        `https://f1-backend-qhf8.onrender.com/erp/Customer_Card/Phone_No/${term}`
      );
      
      const data = response.data?.value;
      
      if (Array.isArray(data) && data.length > 0) {
        // Transform API data into the format our component expects
        const formattedClients = data.map(client => ({
          id: client.No || client.SystemId || Math.random().toString(),
          name: client.Name || 'Unknown Client',
          details: client.Phone_No || term,
          email: client.E_Mail || ''
        }));
        
        setFilteredClients(formattedClients);
      } else {
        setFilteredClients([]);
        // Only set error if the user isn't still typing
        if (term.length > 5) {
          setError('No clients found with this phone number.');
        }
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Failed to fetch clients. Please check your connection and try again.');
      
      // For development - fallback to mock data if the API is unavailable
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for development');
        setFilteredClients([
          { 
            id: 'mock1', 
            name: 'John Smith (MOCK)', 
            details: '+254768372439',
            email: 'john@example.com'
          },
          { 
            id: 'mock2', 
            name: 'Jane Doe (MOCK)', 
            details: '+254768372440',
            email: 'jane@example.com'
          }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    // Save selection to localStorage
    localStorage.setItem('selectedClient', JSON.stringify(client));
    
    // Update the sections in localStorage
    const updatedSections = { ...sections, client: true };
    localStorage.setItem('assessmentSections', JSON.stringify(updatedSections));
    setSections(updatedSections);
  };

  const handleBackToDashboard = () => {
    navigate(returnTo);
  };

  const handleNextStep = () => {
    if (selectedClient) {
      // Update the sections in localStorage
      const updatedSections = { ...sections, client: true };
      localStorage.setItem('assessmentSections', JSON.stringify(updatedSections));
      setSections(updatedSections);
      
      // Navigate based on where we want to go next
      if (returnTo === '/assessment-dashboard') {
        // Return to dashboard with updated section status
        navigate(returnTo, { 
          state: { 
            updatedSections: { [sectionKey]: true } 
          } 
        });
      } else {
        // Continue to next step in the assessment flow
        navigate('/occupancy-details', {
          state: {
            returnTo: returnTo,
            sectionKey: 'occupancy'
          }
        });
      }
    } else {
      alert('Please select a client first');
    }
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

  const handleStartAssessment = () => {
    if (completion === 100) {
      navigate('/assessment-review');
    } else {
      // Find the first incomplete section and navigate to it
      if (!sections.client) {
        handleClientSelect();
      } else if (!sections.occupancy) {
        handleOccupancyDetails();
      } else if (!sections.waterQuality) {
        handleWaterQuality();
      }
    }
  };

  // Adding missing functions that were referenced but not defined
  const resetProgress = () => {
    localStorage.removeItem('assessmentSections');
    localStorage.removeItem('selectedClient');
    setSections({
      client: false,
      occupancy: false,
      waterQuality: false
    });
    setSelectedClient(null);
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      {/* Navigation */}
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

        {/* Tabs */}
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
            onClick={handleStartAssessment}
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center justify-center"
          >
            {completion === 100 ? 'Review All Sections' : 'Complete All Sections'}
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">Client Selection</h1>
            <p className="text-gray-600 mb-6">Search for a client by phone number from your locally stored data</p>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Client Search</h2>
              
              <div className="mb-4">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Search by phone number..."
                  value={searchTerm}
                  onChange={handleSearchInput}
                />
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                Enter at least 3 digits of a phone number to search for clients. For example, try "254768372439".
              </p>
              
              {/* Search Results */}
              {searchTerm.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-2">Search Results</h3>
                  
                  {isLoading ? (
                    <div className="text-center p-4 border border-gray-200 rounded-md bg-gray-50">
                      <p className="text-gray-500">Loading clients...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center p-4 border border-red-200 rounded-md bg-red-50">
                      <p className="text-red-500">{error}</p>
                    </div>
                  ) : filteredClients.length > 0 ? (
                    <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
                      {filteredClients.map(client => (
                        <div 
                          key={client.id} 
                          className={`p-4 cursor-pointer hover:bg-gray-50 ${
                            selectedClient?.id === client.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                          }`}
                          onClick={() => handleSelectClient(client)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-gray-900">{client.name}</h4>
                              <p className="text-sm text-gray-600">{client.details}</p>
                              {client.email && <p className="text-sm text-gray-500">{client.email}</p>}
                            </div>
                            {selectedClient?.id === client.id && (
                              <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchTerm.length >= 3 ? (
                    <div className="text-center p-4 border border-gray-200 rounded-md bg-gray-50">
                      <p className="text-gray-500">No clients found with phone number containing "{searchTerm}"</p>
                    </div>
                  ) : (
                    <div className="text-center p-4 border border-gray-200 rounded-md bg-gray-50">
                      <p className="text-gray-500">Enter at least 3 digits to search</p>
                    </div>
                  )}
                </div>
              )}
              
              {searchTerm.length === 0 && !selectedClient && (
                <div className="border border-gray-200 rounded-md p-8 mb-6 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No client selected</h3>
                  <p className="text-gray-500 text-center">
                    Search for a client by phone number using the search field above.
                  </p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Selected Client Details</h3>
                {selectedClient ? (
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{selectedClient.name}</h4>
                        <p className="text-gray-600">{selectedClient.details}</p>
                        {selectedClient.email && <p className="text-gray-500 text-sm">Email: {selectedClient.email}</p>}
                      </div>
                      <button 
                        onClick={() => setSelectedClient(null)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No client selected. Please search and select a client to continue.
                  </p>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleBackToDashboard}
                  className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 flex items-center"
                >
                  <svg className="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back to Dashboard
                </button>
                
                
                {selectedClient && (
                  <button
                  onClick={() => navigate('/occupancy-details')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md flex items-center"
                  >
                    Proceed to Occupancy Details
                    <svg
                      className="ml-2 w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M5 12h14M12 5l7 7-7 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSelection;