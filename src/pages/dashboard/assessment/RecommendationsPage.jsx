import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, CheckCircle, ArrowRight, User, Building, Droplet, Settings as SettingsIcon, LogOut, X } from 'lucide-react';

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [assessmentData, setAssessmentData] = useState(null);
  const [recommendationData, setRecommendationData] = useState(null);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [alternativeSystems, setAlternativeSystems] = useState([]);
  const [activeTab, setActiveTab] = useState('specifications');
  // const [userName, setUserName] = useState('');
  // const [userInitials, setUserInitials] = useState('');
  // const [showUserMenu, setShowUserMenu] = useState(false);
  const [productsData, setProductsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [generatingQuote, setGeneratingQuote] = useState(false);
  const [quoteCreated, setQuoteCreated] = useState(null);
  const [quoteData, setQuoteData] = useState(null);
  const [lineItemsStatus, setLineItemsStatus] = useState(null);

  
  useEffect(() => {
    const savedAssessment = localStorage.getItem('fullAssessmentData');
    
    // Prevent navigation loop
    if (!savedAssessment && location.pathname !== '/recommendations') {
      navigate('/recommendations');
      return;
    } else if (savedAssessment) {
      setAssessmentData(JSON.parse(savedAssessment));
    }
  
    const backendData = location.state?.backendData;
    const savedRecommendation = localStorage.getItem('recommendationData');
    
    if (backendData) {
      setRecommendationData(backendData);
      fetchSystemPrices(backendData.recommended_systems);
    } else if (savedRecommendation) {
      const parsedData = JSON.parse(savedRecommendation);
      setRecommendationData(parsedData);
      fetchSystemPrices(parsedData.recommended_systems);
    } else if (location.pathname !== '/review-assessment') {
      navigate('/review-assessment');
    }
  }, [navigate, location.pathname, location.state]); // Specific dependencies
  
  
   

  const fetchSystemPrices = async (systems) => {
    if (!systems || systems.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const pricesData = {};
    
    try {
      const fetchPromises = systems.map(async (system) => {
        const productNumber = system.product_number || getProductNumberFromSystem(system);
        
        if (!productNumber) {
          console.warn('Missing product number for system:', system);
          return null;
        }
        
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);
          
          const response = await fetch(
            `http://127.0.0.1:8000/erp/products/number/${productNumber}`,
            { signal: controller.signal }
          );
          
          clearTimeout(timeoutId);
          
          if (!response.ok) throw new Error(`ERP API returned status ${response.status}`);
          
          const data = await response.json();
          
          if (data?.value?.[0]) {
            const productInfo = data.value[0];
            return {
              systemId: system.id || system.model || system.name,
              productData: {
                productNumber: productNumber,
                unitPrice: productInfo.Unit_Price || 0,
                description: productInfo.Description || '',
                inventory: productInfo.Inventory || 0,
                model: productInfo.Product_Model || ''
              }
            };
          }
          return null;
        } catch (err) {
          console.error(`Error fetching ${productNumber}:`, err);
          return null;
        }
      });
      
      const results = await Promise.all(fetchPromises);
      results.forEach(result => {
        if (result) pricesData[result.systemId] = result.productData;
      });
      
      setProductsData(pricesData);
      processRecommendationData(systems, pricesData);
    } catch (error) {
      console.error("Error fetching prices:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProductNumberFromSystem = (system) => {
    if (system.product_number) return system.product_number;
    if (system.model) return convertModelToProductNumber(system.model);
    if (system.name) return extractProductNumber(system.name);
    return null;
  };

  const convertModelToProductNumber = (model) => {
    const modelMap = {
      'UFS300I': 'DSD300I',
      'UFS200I': 'DSD200I',
      'EST2000': 'EST2000',
      'UFS200D': 'DSD200',
      'UFS300D': 'DSD300'
    };
    return modelMap[model] || model;
  };

  const extractProductNumber = (name) => {
    const matches = name.match(/(DSD\d+[DI]?)|(UFS\d+[DI])/i);
    return matches ? matches[0].replace('UFS', 'DSD') : null;
  };

  const processRecommendationData = (systems, priceData) => {
    if (!systems?.length) return;
    
    const primarySystem = systems.find(sys => sys.is_primary) || systems[0];
    const convertedPrimary = convertToSystemFormat(primarySystem, priceData);
    if (!convertedPrimary) return;

    setSelectedSystem(convertedPrimary);
    
    const alternatives = systems
      .filter(sys => sys !== primarySystem)
      .map(sys => convertToSystemFormat(sys, priceData))
      .filter(sys => sys !== null);
    
    setAlternativeSystems(alternatives);
  };

  const convertToSystemFormat = (apiSystem, priceData) => {
    if (!apiSystem) return null;
    
    const productNumber = apiSystem.product_number || getProductNumberFromSystem(apiSystem);
    if (!productNumber) {
      console.error('Invalid system data - missing product number:', apiSystem);
      return null;
    }

    const productKey = apiSystem.id || apiSystem.model || apiSystem.name;
    const productInfo = priceData?.[productKey] || {};
    
    return {
      model: apiSystem.name || productInfo.description || 'Solar Hot Water System',
      type: apiSystem.name?.includes('INDIRECT') ? 'Indirect' : 'Direct',
      tankSize: apiSystem.specifications?.tank_size || 'Standard',
      collectorType: apiSystem.specifications?.collector_type || 'Flat Plate',
      heatOutput: apiSystem.specifications?.heat_output || 'Standard',
      peopleCapacity: apiSystem.specifications?.suitable_for || 
        (assessmentData?.occupancy?.occupants ? `Up to ${assessmentData.occupancy.occupants} people` : 'Standard'),
      price: productInfo.unitPrice || 0,
      unitPrice: productInfo.unitPrice || 0,
      warranty: recommendationData?.warranty?.tank || '5 years',
      description: apiSystem.description || productInfo.description || '',
      modelCode: productInfo.model || apiSystem.model || '',
      productNumber: productNumber,
      features: apiSystem.specifications?.features || ''
    };
  };

  // const toggleUserMenu = () => {
  //   setShowUserMenu(!showUserMenu);
  // };

  // const handleSignOut = () => {
  //   localStorage.removeItem('authToken');
  //   localStorage.removeItem('userName');
  //   localStorage.removeItem('userEmail');
  //   localStorage.removeItem('userType');
  //   navigate('/', { replace: true });
  // };

  // const goToProfile = () => navigate('/profile');
  // const goToSettings = () => navigate('/settings');

  const handleBackToAssessment = () => {
    navigate('/review-assessment');
  };

  const handleGenerateQuote = async () => {
    try {
      setGeneratingQuote(true);
      
      if (!selectedSystem?.productNumber) {
        throw new Error('Missing product information for selected system');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const customerResponse = await fetch(
        '/erp/Customer_Card/Phone_No/254768372439',
        { signal: controller.signal }
      );
      if (!customerResponse.ok) throw new Error("Customer not found");
      const customerData = await customerResponse.json();
      const customer = customerData.value[0];

      const quoteResponse = await fetch('/erp/sales-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Sell_to_Customer_No: customer.No,
          Salesperson_code: "AKIOKO",
          Responsibility_Center: "21010",
          Assigned_User_ID: "AKIOKO"
        }),
        signal: controller.signal
      });
      
      if (!quoteResponse.ok) throw new Error("Failed to create quote");
      const quoteResult = await quoteResponse.json();

      let lineItemsSuccess = 0;
      let lineItemsFailed = 0;
      
      try {
        const lineItemResponse = await fetch(
          '/erp/sales-quote-line',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              Document_Type: "Quote",
              Document_No: quoteResult.data.No,
              Type: "Item",
              Quantity: 1,
              No: selectedSystem.productNumber
            }),
            signal: controller.signal
          }
        );
        lineItemsSuccess = lineItemResponse.ok ? 1 : 0;
        lineItemsFailed = lineItemResponse.ok ? 0 : 1;
      } catch (error) {
        lineItemsFailed = 1;
        console.error('Failed to add line item:', error);
      }

      setQuoteData({
        ...quoteResult.data,
        client: customer,
        products: [{
          productNumber: selectedSystem.productNumber,
          model: selectedSystem.model,
          description: selectedSystem.description,
          unitPrice: selectedSystem.unitPrice,
          quantity: 1,
          totalPrice: selectedSystem.price,
          warranty: selectedSystem.warranty
        }]
      });
      
      setLineItemsStatus({
        success: lineItemsSuccess,
        failed: lineItemsFailed,
        total: 1
      });

      setQuoteCreated(true);
      clearTimeout(timeoutId);

    } catch (error) {
      console.error("Quote generation error:", error);
      alert(error.name === 'AbortError' 
        ? 'Request timed out. Please check your connection.'
        : `Error: ${error.message}`);
    } finally {
      setGeneratingQuote(false);
    }
  };

  const handleSelectAlternative = (system) => {
    setSelectedSystem(system);
    const currentSelected = selectedSystem;
    setAlternativeSystems(alternativeSystems.filter(s => s.model !== system.model).concat([currentSelected]));
  };

  const handleContinueToProposal = () => {
    if (!quoteData || !selectedSystem) {
      alert('Missing quote data. Please try regenerating the quote.');
      return;
    }

    navigate('/proposal-template', {
      state: {
        quoteData: {
          ...quoteData,
          systemDetails: {
            model: selectedSystem.model,
            type: selectedSystem.type,
            tankSize: selectedSystem.tankSize,
            collectorType: selectedSystem.collectorType,
            warranty: selectedSystem.warranty
          },
          client: quoteData.client,
          products: quoteData.products.map(p => ({
            ...p,
            installationNotes: recommendationData?.installation_notes || []
          }))
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 justify-center items-center">
        <div className="text-2xl font-bold">Loading recommendations...</div>
        <p className="mt-2 text-gray-600">Fetching product information from ERP system...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
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
            
            {/* <div className="relative">
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
            </div> */}
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
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
                  disabled={generatingQuote}
                  className={`bg-gradient-to-r from-primary_yellow to-black hover:opacity-90 hover:from-blue-500 hover:to-gray-500 text-white px-4 py-2 rounded flex items-center ${generatingQuote ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {generatingQuote ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Quote...
                    </>
                  ) : (
                    <>
                      Generate Quote
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {selectedSystem && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow mb-6 shadow-blue-300">
                  <div className="flex justify-between items-center p-6 border-b">
                    <div>
                      <h2 className="text-xl font-bold">Recommended System</h2>
                      <p className="text-gray-600 text-sm">based on your requirements and water quality</p>
                    </div>
                    <div className="bg-black text-white px-3 py-1 rounded-full text-sm">
                      {selectedSystem.type} System
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="bg-amber-50 p-6 rounded-lg mb-6">
                      <div className="flex items-start">
                        <div className="mr-4 text-amber-500 animate-spin">
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
                          <h3 className="text-xl font-bold text-amber-800">{selectedSystem.model}</h3>
                          {selectedSystem.productNumber && (
                            <div className="text-sm text-amber-600 mt-1">Product #: {selectedSystem.productNumber}</div>
                          )}
                          <p className="text-amber-700 mt-2">
                            {selectedSystem.description || 
                              `${selectedSystem.type} type solar hot water system providing excellent performance for domestic applications.`}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-gray-500 mb-1">Tank Size</h4>
                        <p className="font-bold">{selectedSystem.tankSize}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-gray-500 mb-1">Collector Type</h4>
                        <p className="font-bold">{selectedSystem.collectorType}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-gray-500 mb-1">Heat Output</h4>
                        <p className="font-bold">{selectedSystem.heatOutput}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-gray-500 mb-1">Suitable For</h4>
                        <p className="font-bold">{selectedSystem.peopleCapacity}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <h3 className="text-xl font-bold mb-4">Additional Components</h3>
                  
                  {recommendationData?.additional_components?.length > 0 ? (
                    recommendationData.additional_components.map((component, index) => (
                      <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-bold mb-1">{component.name.toUpperCase()}</h4>
                        <p className="text-gray-600 text-sm">{component.description}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-bold mb-1">SOLAR THERMAL CONTROLLER</h4>
                        <p className="text-gray-600 text-sm">
                          Programmable temperature controller for automatic operation.
                        </p>
                      </div>
                      
                      <div className="flex items-center mb-6">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <div>
                          <h4 className="font-bold">BACKUP HEATING ELEMENT</h4>
                          <p className="text-gray-600 text-sm">Electric heating element for temperature boosting during cloudy days.</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
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
                              <td className="py-2">{selectedSystem.tankSize}</td>
                            </tr>
                            {recommendationData?.technical_specifications?.map((spec, index) => (
                              <tr key={index} className="border-b">
                                <td className="py-2 font-medium">{spec.parameter}</td>
                                <td className="py-2">{spec.value}</td>
                              </tr>
                            ))}
                            {!recommendationData?.technical_specifications && (
                              <>
                                <tr className="border-b">
                                  <td className="py-2 font-medium">Collector Area</td>
                                  <td className="py-2">{selectedSystem.tankSize.includes('3000') ? '35 m²' : selectedSystem.tankSize.includes('2000') ? '23 m²' : '12 m²'}</td>
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
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                    
                    {activeTab === 'installation' && (
                      <div>
                        <h3 className="font-bold mb-3">Installation Requirements</h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                          {recommendationData?.installation_notes ? (
                            recommendationData.installation_notes.map((note, index) => (
                              <li key={index}>{note}</li>
                            ))
                          ) : (
                            <>
                              <li>Roof must be able to support the weight of the system when full</li>
                              <li>Optimal orientation is due north (southern hemisphere) with a tilt angle equal to latitude</li>
                              <li>Minimum water pressure of 1 bar required</li>
                              <li>Maximum water pressure should not exceed 6 bar (pressure reducing valve recommended)</li>
                              <li>Electrical connection required for controller and backup element (220-240V AC)</li>
                              <li>Professional installation by certified technicians required to maintain warranty</li>
                            </>
                          )}
                        </ul>
                      </div>
                    )}
                    
                    {activeTab === 'warranty' && (
                      <div>
                        <h3 className="font-bold mb-4">Warranty Information</h3>
                        
                        <div className="grid grid-cols-2 gap-6 mb-6">
                          {recommendationData?.warranty ? (
                            <>
                              <div>
                                <h4 className="font-medium mb-1">Tank</h4>
                                <p>{recommendationData.warranty.tank}</p>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-1">Collector</h4>
                                <p>{recommendationData.warranty.collector}</p>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-1">Parts</h4>
                                <p>{recommendationData.warranty.parts}</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <h4 className="font-medium mb-1">Water Heaters</h4>
                                <p>{selectedSystem.warranty}</p>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-1">Thermal Controller</h4>
                                <p>1 year</p>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-1">Workmanship</h4>
                                <p>6 months</p>
                              </div>
                            </>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600">
                          Warranty is subject to proper installation by authorized technicians and regular maintenance as specified in the product manual.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                {recommendationData?.water_quality_requirements && recommendationData.water_quality_requirements.length > 0 && (
                  <div className="bg-white rounded-lg shadow mb-6">
                    <div className="p-6 border-b">
                      <h2 className="text-xl font-bold">Water Quality Requirements</h2>
                      <p className="text-gray-600 text-sm">Recommended parameters for optimal system life</p>
                    </div>
                    
                    <div className="p-4">
                      <table className="w-full text-sm">
                        <tbody>
                          {recommendationData.water_quality_requirements.map((req, index) => (
                            <tr key={index} className="border-b last:border-0">
                              <td className="py-2 font-medium">{req.parameter}</td>
                              <td className="py-2">{req.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              
                {alternativeSystems.length > 0 && (
                  <div className="bg-blue-50 rounded-lg shadow mb-6 ">
                    <div className="p-6 border-b">
                      <h2 className="text-xl font-bold ">Alternative Options</h2>
                      <p className="text-gray-600 text-sm">Other systems that match your requirements</p>
                    </div>
                    
                    <div className="p-4">
                      {alternativeSystems.map((system, index) => (
                        <div key={index} className="p-4 g border-b gap-4 last:border-0">
                          <h3 className="font-bold">{system.model.replace(' SOLAR HOT WATER SYSTEM', '')}</h3>
                          <p className="text-sm text-gray-600 mb-2">{system.tankSize}, {system.type} system</p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold hidden">Ksh {system.price.toLocaleString()}</span>
                            <button 
                              className="text-blue-600 text-sm hover:underline"
                              onClick={() => handleSelectAlternative(system)}
                            >
                              Select This System
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        </main>

        {quoteCreated && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Quote Created Successfully</h3>
                <button
                  onClick={() => setQuoteCreated(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-green-600 font-medium mb-2">Your quote has been created!</p>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <p className="text-sm mb-1">
                    <span className="font-medium">Quote Number:</span> {quoteData?.No}
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-medium">Reference:</span> {quoteData?.Reference}
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-medium">Valid Until:</span>{" "}
                    {new Date(quoteData?.Quote_Valid_Until_Date).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Customer:</span> {quoteData?.client?.Name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Product:</span> {selectedSystem.productNumber}
                  </p>
                </div>

                {lineItemsStatus && (
                  <div className="mt-3">
                    <p className="text-sm">
                      <span className="font-medium">Products added: </span>
                      {lineItemsStatus.success} of {lineItemsStatus.total} successful
                      {lineItemsStatus.failed > 0 && (
                        <span className="text-orange-500"> ({lineItemsStatus.failed} failed)</span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  onClick={() => setQuoteCreated(false)}
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                  onClick={handleContinueToProposal}
                >
                  Continue to Proposal
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}