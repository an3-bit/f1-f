import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../../components/header/Header';

const AssessmentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Track status of each section with localStorage to persist between routes
  const [sections, setSections] = useState(() => {
    const savedSections = localStorage.getItem('assessmentSections');
    return savedSections ? JSON.parse(savedSections) : {
      client: false,
      occupancy: false,
      waterQuality: false
    };
  });
  
  // Calculate completion percentage based on completed sections
  const [completion, setCompletion] = useState(0);
  
  // Update completion whenever sections change
  useEffect(() => {
    const completedSections = Object.values(sections).filter(value => value === true).length;
    const totalSections = Object.keys(sections).length;
    const percentage = Math.round((completedSections / totalSections) * 100);
    setCompletion(percentage);
    
    // Save to localStorage
    localStorage.setItem('assessmentSections', JSON.stringify(sections));
  }, [sections]);

  // Check for state updates from redirects
  useEffect(() => {
    if (location.state) {
      const { updatedSections } = location.state;
      if (updatedSections) {
        setSections(prevSections => ({
          ...prevSections,
          ...updatedSections
        }));
      }
    }
  }, [location.state]);

  // Handler for starting the assessment flow
  const handleStartAssessment = () => {
    navigate('/client-selection');
  };

  // Handlers for each section
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
        returnTo: '/occupancy-details',
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

  // Reset all progress
  const resetProgress = () => {
    const resetSections = {
      client: false,
      occupancy: false,
      waterQuality: false
    };
    setSections(resetSections);
    localStorage.setItem('assessmentSections', JSON.stringify(resetSections));
  };
  
  // Save progress with timestamp
  const saveProgress = () => {
    localStorage.setItem('assessmentSections', JSON.stringify(sections));
    localStorage.setItem('assessmentLastSaved', new Date().toLocaleString());
    
    // Show temporary success message
    setSaveMessage('Progress saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };
  
  // State for save confirmation message
  const [saveMessage, setSaveMessage] = useState('');

  // Only enable recommendations button if all sections are complete
  const canGenerateRecommendations = Object.values(sections).every(value => value === true);

  const handleGenerateRecommendations = () => {
    if (canGenerateRecommendations) {
      navigate('/assessment/recommendations');
    } else {
      alert('Please complete all required sections first');
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
     
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
      
      {/* Main content */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
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
            onClick={() => navigate('/occupancy-details')}
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

        {/* Four columns on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Assessment Progress */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
              <div 
                className={`border ${sections.client ? 'border-green-200 bg-green-50' : 'border-gray-200'} rounded-md p-4 cursor-pointer hover:shadow-sm transition`}
                onClick={handleClientSelect}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full ${sections.client ? 'bg-green-100' : 'bg-blue-100'} flex items-center justify-center mr-3`}>
                      {sections.client ? (
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
                      <h3 className="font-medium">Client Selection</h3>
                      <p className="text-gray-500 text-sm">{sections.client ? 'Client selected' : 'Select a client'}</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <div 
                className={`border ${sections.occupancy ? 'border-green-200 bg-green-50' : 'border-gray-200'} rounded-md p-4 cursor-pointer hover:shadow-sm transition`}
                onClick={() => navigate('/ocupancy-details')}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full ${sections.occupancy ? 'bg-green-100' : 'bg-blue-100'} flex items-center justify-center mr-3`}>
                      {sections.occupancy ? (
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
                      <h3 className="font-medium">Occupancy Details</h3>
                      <p className="text-gray-500 text-sm">{sections.occupancy ? 'Occupancy provided' : 'Enter occupancy'}</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <div 
                className={`border ${sections.waterQuality ? 'border-green-200 bg-green-50' : 'border-gray-200'} rounded-md p-4 cursor-pointer hover:shadow-sm transition`}
                onClick={handleWaterQuality}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full ${sections.waterQuality ? 'bg-green-100' : 'bg-blue-100'} flex items-center justify-center mr-3`}>
                      {sections.waterQuality ? (
                        <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">Water Quality</h3>
                      <p className="text-gray-500 text-sm">{sections.waterQuality ? 'Water type selected' : 'Select water type'}</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            <button 
              onClick={handleStartAssessment}
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center justify-center"
            >
              {completion === 100 ? 'Review All Sections' : 'Complete All Sections'}
            </button>
          </div>

          {/* Client */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className={`w-8 h-8 rounded-full ${sections.client ? 'bg-green-100' : 'bg-blue-100'} flex items-center justify-center mr-3`}>
                {sections.client ? (
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
              <h2 className="text-xl font-bold">Client</h2>
            </div>
            <p className="text-gray-600 mb-4">
              {sections.client ? 'Client information provided' : 'No client selected'}
            </p>
            <button 
              onClick={handleClientSelect}
              className={`w-full text-white py-2 rounded-md ${
                sections.client ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {sections.client ? 'Edit Client' : 'Select Client'}
            </button>
          </div>

          {/* Building & Occupancy */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className={`w-8 h-8 rounded-full ${sections.occupancy ? 'bg-green-100' : 'bg-blue-100'} flex items-center justify-center mr-3`}>
                {sections.occupancy ? (
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
              <h2 className="text-xl font-bold">Building & Occupancy</h2>
            </div>
            <p className="text-gray-600 mb-4">
              {sections.occupancy ? 'Occupancy details provided' : 'Occupancy details not provided'}
            </p>
            <button 
              onClick={handleOccupancyDetails}
              className={`w-full text-white py-2 rounded-md ${
                sections.occupancy ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {sections.occupancy ? 'Edit Details' : 'Add Details'}
            </button>
          </div>

          {/* Water Quality */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className={`w-8 h-8 rounded-full ${sections.waterQuality ? 'bg-green-100' : 'bg-blue-100'} flex items-center justify-center mr-3`}>
                {sections.waterQuality ? (
                  <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <h2 className="text-xl font-bold">Water Quality</h2>
            </div>
            <p className="text-gray-600 mb-4">
              {sections.waterQuality ? 'Water quality specified' : 'Water quality not specified'}
            </p>
            <button 
              onClick={handleWaterQuality}
              className={`w-full text-white py-2 rounded-md ${
                sections.waterQuality ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {sections.waterQuality ? 'Edit Water Quality' : 'Specify Water Quality'}
            </button>
          </div>
        </div>

        {/* Save Progress Message */}
        {saveMessage && (
          <div className="mt-6 bg-green-50 border border-green-100 rounded-lg p-4 flex items-start transition-opacity duration-500">
            <svg className="w-5 h-5 text-green-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-green-800">{saveMessage}</h3>
              <p className="mt-1 text-sm text-green-700">
                You can safely leave this page and return later to continue your work.
              </p>
            </div>
          </div>
        )}
        
        {/* Notification / Success Message */}
        {!saveMessage && (completion < 100 ? (
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
            <svg className="w-5 h-5 text-blue-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" y1="16" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" y1="8" x2="12.01" y2="8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-800">Assessment Incomplete</h3>
              <p className="mt-1 text-sm text-blue-700">Please complete all required sections to generate recommendations.</p>
              <div className="mt-3 flex items-center text-xs text-blue-600">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>
                  {localStorage.getItem('assessmentLastSaved') 
                    ? `Last saved: ${localStorage.getItem('assessmentLastSaved')}` 
                    : 'No saved progress'}
                </span>
              </div>
              <button
                onClick={handleStartAssessment}
                className="mt-3 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
              >
                Start Assessment
                <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
            <svg className="w-5 h-5 text-green-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-green-800">Assessment Complete</h3>
              <p className="mt-1 text-sm text-green-700">All required information has been provided. You can now generate recommendations.</p>
              <div className="mt-3 flex items-center text-xs text-green-600">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>
                  {localStorage.getItem('assessmentLastSaved') 
                    ? `Last saved: ${localStorage.getItem('assessmentLastSaved')}` 
                    : 'No saved progress'}
                </span>
              </div>
              <button
                onClick={handleGenerateRecommendations}
                className="mt-3 inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm"
              >
                Generate Recommendations
                <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentDashboard;