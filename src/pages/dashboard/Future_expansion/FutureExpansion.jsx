import { useState } from 'react';
import { Search, Settings, TrendingUp, ArrowRight, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SolarSystemExpansionPlanner() {
  const [currentPage, setCurrentPage] = useState('main');
  const [productNumber, setProductNumber] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();
  
  // Mock user data (in a real app, this would come from authentication)
  const userName = "John Doe";
  const userInitials = "JD";

  const navigateToExistingSystem = () => {
    setCurrentPage('existingSystem');
  };

  const navigateToNewSystem = () => {
    setCurrentPage('newAssessment');
  };

  const navigateToMain = () => {
    setCurrentPage('main');
  };

  const handleSearch = () => {
    // In a real application, this would search for the product
    // For demo purposes, we'll just show a message
    alert(`Searching for product: ${productNumber}`);
  };
  
  // User menu functions
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };
  
  const goToProfile = () => {
    alert("Navigate to profile page");
    setShowUserMenu(false);
  };
  
  const goToSettings = () => {
    alert("Navigate to settings page");
    setShowUserMenu(false);
  };
  
  const handleSignOut = () => {
    alert("Sign out user");
    setShowUserMenu(false);
  };

  // Main Landing Page
  const MainPage = () => 
    
    (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">System Expansion Planning</h1>
      <p className="text-gray-600 mb-8">Upgrade existing systems or design new expansions for growing hot water needs</p>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* New System Card - LEFT */}
        <div className="border rounded-lg shadow-sm bg-white relative overflow-hidden w-full md:w-1/2">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 rounded-full -mr-12 -mt-12 opacity-50"></div>
          
          <div className="p-8">
            <div className="bg-blue-100 p-3 rounded-full inline-flex mb-4 relative z-10">
              <Settings className="text-blue-500" size={24} />
            </div>
            
            <h2 className="text-2xl font-bold mb-3">New System</h2>
            <p className="text-gray-600 mb-6">Design a completely new solar hot water system based on client requirements and specifications.</p>
            
            <ul className="mb-6 space-y-2">
              <li className="flex items-start">
                <div className="text-blue-500 mr-2">•</div>
                <span>Complete needs assessment</span>
              </li>
              <li className="flex items-start">
                <div className="text-blue-500 mr-2">•</div>
                <span>Determine optimal system size</span>
              </li>
              <li className="flex items-start">
                <div className="text-blue-500 mr-2">•</div>
                <span>Generate system recommendations</span>
              </li>
            </ul>
            
            <button 
            
            onClick={() => navigate('/assessment-dashboard')}
              className="bg-blue-500 text-white py-3 px-4 rounded-md w-full flex items-center justify-center"
            >
              Start New Assessment <ArrowRight className="ml-2" size={16} />
            </button>
            
          </div>
        </div>
        
        {/* Existing System Card - RIGHT */}
        <div className="border rounded-lg shadow-sm bg-white relative overflow-hidden w-full md:w-1/2">
          <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-100 rounded-full -mr-12 -mt-12 opacity-50"></div>
          
          <div className="p-8">
            <div className="bg-yellow-100 p-3 rounded-full inline-flex mb-4 relative z-10">
              <TrendingUp className="text-yellow-500" size={24} />
            </div>
            
            <h2 className="text-2xl font-bold mb-3">Existing System</h2>
            <p className="text-gray-600 mb-6">Analyze an existing system to identify potential upgrades or expansions to meet increased demands.</p>
            
            <ul className="mb-6 space-y-2">
              <li className="flex items-start">
                <div className="text-yellow-500 mr-2">•</div>
                <span>Search by product number</span>
              </li>
              <li className="flex items-start">
                <div className="text-yellow-500 mr-2">•</div>
                <span>Review current system details</span>
              </li>
              <li className="flex items-start">
                <div className="text-yellow-500 mr-2">•</div>
                <span>Generate upgrade recommendations</span>
              </li>
            </ul>
            
            <button 
              onClick={navigateToExistingSystem}
              className="bg-blue-500 text-white py-3 px-4 rounded-md w-full flex items-center justify-center"
            >
              Find Existing System <ArrowRight className="ml-2" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Existing System Search Page
  const ExistingSystemPage = () => (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Existing System Search</h1>
      <p className="text-gray-600 mb-8">Find an existing system by product number to analyze and suggest upgrades</p>
      
      <div className="border rounded-lg p-6 bg-white">
        <div className="mb-4">
          <label htmlFor="productNumber" className="block font-medium mb-2">Product Number</label>
          <div className="flex">
            <input 
              type="text" 
              id="productNumber"
              placeholder="Enter product number (e.g., UFS150D, UVT200)"
              className="border rounded-l-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={productNumber}
              onChange={(e) => setProductNumber(e.target.value)}
            />
            <button 
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md flex items-center"
            >
              <Search size={20} className="mr-1" /> Search
            </button>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mt-4">Try searching for: UFS150D, UVT200, or UFS200D</p>
      </div>
      
      <div className="mt-6">
        <button 
          onClick={navigateToMain}
          className="text-blue-500 hover:underline flex items-center"
        >
          &larr; Back to System Options
        </button>
      </div>
    </div>
  );

  // Render the appropriate page based on state
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with logo and user info */}
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
              <button 
                className="px-3 py-2 text-white hover:bg-blue-700 rounded-md transition-colors"
                onClick={() => alert("Navigate to Dashboard")}
              >
                <span>Dashboard</span>
              </button>
              <button 
                className="px-3 py-2 text-white hover:bg-blue-700 rounded-md transition-colors"
                onClick={() => alert("Navigate to Triage & Sizing")}
              >
                <span>Triage & Sizing</span>
              </button>
              <button 
                className="px-3 py-2 text-white hover:bg-blue-700 rounded-md transition-colors"
                onClick={() => alert("Navigate to Future Expansion")}
              >
                <span>Future Expansion</span>
              </button>
              <button 
                className="px-3 py-2 text-white hover:bg-blue-700 rounded-md transition-colors"
                onClick={() => alert("Navigate to Sales Quote")}
              >
                <span>Sales Quote</span>
              </button>
              <button 
                className="px-3 py-2 text-white hover:bg-blue-700 rounded-md transition-colors"
                onClick={() => alert("Navigate to Proposals")}
              >
                <span>Proposals</span>
              </button>
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
                    <Settings className="mr-2 h-4 w-4" />
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
      {currentPage === 'main' && <MainPage />}
      {currentPage === 'existingSystem' && <ExistingSystemPage />}
      {currentPage === 'newAssessment' && <NewAssessmentPage />}
    </div>
  );
}