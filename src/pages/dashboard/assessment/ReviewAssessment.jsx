import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, User, Building, Droplet, CircleHelp, 
         Settings as SettingsIcon, LogOut } from 'lucide-react';
import Nav from '../../../components/navbar/nav';

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
  const [userName, setUserName] = useState('');
  const [userInitials, setUserInitials] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

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
    loadUserData();
  }, []);

  const loadUserData = () => {
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
  };

  const loadClientData = () => {
    const savedClient = localStorage.getItem('selectedClient');
    if (savedClient) {
      setClientData(JSON.parse(savedClient));
    }
  };

  const loadOccupancyData = () => {
    const savedOccupancy = localStorage.getItem('selectedOccupants');
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
        returnTo: '/home1',
        sectionKey: 'client'
      } 
    });
  };

  const handleOccupancyDetails = () => {
    navigate('/occupancy-details', { 
      state: { 
        returnTo: '/hom1',
        sectionKey: 'occupancy'
      } 
    });
  };

  const handleWaterQuality = () => {
    navigate('/water-quality', { 
      state: { 
        returnTo: '/home1',
        sectionKey: 'waterQuality'
      } 
    });
  };

  // Helper function to determine system type based on water source
  const determineSystemType = (waterSource) => {
    if (!waterSource) return "Direct";
    
    // Borehole water typically requires indirect systems due to mineral content
    if (waterSource.toLowerCase().includes('borehole')) {
      return "Indirect";
    }
    
    // Municipal/treated water can use direct systems
    if (waterSource.toLowerCase().includes('municipal') || 
        waterSource.toLowerCase().includes('treated') ||
        waterSource.toLowerCase().includes('tap')) {
      return "Direct";
    }
    
    // Default to indirect for safety with unknown water sources
    return "Indirect";
  };

  const handleGenerateRecommendations = async () => {
    // Set generating state to true
    setIsGenerating(true);
    
    // Determine system type based on water source
    const systemType = determineSystemType(waterQualityData?.source);
    
    // Ensure all required fields are strings as per API requirements
    const recommendationData = {
      propertyType: String(clientData?.type || "Residential Home"),
      occupants: String(occupancyData?.occupants || "1"),
      budget: String(clientData?.budget || "100000"),
      location: String(clientData?.address || waterQualityData?.location || "Nairobi"),
      existingSystem: String(clientData?.roofType || "Pitched(Mabati)"),
      timeline: String("Immediately"),
      waterSource: String(waterQualityData?.source || "Municipal Water"),
      electricitySource: String("Grid power (KPLC)"),
      systemType: String(systemType)
    };
    
    console.log('Sending data to recommendation API:', recommendationData);
    
    try {
      alert("Hitting it ....")
      const response = await fetch('api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recommendationData)
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Recommendation data received:", data);
        
        // Store data for recommendations page
        localStorage.setItem('recommendationData', JSON.stringify(data));
        
        // Navigate to recommendations page
        navigate('/recommendations', { state: { backendData: data } });
      } else {
        // Log more detailed error information
        const errorText = await response.text();
        console.error("Failed to get recommendations:", response.status, errorText);
        
        // Try to parse error response for more details
        try {
          const errorData = JSON.parse(errorText);
          console.error("Error details:", errorData);
          alert(`API Error: ${response.status}. ${errorData.detail || 'Please check console for details.'}`);
        } catch (parseError) {
          alert(`API Error: ${response.status}. Please check console for details.`);
        }
        
        // Reset generating state on error
        setIsGenerating(false);
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      alert("Error connecting to server. Please check your connection and try again.");
      // Reset generating state on error
      setIsGenerating(false);
    }
  }

  // Determine if we have the required data for recommendations
  const hasRequiredData = Boolean(
    occupancyData?.occupants && 
    (clientData?.address || waterQualityData?.location) && 
    waterQualityData?.source
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header/Navigation */}
     
      <Nav />
      
      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Assessment Review</h1>
              <p className="text-gray-600">Review your solar hot water system requirements</p>
            </div>
            <div>
              <button 
                className="bg-black text-white px-4 py-2 rounded flex items-center"
                onClick={handleGenerateRecommendations}
                disabled={!hasRequiredData || isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Recommendations'}
                {!isGenerating && <ArrowRight className="ml-2 h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Sidebar */}
            <div className="col-span-1">
              {/* Assessment Progress Card */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold mb-1">Assessment Progress</h2>
                <p className="text-gray-600 text-sm mb-4">Complete required sections</p>
                
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
                  <div 
                    onClick={handleClientSelect}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center">
                      {sections.client ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-gray-300 mr-2"></div>
                      )}
                      <div>
                        <div className="font-medium">Client Selection</div>
                        <div className="text-sm text-gray-500">
                          {sections.client ? `${clientData?.name || ''}` : 'Select a client'}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>

                  <div 
                    onClick={handleOccupancyDetails}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center">
                      {sections.occupancy ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-gray-300 mr-2"></div>
                      )}
                      <div>
                        <div className="font-medium">Occupancy Details</div>
                        <div className="text-sm text-gray-500">
                          {sections.occupancy ? 
                            `${occupancyData?.occupants || '0'} occupants` : 
                            'Enter occupancy'}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>

                  <div 
                    onClick={handleWaterQuality}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center">
                      {sections.waterQuality ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-gray-300 mr-2"></div>
                      )}
                      <div>
                        <div className="font-medium">Water Quality</div>
                        <div className="text-sm text-gray-500">
                          {sections.waterQuality ? 
                            `${waterQualityData?.source || 'Selected'}` : 
                            'Select water type'}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                <button 
                  className={`w-full py-3 rounded mt-6 ${
                    hasRequiredData && !isGenerating
                      ? 'bg-black text-white' 
                      : isGenerating
                        ? 'bg-gray-400 text-white cursor-wait'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!hasRequiredData || isGenerating}
                  onClick={handleGenerateRecommendations}
                >
                  {isGenerating ? 'Generating...' : hasRequiredData ? 'Generate Recommendations' : 'Complete Required Fields'}
                </button>
              </div>
            </div>
            
            {/* Main Content Area */}
            <div className="col-span-2">
              {/* Data Entry Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Client Card */}
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-50 p-1 rounded-full mr-2">
                      <User className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold">Client</h3>
                  </div>
                  
                  {clientData ? (
                    <div className="mb-3">
                      <h4 className="font-bold">{clientData.name}</h4>
                      <p className="text-sm text-gray-500">{clientData.address || "No address provided"}</p>
                    </div>
                  ) : (
                    <div className="mb-3 text-gray-500">
                      <p>No client selected</p>
                    </div>
                  )}
                  
                  <button 
                    className="w-full border border-gray-300 py-2 rounded text-sm"
                    onClick={handleClientSelect}
                  >
                    {clientData ? "Change" : "Select Client"}
                  </button>
                </div>
                
                {/* Occupancy Card */}
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center mb-3">
                    <div className="bg-green-50 p-1 rounded-full mr-2">
                      <Building className="h-5 w-5 text-green-500" />
                    </div>
                    <h3 className="text-lg font-bold">Occupancy</h3>
                  </div>
                  
                  {occupancyData ? (
                    <div className="mb-3">
                      <h4 className="font-bold">{occupancyData.buildingType}</h4>
                      <p className="text-sm text-gray-500">{occupancyData.occupants} occupants</p>
                    </div>
                  ) : (
                    <div className="mb-3 text-gray-500">
                      <p>No occupancy details</p>
                    </div>
                  )}
                  
                  <button 
                    className="w-full border border-gray-300 py-2 rounded text-sm"
                    onClick={handleOccupancyDetails}
                  >
                    {occupancyData ? "Edit" : "Add Details"}
                  </button>
                </div>
                
                {/* Water Quality Card */}
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-50 p-1 rounded-full mr-2">
                      <Droplet className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold">Water Source</h3>
                  </div>
                  
                  {waterQualityData ? (
                    <div className="mb-3">
                      <h4 className="font-bold">{waterQualityData.source}</h4>
                      <p className="text-sm text-gray-500">
                        {waterQualityData.source === "Borehole Water" 
                          ? "Requires indirect system" 
                          : "Direct system compatible"}
                      </p>
                      {waterQualityData.location && (
                        <p className="text-sm text-gray-500 mt-1">
                          Location: {waterQualityData.location}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mb-3 text-gray-500">
                      <p>No water source selected</p>
                    </div>
                  )}
                  
                  <button 
                    className="w-full border border-gray-300 py-2 rounded text-sm"
                    onClick={handleWaterQuality}
                  >
                    {waterQualityData ? "Change" : "Select Source"}
                  </button>
                </div>
              </div>
              
              {/* Assessment Status Message */}
              {hasRequiredData ? (
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 mt-6">
                  <div className="flex">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-green-800">Ready for Recommendations</h3>
                      <p className="text-green-700">
                        Required information has been provided. You can now generate recommendations.
                      </p>
                      <p className="text-sm text-green-600 mt-2">
                        System Type: {determineSystemType(waterQualityData?.source)} 
                        {waterQualityData?.source && ` (based on ${waterQualityData.source})`}
                      </p>
                      
                      <button 
                        className={`${isGenerating ? 'bg-gray-400' : 'bg-black'} text-white px-6 py-2 rounded flex items-center mt-4`}
                        onClick={handleGenerateRecommendations}
                        disabled={isGenerating}
                      >
                        {isGenerating ? 'Generating...' : 'Generate Recommendations'}
                        {!isGenerating && <ArrowRight className="ml-2 h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mt-6">
                  <div className="flex">
                    <CircleHelp className="h-6 w-6 text-amber-500 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-amber-800">Missing Required Information</h3>
                      <p className="text-amber-700">
                        Please complete these required fields before generating recommendations:
                      </p>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {!occupancyData?.occupants && (
                          <button 
                            className="bg-amber-100 text-amber-800 px-4 py-2 rounded"
                            onClick={handleOccupancyDetails}
                          >
                            Number of Occupants
                          </button>
                        )}
                        
                        {!clientData?.address && !waterQualityData?.location && (
                          <button 
                            className="bg-amber-100 text-amber-800 px-4 py-2 rounded"
                            onClick={handleWaterQuality}
                          >
                            Location
                          </button>
                        )}
                        
                        {!waterQualityData?.source && (
                          <button 
                            className="bg-amber-100 text-amber-800 px-4 py-2 rounded"
                            onClick={handleWaterQuality}
                          >
                            Water Source
                          </button>
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