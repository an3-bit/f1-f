import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo2 from "../../assets/logobg.png";
import quoteback from "../../assets/quotebackpng.png";
import ultrasun from "../../assets/ultrasun.jpg";

const Quote2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quotationData, setQuotationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        setIsLoading(true);
        
        // Check for directly passed data from the recommendations page
        const backendData = location.state?.quoteData;
        const selectedSystem = location.state?.selectedSystem;
        
        // Get system data from location state or localStorage
        const systemFromState = selectedSystem || location.state?.selectedSystem;
        const systemFromStorage = localStorage.getItem('recommendedSystem');
        const systemData = systemFromState || (systemFromStorage ? JSON.parse(systemFromStorage) : null);
        
        if (!systemData) {
          throw new Error("No system selected");
        }
        
        // Get user data from localStorage
        const userName = localStorage.getItem('userName') || location.state?.userName || "Client Name";
        const userPhone = localStorage.getItem('userPhone') || location.state?.userPhone || "254768372439";
        const userEmail = localStorage.getItem('userEmail') || location.state?.userEmail || "client.email@example.com";
        const userLocation = localStorage.getItem('userLocation') || location.state?.userLocation || "Your Location";
        
        // If we have data directly from the recommendations page via state
        if (backendData) {
          // Use the API response to format our quotation
          const formattedQuotation = formatQuotationData(backendData, systemData, userName, userPhone, userEmail, userLocation);
          setQuotationData(formattedQuotation);
          setIsLoading(false);
          return;
        }
        
        // If no data was passed directly, try to make an API call
        // Prepare request data
        const requestData = {
          product_number: systemData.model || systemData.productNumber || "UFS300I",
          phone_number: userPhone,
          name: userName
        };
        
        // Make API request to get quotation
        const response = await fetch('http://127.0.0.1:8000/erp/quotation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process the quotation data
        const formattedQuotation = formatQuotationData(data, systemData, userName, userPhone, userEmail, userLocation);
        setQuotationData(formattedQuotation);
      } catch (err) {
        console.error("Error fetching quotation:", err);
        setError(err.message);
        
        // Fallback to generating local quotation if API fails
        const systemFromStorage = localStorage.getItem('recommendedSystem');
        const systemFromState = location.state?.selectedSystem;
        const systemData = systemFromState || (systemFromStorage ? JSON.parse(systemFromStorage) : null);
        
        if (systemData) {
          // Get user data for fallback
          const userName = localStorage.getItem('userName') || location.state?.userName || "Client Name";
          const userPhone = localStorage.getItem('userPhone') || location.state?.userPhone || "254768372439";
          const userEmail = localStorage.getItem('userEmail') || location.state?.userEmail || "client.email@example.com";
          const userLocation = localStorage.getItem('userLocation') || location.state?.userLocation || "Your Location";
          
          const localQuotation = generateLocalQuotation(systemData, userName, userPhone, userEmail, userLocation);
          setQuotationData(localQuotation);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuotation();
  }, [location.state]);

  // Format the quotation data from API response
  const formatQuotationData = (apiData, systemData, userName, userPhone, userEmail, userLocation) => {
    // Extract the product info from the API response
    const product = apiData.product || {};
    
    // Use provided client info or fallback to localStorage values
    const clientName = userName || apiData.client_name || "Client Name";
    const clientEmail = userEmail || "client.email@example.com";
    const clientPhone = userPhone || apiData.phone_number || "254768372439";
    const clientLocation = userLocation || "Your Location";
    
    // Calculate component costs based on system price
    const baseCost = product.Unit_Price || systemData.price || 0;
    const collectorCost = Math.round(baseCost * 0.6);
    const tankCost = Math.round(baseCost * 0.3);
    const installationKit = Math.round(baseCost * 0.1);
    
    return {
      id: apiData.quotation_id || `QUO-${Math.floor(Math.random() * 9000 + 1000)}`,
      date: new Date().toLocaleDateString('en-GB'),
      clientName: clientName,
      clientEmail: clientEmail,
      clientPhone: clientPhone,
      clientLocation: clientLocation,
      solarSystem: product.Description || systemData.model || "Solar Heating System",
      model: product.Product_Model || systemData.modelCode || systemData.model || "SHW",
      systemDescription: systemData.description || "High-efficiency solar heating system",
      technicianRequired: true,
      warranty: systemData.warranty || "5 years",
      imageType: (product.Description || systemData.model || "").includes("Ultrasun") ? "Ultrasun F2" : "Other",
      specifications: {
        collector_type: systemData.collectorType || "Standard",
        capacity: systemData.tankSize || systemData.capacity || "Standard",
        suitable_for: systemData.peopleCapacity || "Standard household"
      },
      components: [
        { 
          name: "Solar Collector", 
          quantity: 1, 
          unitPrice: collectorCost,
          description: systemData.collectorType || "High-performance collector"
        },
        { 
          name: "Storage Tank", 
          quantity: 1, 
          unitPrice: tankCost,
          description: `${systemData.tankSize || systemData.capacity || 'Standard'} capacity tank`
        },
        { 
          name: "Installation Kit", 
          quantity: 1, 
          unitPrice: installationKit,
          description: "Complete installation package"
        }
      ],
      quotationText: apiData.quotation_text || ""
    };
  };

  // Generate a local quotation as fallback if API call fails
  const generateLocalQuotation = (selectedSystem, userName, userPhone, userEmail, userLocation) => {
    if (!selectedSystem) return null;
    
    // Use provided client info or fallback to defaults
    const clientName = userName || "Client Name";
    const clientEmail = userEmail || "client.email@example.com";
    const clientPhone = userPhone || "254768372439";
    const clientLocation = userLocation || "Your Location";
    
    // Calculate component costs based on system price
    const baseCost = selectedSystem.price || 0;
    const collectorCost = Math.round(baseCost * 0.6);
    const tankCost = Math.round(baseCost * 0.3);
    const installationKit = Math.round(baseCost * 0.1);
    
    return {
      id: `QUO-${Math.floor(Math.random() * 9000 + 1000)}`,
      date: new Date().toLocaleDateString('en-GB'),
      clientName: clientName,
      clientEmail: clientEmail,
      clientPhone: clientPhone,
      clientLocation: clientLocation,
      solarSystem: selectedSystem.model || "Solar Heating System",
      model: selectedSystem.modelCode || selectedSystem.productNumber || selectedSystem.model || "Standard Model",
      systemDescription: selectedSystem.description || "High-efficiency solar heating system",
      technicianRequired: true,
      warranty: selectedSystem.warranty || "5 years",
      imageType: selectedSystem.model?.includes("Ultrasun") ? "Ultrasun F2" : "Other",
      specifications: {
        collector_type: selectedSystem.collectorType || "Standard",
        capacity: selectedSystem.tankSize || selectedSystem.capacity || "Standard",
        suitable_for: selectedSystem.peopleCapacity || "Standard household"
      },
      components: [
        { 
          name: "Solar Collector", 
          quantity: 1, 
          unitPrice: collectorCost,
          description: selectedSystem.collectorType || "High-performance collector"
        },
        { 
          name: "Storage Tank", 
          quantity: 1, 
          unitPrice: tankCost,
          description: `${selectedSystem.tankSize || selectedSystem.capacity || 'Standard'} capacity tank`
        },
        { 
          name: "Installation Kit", 
          quantity: 1, 
          unitPrice: installationKit,
          description: "Complete installation package"
        }
      ]
    };
  };

  // Display loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Generating your quotation...</p>
        </div>
      </div>
    );
  }

  // Display error state
  if (error && !quotationData) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Generating Quotation</h1>
          <p className="text-gray-700 mb-6">
            {error}. Please try again or contact support.
          </p>
          <button
            onClick={() => navigate('/recommendations')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg"
          >
            Back to System Selection
          </button>
        </div>
      </div>
    );
  }

  // Handle case where no system is selected
  if (!quotationData) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">No System Selected</h1>
          <p className="text-gray-700 mb-6">
            You haven't selected a solar heating system yet. Please go back and choose a system to generate your quotation.
          </p>
          <button
            onClick={() => navigate('/recommendations')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg"
          >
            Back to System Selection
          </button>
        </div>
      </div>
    );
  }

  const totalAmount = quotationData.components.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">Your Solar Heating System Quotation</h1>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      <div className="p-4">
      <div className="relative w-full h-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary_yellow via-blue-300 to-blue-500"></div>

        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#f3f4f6"
            d="M0,64L40,90.7C80,117,160,171,240,181.3C320,192,400,160,480,149.3C560,139,640,149,720,149.3C800,149,880,139,960,128C1040,117,1120,107,1200,106.7C1280,107,1360,117,1400,122.7L1440,128L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
          ></path>
        </svg>
      </div>

      <div className="flex justify-between items-start bg-gray-100 border border-gray-200 p-4 shadow-md rounded-b-md">
        
        <div className="flex flex-col space-y-4 w-2/3">
          <div className="flex items-center space-x-4">
            <div className="mb-4 md:mb-0 flex justify-center">
              <img src={logo2} alt="Company Logo" className="h-" />
            </div>
           
          </div>
        </div>

        <div className="text-right w-fit space-y-2 self-start">
          <div className="bg-blue-600 text-gray-200 px-4 top-0 flex flex-col justify-center items-center text-sm font-bold p-2 rounded-b">
            <p>WATER PUMPS</p>
            <p>BOREHOLE SERVICE</p>
            <p>SWIMMING POOLS</p>
            <p>WATER TREATMENT</p>
            <p>GENERATORS</p>
            <p>SOLAR EQUIPMENT</p>
            <p>IRRIGATION</p>
          </div>

          <div className="text-xs mt-2 text-gray-700">
            <p>Ref.: {quotationData.id}</p>
            <p>Date: {quotationData.date}</p>
          </div>
        </div>
      </div>
    </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-primary_yellow mb-2">Client Information</h3>
            <div className="space-y-1 text-gray-700">
              <p><span className="font-medium">Name:</span> {quotationData.clientName}</p>
              <p><span className="font-medium">Email:</span> {quotationData.clientEmail}</p>
              <p><span className="font-medium">Phone:</span> {quotationData.clientPhone}</p>
              <p><span className="font-medium">Location:</span> {quotationData.clientLocation}</p>
            </div>

            <div className="py-2">
              <h1 className="underline font-semibold text-primary_yellow">RE: SUPPLY OF {quotationData.solarSystem}</h1>
              <p className="font-light">We refer to your enquiry regarding the above and now wish to forward our offer to you, terms and conditions
