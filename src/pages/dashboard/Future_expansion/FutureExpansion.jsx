import { useState } from 'react';
import { Search, Settings, TrendingUp, ArrowRight, User, LogOut } from 'lucide-react';

export default function SolarSystemExpansionPlanner() {
  const [currentPage, setCurrentPage] = useState('main');
  const [productNumber, setProductNumber] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Form state for future expansion
  const [expansionForm, setExpansionForm] = useState({
    selected_system: '',
    current_capacity: '',
    current_users: '',
    location: '',
    target_capacity: ''
  });
  
  // Form validation state
  const [formErrors, setFormErrors] = useState({});
  
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
    // Reset form when going back to main
    setExpansionForm({
      selected_system: '',
      current_capacity: '',
      current_users: '',
      location: '',
      target_capacity: ''
    });
    setFormErrors({});
  };

  const handleSearch = () => {
    if (!productNumber.trim()) {
      alert("Please enter a product number");
      return;
    }
    
    // In a real application, this would search for the product
    // and then populate the form with existing system details
    setExpansionForm(prev => ({
      ...prev,
      selected_system: productNumber
    }));
    
    setCurrentPage('expansionForm');
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
  
  // Form handling functions
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    // For number fields, ensure valid input
    if (['current_capacity', 'current_users', 'target_capacity'].includes(name)) {
      if (value === '' || /^\d+$/.test(value)) {
        setExpansionForm({
          ...expansionForm,
          [name]: value
        });
      }
    } else {
      setExpansionForm({
        ...expansionForm,
        [name]: value
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!expansionForm.selected_system) {
      errors.selected_system = "System is required";
    }
    
    if (!expansionForm.current_capacity) {
      errors.current_capacity = "Current capacity is required";
    }
    
    if (!expansionForm.current_users) {
      errors.current_users = "Current users is required";
    }
    
    if (!expansionForm.location) {
      errors.location = "Location is required";
    }
    
    if (!expansionForm.target_capacity) {
      errors.target_capacity = "Target capacity is required";
    } else if (parseInt(expansionForm.target_capacity) <= parseInt(expansionForm.current_capacity)) {
      errors.target_capacity = "Target capacity must be greater than current capacity";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Prepare data for the API call
      const payload = {
        selected_system: expansionForm.selected_system,
        current_capacity: parseInt(expansionForm.current_capacity),
        current_users: parseInt(expansionForm.current_users),
        location: expansionForm.location,
        target_capacity: parseInt(expansionForm.target_capacity)
      };
      
      // In a real application, this would make the API call
      alert(`Sending to /api/futureexpansion endpoint:\n${JSON.stringify(payload, null, 2)}`);
      
      // For demo purposes, we'll just redirect to main page
      // In a real app, you would show the recommendations from the API
      setCurrentPage('recommendationsPage');
    }
  };

  // Main Landing Page
  const MainPage = () => (
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
              onClick={navigateToNewSystem}
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
  
  // Expansion Form Page
  const ExpansionFormPage = () => (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">System Expansion Details</h1>
      <p className="text-gray-600 mb-8">Please provide the details needed to generate expansion recommendations</p>
      
      <div className="border rounded-lg p-6 bg-white">
        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* System */}
            <div className="col-span-2">
              <label htmlFor="selected_system" className="block font-medium mb-2">System Model</label>
              <input
                type="text"
                id="selected_system"
                name="selected_system"
                value={expansionForm.selected_system}
                onChange={handleFormChange}
                className={`border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.selected_system ? 'border-red-500' : ''}`}
                placeholder="System model number"
                readOnly
              />
              {formErrors.selected_system && (
                <p className="text-red-500 text-sm mt-1">{formErrors.selected_system}</p>
              )}
            </div>
            
            {/* Current Capacity */}
            <div>
              <label htmlFor="current_capacity" className="block font-medium mb-2">Current Capacity (liters)</label>
              <input
                type="text"
                id="current_capacity"
                name="current_capacity"
                value={expansionForm.current_capacity}
                onChange={handleFormChange}
                className={`border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.current_capacity ? 'border-red-500' : ''}`}
                placeholder="E.g., 150"
              />
              {formErrors.current_capacity && (
                <p className="text-red-500 text-sm mt-1">{formErrors.current_capacity}</p>
              )}
            </div>
            
            {/* Current Users */}
            <div>
              <label htmlFor="current_users" className="block font-medium mb-2">Current Number of Users</label>
              <input
                type="text"
                id="current_users"
                name="current_users"
                value={expansionForm.current_users}
                onChange={handleFormChange}
                className={`border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.current_users ? 'border-red-500' : ''}`}
                placeholder="E.g., 4"
              />
              {formErrors.current_users && (
                <p className="text-red-500 text-sm mt-1">{formErrors.current_users}</p>
              )}
            </div>
            
            {/* Location */}
            <div>
              <label htmlFor="location" className="block font-medium mb-2">Location</label>
              <select
                id="location"
                name="location"
                value={expansionForm.location}
                onChange={handleFormChange}
                className={`border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.location ? 'border-red-500' : ''}`}
              >
                <option value="">Select location</option>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
                <option value="Northeast">Northeast</option>
                <option value="Northwest">Northwest</option>
                <option value="Southeast">Southeast</option>
                <option value="Southwest">Southwest</option>
              </select>
              {formErrors.location && (
                <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>
              )}
            </div>
            
            {/* Target Capacity */}
            <div>
              <label htmlFor="target_capacity" className="block font-medium mb-2">Target Capacity (liters)</label>
              <input
                type="text"
                id="target_capacity"
                name="target_capacity"
                value={expansionForm.target_capacity}
                onChange={handleFormChange}
                className={`border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.target_capacity ? 'border-red-500' : ''}`}
                placeholder="E.g., 300"
              />
              {formErrors.target_capacity && (
                <p className="text-red-500 text-sm mt-1">{formErrors.target_capacity}</p>
              )}
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <button 
              type="button"
              onClick={navigateToExistingSystem}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md"
            >
              Back
            </button>
            <button 
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md"
            >
              Generate Recommendations
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
  // Mock Recommendations Page
  const RecommendationsPage = () => (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">System Expansion Recommendations</h1>
      <p className="text-gray-600 mb-8">Based on your current system and requirements</p>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="bg-green-100 p-2 rounded-full mr-3">
            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-green-800">Analysis Complete</h3>
            <p className="text-green-700 text-sm">We've analyzed your {expansionForm.selected_system} system and generated recommendations.</p>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg bg-white overflow-hidden">
        <div className="bg-blue-50 p-4 border-b">
          <h2 className="text-xl font-semibold text-blue-800">Recommended Expansion Options</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {/* Option 1 */}
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">Option 1: Add Secondary Tank</h3>
                  <p className="text-gray-600 mt-1">Add a supplementary tank to your existing system</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">Recommended</span>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Details:</h4>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-start">
                      <div className="text-blue-500 mr-2">•</div>
                      <span>Add UVT150 tank (150L capacity)</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-blue-500 mr-2">•</div>
                      <span>Connect with existing system</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-blue-500 mr-2">•</div>
                      <span>Minimal modifications required</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Benefits:</h4>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-start">
                      <div className="text-green-500 mr-2">•</div>
                      <span>Most cost-effective solution</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-green-500 mr-2">•</div>
                      <span>Quickest installation time</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-green-500 mr-2">•</div>
                      <span>Less disruption to existing system</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  Select This Option
                </button>
              </div>
            </div>
            
            {/* Option 2 */}
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">Option 2: Full System Upgrade</h3>
                  <p className="text-gray-600 mt-1">Replace current system with a larger integrated solution</p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Details:</h4>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-start">
                      <div className="text-blue-500 mr-2">•</div>
                      <span>Replace with UFS300D system (300L)</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-blue-500 mr-2">•</div>
                      <span>Complete new installation</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-blue-500 mr-2">•</div>
                      <span>Includes latest efficiency features</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Benefits:</h4>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-start">
                      <div className="text-green-500 mr-2">•</div>
                      <span>Higher efficiency rating</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-green-500 mr-2">•</div>
                      <span>Better integration of components</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-green-500 mr-2">•</div>
                      <span>Extended warranty coverage</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  Select This Option
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold mb-4">Additional Considerations</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="text-amber-500 mr-2">•</div>
                <span>Current system was installed approximately 5 years ago</span>
              </li>
              <li className="flex items-start">
                <div className="text-amber-500 mr-2">•</div>
                <span>Location {expansionForm.location} has higher solar radiation, beneficial for overall system efficiency</span>
              </li>
              <li className="flex items-start">
                <div className="text-amber-500 mr-2">•</div>
                <span>Consider scheduling regular maintenance with upgrade to maximize system lifespan</span>
              </li>
            </ul>
          </div>
        </div>
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
      {currentPage === 'expansionForm' && <ExpansionFormPage />}
      {currentPage === 'recommendationsPage' && <RecommendationsPage />}
    </div>
  );
}