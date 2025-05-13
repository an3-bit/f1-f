import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo2 from "../../assets/logobg.png";
import quoteback from "../../assets/quotebackpng.png";

import ultrasun from "../../assets/ultrasun.jpg";

const quote2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSystem } = location.state || {};

  // Handle case where no system is selected
  if (!selectedSystem) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">No System Selected</h1>
          <p className="text-gray-700 mb-6">
            You haven't selected a solar heating system yet. Please go back and choose a system to generate your quotation.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg"
          >
            Back to System Selection
          </button>
        </div>
      </div>
    );
  }

  // Safely generate quotation data with fallback values
  const generateQuotationData = () => {
    const baseCost = selectedSystem?.estimated_cost || 0;
    
    return {
      id: `QUO-${Math.floor(Math.random() * 9000 + 1000)}`,
      date: new Date().toLocaleDateString('en-GB'),
      clientName: "Client Name",
      clientEmail: "client.email@example.com",
      clientPhone: "+254796871876",
      solarSystem: selectedSystem?.name || "Solar Heating System",
      systemDescription: selectedSystem?.description || "High-efficiency solar heating system",
      technicianRequired: true,
      warranty: "5 years",
      imageType: selectedSystem?.name?.includes("Ultrasun") ? "Ultrasun F2" : "Other",
      specifications: selectedSystem?.specifications || {},
      components: [
        { 
          name: "Solar Collector", 
          quantity: 1, 
          unitPrice: Math.round(baseCost * 0.6),
          description: selectedSystem?.specifications?.collector_type || "High-performance collector"
        },
        { 
          name: "Storage Tank", 
          quantity: 1, 
          unitPrice: Math.round(baseCost * 0.3),
          description: `${selectedSystem?.specifications?.capacity || 'Standard'} capacity tank`
        },
        { 
          name: "Installation Kit", 
          quantity: 1, 
          unitPrice: Math.round(baseCost * 0.1),
          description: "Complete installation package"
        }
      ],
      clientLocation: "Your Location"
    };
  };

  const quotationData = generateQuotationData();
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

        <div className="text-right w-fit  space-y-2 self-start">
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
              <h2 className="text-primary_yellow italic font-semibold">Requirement: Solar WAter Heater</h2>
              <p>Supply and Installation of... {quotationData.model}</p>
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
                    <td className="p-3 text-right  font-medium">
                      {(item.unitPrice * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-blue-300 font-semibold text-gray-800">
                  <td colSpan="4" className="p-3 text-right">Total Amount:</td>
                  <td className="p-3 text-right text-green-600 ">
                    {totalAmount.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="px-6 pb-6">
        <div className="p-4 bg-white text-gray-800 text-sm space-y-6">
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
          The {quotationData.solarSystem} and accessories are warranted for <strong>24-months</strong>, from date of installation for
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
        We enclose relevant manufacturers’ pamphlets detailing the equipment offered and look forward to your further
        instructions in due course.
      </p>

      <div className="mt-6">
        <p>Yours faithfully,</p>
        <p className="font-bold mt-1">For DAVIS & SHIRTLIFF LTD</p>
        <p className="mt-1 italic">Sales Engineer Name</p>
      </div>
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
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg"
            >
              Back to Systems
            </button>
            <button
              onClick={() => alert("Contact us to confirm this quotation")}
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

export default quote2;