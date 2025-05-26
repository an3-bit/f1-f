import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowRight, 
  Droplets, 
  Info, 
  CheckCircle, 
  User, 
  Building, 
  Droplet, 
  CircleHelp, 
  Settings as SettingsIcon, 
  LogOut, 
  X
} from 'lucide-react';

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
  const [userName, setUserName] = useState('');
  const [userInitials, setUserInitials] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const returnTo = location.state?.returnTo || '/assessment-review';
  const sectionKey = location.state?.sectionKey || 'occupancy';

  const buildingData = [
    { type: 'Domestic residential houses', unit: 'person', rate: 30, label: 'Number of Persons' },
    { type: 'Educational Institutions such as colleges and boarding schools', unit: 'student', rate: 5, label: 'Number of Students' },
    { type: 'Health Institutions such as Hospitals, Health Centres, Clinics and similar medical facilities', unit: 'bed', rate: 50, label: 'Number of Beds' },
    { type: 'Hotels, Hostels, Lodges and similar premises providing boarding services', unit: 'bed', rate: 40, label: 'Number of Beds' },
    { type: 'Restuarants, Cafeterias and similar eating places', unit: 'meal', rate: 5, label: 'Number of Meals Served Daily' },
    { type: 'Laundries', unit: 'kilo of clothe', rate: 5, label: 'Kilos of Clothes Processed Daily' }
  ];

  const currentBuildingData = buildingData.find(item => item.type === buildingType) || buildingData[0];
  const completion = Math.round((Object.values(sections).filter(Boolean).length / Object.values(sections).length) * 100);

  useEffect(() => {
    const savedSections = localStorage.getItem('assessmentSections');
    const savedOccupants = localStorage.getItem('selectedOccupants');
    
    if (savedSections) {
      const parsed = JSON.parse(savedSections);
      setSections(parsed);
    }
    
    if (savedOccupants) {
      try {
        const parsed = JSON.parse(savedOccupants);
        if (parsed && parsed.occupants) {
          const value = Number(parsed.occupants);
          setOccupants(value);
          const savedBuildingData = buildingData.find(item => item.type === parsed.buildingType) || buildingData[0];
          setWaterDemand(calculateWaterDemand(value, savedBuildingData.rate));
          setBuildingType(parsed.buildingType || 'Domestic residential houses');
        }
      } catch(e) {
        const value = Number(savedOccupants);
        if (!isNaN(value)) {
          setOccupants(value);
          setWaterDemand(calculateWaterDemand(value, currentBuildingData.rate));
        }
      }
    }

    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name);
      const initials = name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase();
      setUserInitials(initials);
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const calculateWaterDemand = (num, rate) => num * rate;

  const handleOccupantsChange = (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value > 0) {
      setOccupants(value);
      setWaterDemand(calculateWaterDemand(value, currentBuildingData.rate));
      const occupancyData = {
        buildingType,
        occupants: value,
        location: localStorage.getItem('location') || ''
      };
      localStorage.setItem('selectedOccupants', JSON.stringify(occupancyData));
      const updatedSections = { ...sections, occupancy: true };
      localStorage.setItem('assessmentSections', JSON.stringify(updatedSections));
      setSections(updatedSections);
    } else {
      setOccupants('');
      setWaterDemand(0);
      localStorage.removeItem('selectedOccupants');
      const updatedSections = { ...sections, occupancy: false };
      localStorage.setItem('assessmentSections', JSON.stringify(updatedSections));
      setSections(updatedSections);
    }
  };

  const handleBuildingTypeChange = (e) => {
    const value = e.target.value;
    setBuildingType(value);
    setOccupants('');
    setWaterDemand(0);
    if (occupants > 0) {
      const occupancyData = {
        buildingType: value,
        occupants,
        location: localStorage.getItem('location') || ''
      };
      localStorage.setItem('selectedOccupants', JSON.stringify(occupancyData));
    }
    const updatedSections = { ...sections, occupancy: false };
    localStorage.setItem('assessmentSections', JSON.stringify(updatedSections));
    setSections(updatedSections);
  };

  const handleNextStep = () => {
    if (occupants) {
      navigate('/water-quality', {
        state: {
          returnTo: returnTo,
          sectionKey: 'waterQuality'
        }
      });
    } else {
      alert(`Please enter the ${currentBuildingData.label.toLowerCase()} to continue`);
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

  const handleReturnToReview = () => {
    navigate(returnTo);
  };

  const handleClientSelect = () => {
    navigate('/client-selection', {
      state: {
        returnTo: returnTo,
        sectionKey: 'client'
      }
    });
  };

  const handleWaterQuality = () => {
    navigate('/water-quality', {
      state: {
        returnTo: returnTo,
        sectionKey: 'waterQuality'
      }
    });
  };

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    navigate('/', { replace: true });
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };
  
  const toggleInfoModal = () => {
    setShowInfoModal(!showInfoModal);
  };
  
  const goToProfile = () => navigate('/profile');
  const goToSettings = () => navigate('/settings');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-2">
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
                <span className="font-medium text-lg text-white">AI Solar Water Dashboard</span>
              </div>
            </div>
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
      </div>

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Occupancy Details</h1>
              <p className="text-gray-600">Information about hot water demand</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
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
                          {sections.client ? 'Client selected' : 'Select a client'}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <div 
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
                            `${occupants} ${currentBuildingData.unit}${occupants > 1 ? 's' : ''}` : 
                            'Enter occupancy details'}
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
                            'Water source selected' : 
                            'Select water type'}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <button 
                  className="w-full py-3 rounded mt-6 bg-black text-white"
                  onClick={handleReturnToReview}
                >
                  Return to Review
                </button>
              </div>
            </div>
            <div className="col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Occupancy Information</h2>
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <label className="font-medium">Type of Building Premises</label>
                    <button 
                      className="ml-2 text-gray-400 hover:text-blue-500"
                      onClick={toggleInfoModal}
                    >
                      <Info size={16} />
                    </button>
                  </div>
                  <select
                    className="w-full border rounded-md py-2 px-3 text-gray-700"
                    value={buildingType}
                    onChange={handleBuildingTypeChange}
                  >
                    {buildingData.map((option) => (
                      <option key={option.type} value={option.type}>{option.type}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label className="flex items-center mb-2 font-medium">
                    <svg className="h-5 w-5 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {currentBuildingData.label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border rounded-md py-2 px-3 text-gray-700"
                    value={occupants}
                    onChange={handleOccupantsChange}
                    placeholder={`Enter ${currentBuildingData.label.toLowerCase()}`}
                  />
                  <p className="text-sm text-gray-500 mt-1">Required for sizing calculations</p>
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
                    <p className="text-sm text-blue-600 mt-1">
                      Calculation: {occupants} {currentBuildingData.unit}{occupants > 1 ? 's' : ''} × 
                      {currentBuildingData.rate} liters per {currentBuildingData.unit} = {waterDemand} liters
                    </p>
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  <button 
                    onClick={handleBackToClient} 
                    className="px-5 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                  >
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
      </main>

      {/* Information Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 mx-4 sm:mx-auto max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Hot Water Demand Calculations</h3>
              <button 
                onClick={toggleInfoModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type of Building Premises
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specific Daily Hot Water Demand (DHWD) in Litres per day at 60 °C
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {buildingData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                        {item.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.rate} per {item.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={toggleInfoModal}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}