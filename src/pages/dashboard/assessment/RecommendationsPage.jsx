import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle, Download, ArrowRight, User, Building, Droplet, Settings as SettingsIcon, LogOut } from 'lucide-react';

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState(null);
  const [activeTab, setActiveTab] = useState('recommendations');
  const [userName, setUserName] = useState('');
  const [userInitials, setUserInitials] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Load assessment data from localStorage
    const savedAssessment = localStorage.getItem('fullAssessmentData');
    if (savedAssessment) {
      setAssessmentData(JSON.parse(savedAssessment));
    } else {
      // Redirect if no data is found
      navigate('/assessment-review');
    }

    // Check if user is logged in
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

  // Calculate recommended system specs based on assessment data
  const getRecommendedSystem = () => {
    if (!assessmentData) return null;

    const { waterQuality, occupancy, client } = assessmentData;

    // Default recommendation
    const recommendation = {
      model: "Ultrasun UFS 150D Flatplate Solar Water Heater",
      type: waterQuality?.source === "Borehole Water" ? "Indirect" : "Direct",
      tankSize: "150 Liters",
      collectorType: "Flatplate",
      heatOutput: "9 kWh/day (max)",
      peopleCapacity: "Up to 5 people",
      price: 138275,
      warranty: "5 years"
    };

    // Adjust based on occupancy
    if (occupancy?.occupants) {
      const occupants = Number(occupancy.occupants);
      if (occupants > 5 && occupants <= 7) {
        recommendation.model = "Ultrasun UFS 200D Flatplate Solar Water Heater";
        recommendation.tankSize = "200 Liters";
        recommendation.heatOutput = "12 kWh/day (max)";
        recommendation.peopleCapacity = "Up to 7 people";
        recommendation.price = 145000;
      } else if (occupants > 7) {
        recommendation.model = "Ultrasun UFX 200D Flatplate Solar Water Heater";
        recommendation.tankSize = "200 Liters";
        recommendation.heatOutput = "14 kWh/day (max)";
        recommendation.peopleCapacity = `Up to ${occupants} people`;
        recommendation.price = 185000;
      }
    }

    // Adjust based on water quality
    if (waterQuality?.source === "Borehole Water") {
      recommendation.model = "Ultrasun UVR 150 VacRod Solar Water Heater";
      recommendation.collectorType = "Evacuated-tube";
      recommendation.price = 175000;
    }

    // Adjust based on budget
    if (client?.budget === "Premium") {
      recommendation.model = "Ultrasun UFX 200i Flatplate Solar Water Heater";
      recommendation.tankSize = "200 Liters";
      recommendation.collectorType = "Flatplate Premium";
      recommendation.heatOutput = "14 kWh/day (max)";
      recommendation.price = 205000;
    }

    return recommendation;
  };

  const recommendedSystem = getRecommendedSystem();

  // Get alternative systems
  const getAlternativeSystems = () => {
    const alternatives = [
      {
        model: "Ultrasun UFS 150D Flatplate Solar Water Heater",
        tankSize: "150L, flatplate",
        price: 120000
      },
      {
        model: "Ultrasun UFS 200D Flatplate Solar Water Heater",
        tankSize: "200L, flatplate",
        price: 145000
      },
      {
        model: "Ultrasun UVR 150 VacRod Solar Water Heater",
        tankSize: "150L, evacuated-tube",
        price: 175000
      },
      {
        model: "Ultrasun UFX 200D Flatplate Solar Water Heater",
        tankSize: "200L, flatplate",
        price: 185000
      },
      {
        model: "Ultrasun UFX 200i Flatplate Solar Water Heater",
        tankSize: "200L, flatplate",
        price: 205000
      }
    ];

    // Filter out the recommended system from alternatives
    return alternatives.filter(alt => alt.model !== recommendedSystem?.model);
  };

  const alternativeSystems = getAlternativeSystems();
  
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };
  
  const handleSignOut = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    
    // Redirect to login page
    navigate('/', { replace: true });
  };
  
  const goToProfile = () => navigate('/profile');
  const goToSettings = () => navigate('/settings');
  
  const handleNavigate = (path) => {
    navigate(path);
  };
  
  const handleBackToAssessment = () => {
    navigate('/assessment-review');
  };
  
  const handleGenerateQuote = () => {
    // Store the recommended system data for the quote page
    localStorage.setItem('recommendedSystem', JSON.stringify(recommendedSystem));
    navigate('/quote1');
  };

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
                href="/dashboard" 
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
          {/* Back button and header */}
          <div className="mb-6">
            <button 
              onClick={handleBackToAssessment}
              className="flex items-center text-gray-600 mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Assessment
            </button>
            
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h1 className="text-3xl font-bold">System Recommendation</h1>
                <p className="text-gray-600">Based on the assessment, here's our recommended solar hot water solution</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button 
                  onClick={handleGenerateQuote}
                  className="bg-black text-white px-4 py-2 rounded flex items-center"
                >
                  Generate Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content - 2 columns */}
            <div className="lg:col-span-2">
              {/* Recommended System */}
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="flex justify-between items-center p-6 border-b">
                  <div>
                    <h2 className="text-xl font-bold">Recommended System</h2>
                    <p className="text-gray-600 text-sm">based on your requirements and water quality</p>
                  </div>
                  <div className="bg-black text-white px-3 py-1 rounded-full text-sm">
                    {recommendedSystem?.type || 'Direct'} System
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="bg-amber-50 p-6 rounded-lg mb-6">
                    <div className="flex items-start">
                      <div className="mr-4 text-amber-500">
                        <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="1" fill="none">
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
                      <div>
                        <h3 className="text-xl font-bold text-amber-800">{recommendedSystem?.model || 'Ultrasun UFS 150D Flatplate Solar Water Heater'}</h3>
                        <p className="text-amber-700 mt-2">
                          Dayliff Ultrasun UFS Flat Plate Solar Hot Water Systems are efficient and economical water heaters that provide excellent performance in all domestic applications. Direct type with outlet water being heated directly by circulation through the solar collector.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="text-gray-500 mb-1">Tank Size</h4>
                      <p className="font-bold">{recommendedSystem?.tankSize || '150 Liters'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-gray-500 mb-1">Collector Type</h4>
                      <p className="font-bold">{recommendedSystem?.collectorType || 'Flatplate'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-gray-500 mb-1">Heat Output</h4>
                      <p className="font-bold">{recommendedSystem?.heatOutput || '9 kWh/day (max)'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-gray-500 mb-1">Suitable For</h4>
                      <p className="font-bold">{recommendedSystem?.peopleCapacity || 'Up to 5 people'}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-bold mb-3">Water Quality Requirements</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Clarity: clear</span>
                      </div>
                      
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>TDS: &lt;600mg/l</span>
                      </div>
                      
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Hardness: &lt;200mg/l CaCO3</span>
                      </div>
                      
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Saturation Index: &gt;0.8-1.0</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-3">System Configuration Diagram</h3>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex justify-center">
                        <div className="relative w-full max-w-lg h-64">
                          {/* Sun */}
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-yellow-200 p-3 rounded text-center w-24">
                            <span className="text-amber-800">☀️ Sun</span>
                          </div>
                          
                          {/* Arrow down */}
                          <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                            <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                              <path d="M10 2V18M10 18L5 13M10 18L15 13" stroke="black" strokeWidth="2"/>
                            </svg>
                          </div>
                          
                          {/* Collector */}
                          <div className="absolute top-18 left-1/4 bg-amber-200 p-3 rounded text-center w-32">
                            <span className="text-amber-800">☼ Collector 1</span>
                          </div>
                          
                          {/* Cold Water Supply */}
                          <div className="absolute top-18 right-1/4 bg-blue-100 p-3 rounded text-center w-32">
                            <span className="text-blue-800">☁ Cold Water Supply</span>
                          </div>
                          
                          {/* Hot Water Arrow */}
                          <div className="absolute top-36 left-1/4 transform translate-x-8">
                            <span>Hot Water</span>
                            <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
                              <path d="M2 12H58M58 12L53 7M58 12L53 17" stroke="red" strokeWidth="2"/>
                            </svg>
                          </div>
                          
                          {/* Cold Water Arrow */}
                          <div className="absolute top-36 right-1/4 transform -translate-x-8">
                            <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
                              <path d="M58 12H2M2 12L7 7M2 12L7 17" stroke="blue" strokeWidth="2"/>
                            </svg>
                            <span className="text-right block">Cold Water</span>
                          </div>
                          
                          {/* Tank */}
                          <div className="absolute top-48 left-1/2 transform -translate-x-1/2 bg-blue-500 p-3 rounded text-center w-40 text-white">
                            <span>🌊 150L Tank</span>
                          </div>
                          
                          {/* Bottom Arrow */}
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                            <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                              <path d="M10 2V18M10 18L5 13M10 18L15 13" stroke="black" strokeWidth="2"/>
                            </svg>
                          </div>
                          
                          {/* Usage */}
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-blue-100 p-2 rounded text-center w-36">
                            <span className="text-blue-800">♨ Hot Water Usage</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Components */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Additional Components</h3>
                
                <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-bold mb-1">SOLAR THERMAL SR609 AC CONTROLLER</h4>
                  <p className="text-gray-600 text-sm">
                    Programmable temperature controller that automatically switches ON/OFF the electric booster heaters at certain pre-programmed times.
                  </p>
                </div>
                
                <div className="flex items-center mb-6">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <div>
                    <h4 className="font-bold">HEATER 3KW BURAL</h4>
                    <p className="text-gray-600 text-sm">Electric heating element for temperature boosting during cloudy days.</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500">Total Cost</p>
                      <p className="text-2xl font-bold">Ksh {recommendedSystem?.price?.toLocaleString() || '138,275'}</p>
                      <p className="text-xs text-gray-500">* Prices include VAT. Installation costs may vary based on site conditions.</p>
                    </div>
                    
                    <button 
                      onClick={handleGenerateQuote}
                      className="bg-black text-white px-4 py-2 rounded flex items-center"
                    >
                      Generate Quote
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Tabs for Specifications, Installation, Warranty */}
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="flex border-b">
                  <button 
                    className={`px-6 py-3 text-sm font-medium ${activeTab === 'specifications' ? 'border-b-2 border-black' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('specifications')}
                  >
                    Specifications
                  </button>
                  <button 
                    className={`px-6 py-3 text-sm font-medium ${activeTab === 'installation' ? 'border-b-2 border-black' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('installation')}
                  >
                    Installation Notes
                  </button>
                  <button 
                    className={`px-6 py-3 text-sm font-medium ${activeTab === 'warranty' ? 'border-b-2 border-black' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('warranty')}
                  >
                    Warranty
                  </button>
                </div>
                
                <div className="p-6">
                  {activeTab === 'specifications' && (
                    <div>
                      <h3 className="font-bold mb-3">Technical Specifications</h3>
                      <table className="w-full text-sm">
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Tank Capacity</td>
                            <td className="py-2">{recommendedSystem?.tankSize || '150 Liters'}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Collector Area</td>
                            <td className="py-2">2.3 m²</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Max Working Pressure</td>
                            <td className="py-2">6 bar</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Tank Insulation</td>
                            <td className="py-2">50mm Polyurethane Foam</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Inner Tank Material</td>
                            <td className="py-2">Food Grade Stainless Steel 304</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-medium">Outer Tank Material</td>
                            <td className="py-2">Weather-resistant Galvanized Steel</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {activeTab === 'installation' && (
                    <div>
                      <h3 className="font-bold mb-3">Installation Requirements</h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>Roof must be able to support the weight of the system (~250kg when full)</li>
                        <li>Optimal orientation is due north (southern hemisphere) with a tilt angle equal to latitude</li>
                        <li>Minimum water pressure of 1 bar required</li>
                        <li>Maximum water pressure should not exceed 6 bar (pressure reducing valve recommended)</li>
                        <li>Electrical connection required for controller and backup element (220-240V AC)</li>
                        <li>Professional installation by certified technicians required to maintain warranty</li>
                      </ul>
                    </div>
                  )}
                  
                  {activeTab === 'warranty' && (
                    <div>
                      <h3 className="font-bold mb-4">Warranty Information</h3>
                      
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-medium mb-1">Water Heaters</h4>
                          <p>5 years</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">Thermal Controller</h4>
                          <p>1 year</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">Workmanship</h4>
                          <p>6 months</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600">
                        Warranty is subject to proper installation by authorized technicians and regular maintenance as specified in the product manual.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Alternative Options */}
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold">Alternative Options</h2>
                  <p className="text-gray-600 text-sm">Other systems that match your requirements</p>
                </div>
                
                <div className="p-4">
                  {alternativeSystems.map((system, index) => (
                    <div key={index} className="p-4 border-b last:border-0">
                      <h3 className="font-bold">{system.model.replace(' Solar Water Heater', '')}</h3>
                      <p className="text-sm text-gray-600 mb-2">{system.tankSize}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Ksh {system.price.toLocaleString()}</span>
                        <button 
                          className="text-blue-600 text-sm hover:underline"
                          onClick={() => {
                            // Logic to select this alternative
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Assessment Summary */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold">Assessment Summary</h2>
                  <p className="text-gray-600 text-sm">Key factors that informed our recommendation</p>
                </div>
                
                <div className="p-6">
                  {assessmentData && (
                    <div className="space-y-5">
                      {/* Client Information */}
                      <div className="flex items-start">
                        <div className="mr-3">
                          <Building className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Client</h3>
                          <p className="text-sm text-gray-600">{assessmentData.client?.name || 'Not specified'}</p>
                          <p className="text-sm text-gray-600">{assessmentData.client?.budget || 'Standard'} budget</p>
                        </div>
                      </div>
                      
                      {/* Occupancy */}
                      <div className="flex items-start">
                        <div className="mr-3">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Occupancy</h3>
                          <p className="text-sm text-gray-600">{assessmentData.occupancy?.occupants || 'Not specified'} occupants</p>
                          <p className="text-sm text-gray-600">{assessmentData.occupancy?.buildingType || 'Residential'}</p>
                        </div>
                      </div>
                      
                      {/* Water Quality */}
                      <div className="flex items-start">
                        <div className="mr-3">
                          <Droplet className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Water Quality</h3>
                          <p className="text-sm text-gray-600">Source: {assessmentData.waterQuality?.source || 'Municipal'}</p>
                          <p className="text-sm text-gray-600">
                            {assessmentData.waterQuality?.source === "Borehole Water" 
                              ? "Indirect system recommended" 
                              : "Direct system suitable"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 pt-6 border-t">
                    <button 
                      onClick={handleBackToAssessment}
                      className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded flex justify-center items-center"
                    >
                      Review Assessment
                      <ChevronLeft className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Download Brochure */}
              <div className="mt-6">
                <button 
                  className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded flex justify-center items-center"
                  onClick={() => {
                    // Logic to download product brochure
                    alert('Product brochure downloading... (simulation)');
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Product Brochure
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      
    </div>
  );
}