as detailed below: -</p>
            </div>
            <div>
              <h2 className="text-primary_yellow italic font-semibold">Requirement: Solar Water Heater</h2>
              <p>Supply and Installation of {quotationData.model}</p>
            </div>

            <h3 className="italic font-semibold text-primary_yellow mt-2 mb-2">Equipment</h3>
            <div className="space-y-1 text-gray-700">
              <p><span className="font-medium">System:</span> {quotationData.solarSystem}</p>
              <p><span className="font-medium">System Model:</span> {quotationData.model}</p>
              <p><span className="font-medium">Description:</span> {quotationData.systemDescription}</p>
              <p>
                <span className="font-medium">Technician Required:</span> 
                <span className={`ml-2 font-semibold ${quotationData.technicianRequired ? "text-green-600" : "text-gray-600"}`}>
                  {quotationData.technicianRequired ? "Yes (Recommended)" : "No"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            {quotationData.imageType === "Ultrasun F2" ? (
              <img src={ultrasun} alt="Solar System" className="w-48 h-48 object-contain" />
            ) : (
              <img src={ultrasun} alt="Solar System" className="w-48 h-48 object-contain" />
            )}
          </div>
        </div>

        {/* Components Table */}
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold text-primary_yellow mb-3">Price Schedule</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="p-3 text-left">Component</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-center">Quantity</th>
                  <th className="p-3 text-right">Unit Price (Ksh)</th>
                  <th className="p-3 text-right">Total (Ksh)</th>
                </tr>
              </thead>
              <tbody>
                {quotationData.components.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3 text-gray-600">{item.description}</td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right">{item.unitPrice.toLocaleString()}</td>
                    <td className="p-3 text-right font-medium">
                      {(item.unitPrice * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-blue-300 font-semibold text-gray-800">
                  <td colSpan="4" className="p-3 text-right">Total Amount:</td>
                  <td className="p-3 text-right text-green-600">
                    {totalAmount.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="px-6 pb-6">
        <div className="p-4 bg-white text-gray-800 text-sm space-y-6">
          {/* If there's API-provided quotation text, render it */}
          {quotationData.quotationText ? (
            <div dangerouslySetInnerHTML={{ __html: quotationData.quotationText }} />
          ) : (
            <>
              <h2 className="text-lg font-semibold underline text-primary_yellow">Terms of Trade</h2>

              <div>
                <h3 className="font-medium text-primary_yellow italic">Delivery</h3>
                <p>
                  Equipment available ex-stock subject to availability prior to order. Please allow for <strong>3No. weeks</strong> for
                  assembly from date of order.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-primary_yellow italic">Payment</h3>
                <p>Full on order.</p>
              </div>

              <div>
                <h3 className="font-medium text-primary_yellow italic">Warranty</h3>
                <p>
                  The {quotationData.solarSystem} and accessories are warranted for <strong>{quotationData.warranty}</strong>, from date of installation for
                  failures caused by faulty design, materials or workmanship.
                </p>
                <p className="mt-1">
                  Please see our attached standard <span className="text-blue-500 underline">Terms of Warranty</span> document for more details.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-primary_yellow italic">Validity</h3>
                <p>
                  The prices indicated are subject to confirmation at the date of the order confirmation.
                </p>
                <p className="mt-1">
                  The prices given in <strong>KES</strong> have been arrived at based on the current Central Bank of Kenya exchange rates
                  as of <strong>{quotationData.date}</strong>. Should this rate vary by more than 3% at the time of order confirmation or
                  importation of goods, Davis & Shirtliff reserves the right to adjust the prices accordingly.
                </p>
                <p className="mt-1">
                  The above notwithstanding, please note that should the statutory tax policy (e.g., VAT/ Import duty) change
                  from the status at the time of order confirmation, receipt of goods, or invoicing, the prices will be adjusted
                  based on the new ruling rate at that time.
                </p>
              </div>

              <p>
                We enclose relevant manufacturers' pamphlets detailing the equipment offered and look forward to your further
                instructions in due course.
              </p>

              <div className="mt-6">
                <p>Yours faithfully,</p>
                <p className="font-bold mt-1">For DAVIS & SHIRTLIFF LTD</p>
                <p className="mt-1 italic">Sales Engineer Name</p>
              </div>
            </>
          )}
        </div>
        <div className="flex py-2 justify-center items-center">
          <img src={quoteback} alt="quote image"/>
        </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Print Quotation
            </button>
            <button
              onClick={() => navigate('/recommendations')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg"
            >
              Back to Systems
            </button>
            <button
              onClick={() => {
                // Save quotation reference to localStorage
                localStorage.setItem('quotationReference', quotationData.id);
                alert("Your quotation has been saved. Reference: " + quotationData.id);
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quote2;