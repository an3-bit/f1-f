import React, { useState, useEffect } from "react";
import { Download, FileText, Edit, ArrowLeft, Printer, ChevronDown, ChevronUp } from "lucide-react";
import logo from "../../../assets/logobg.png";
import quoteback from "../../../assets/quotebackpng.png";
import ultrasun from "../../../assets/ultrasun.jpg";

// Updated ProposalTemplate to accept and use real data from proposal generation page
const ProposalTemplate = ({ proposalData: initialData, onSave, onBack }) => {
  const [proposalData, setProposalData] = useState(initialData || {
    id: "QUO-5784",
    date: new Date().toLocaleDateString("en-GB"),
    validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString("en-GB"),
    clientName: "Oceanside Resort",
    clientEmail: "info@oceansideresort.com",
    clientPhone: "+254796871876",
    clientLocation: "Mombasa, Kenya",
    solarSystem: "Ultrasun UV200 Solar Water Heating System",
    systemDescription: "High-efficiency vacuum tube solar heating system with 200L capacity",
    systemModel: "Ultrasun UV200",
    technicianRequired: true,
    warranty: "24 months",
    specifications: {
      collector_type: "Vacuum Tube",
      capacity: "200L",
      net_area: "3.28m²"
    },
    components: [
      { 
        name: "Ultrasun UV200 Solar Water Heating System", 
        quantity: 1, 
        unitPrice: 72000,
        description: "Complete solar heating unit"
      },
      { 
        name: "Installation Fittings", 
        quantity: 1, 
        unitPrice: 17500,
        description: "Includes all necessary connection materials"
      },
      { 
        name: "Labour Works", 
        quantity: 1, 
        unitPrice: 13950,
        description: "Professional installation service"
      }
    ],
    additionalComponents: []
  });

  // Update local state when props change
  useEffect(() => {
    if (initialData) {
      setProposalData(initialData);
    }
  }, [initialData]);

  const [showPoolCover, setShowPoolCover] = useState(false);
  const [isSecondPageVisible, setIsSecondPageVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState("");

  // Calculate totals
  const subTotal = proposalData.components?.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity, 0
  ) || 0;
  
  const vat = subTotal * 0.16;
  const totalAmount = subTotal + vat;

  // Pool cover components
  const poolCoverComponents = [
    { name: "500mic Pool Cover - Trimmed to Fit", quantity: 53, unitPrice: 1300, description: "Custom pool cover" },
    { name: "Pool Cover Edge Binding", quantity: 60, unitPrice: 400, description: "Reinforced edges" },
    { name: "Pool Cover Roller Station", quantity: 1, unitPrice: 90000, description: "Roller mechanism" },
    { name: "Field Labour", quantity: 1, unitPrice: 15000, description: "Installation" }
  ];

  const poolCoverSubTotal = poolCoverComponents.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity, 0
  );
  
  const poolCoverVat = poolCoverSubTotal * 0.16;
  const poolCoverTotal = poolCoverSubTotal + poolCoverVat;

  // Handle adding pool cover to proposal
  const handleAddPoolCover = () => {
    if (!showPoolCover) {
      setProposalData({
        ...proposalData,
        additionalComponents: poolCoverComponents
      });
    } else {
      setProposalData({
        ...proposalData,
        additionalComponents: []
      });
    }
    setShowPoolCover(!showPoolCover);
  };

  // Handle print action
  const handlePrint = () => {
    window.print();
  };

  // Handle export action
  const handleExport = (format) => {
    setIsExporting(true);
    setExportFormat(format);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      setExportFormat("");
      alert(`Proposal exported as ${format} successfully!`);
    }, 1500);
  };

  // Handle back button click
  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  // Handle save proposal
  const handleSave = () => {
    if (onSave) {
      onSave(proposalData);
    }
  };

  // Component for the proposal header
  const ProposalHeader = () => (
    <div className="p-4">
      <div className="relative w-full h-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-blue-300 to-blue-500"></div>
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
              <div className="h-16 w-40 bg-white flex items-center justify-center text-blue-600 font-bold">
                DAVIS & SHIRTLIFF
              </div>
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
            <p>Ref.: {proposalData.id || proposalData.quoteRef}</p>
            <p>Date: {proposalData.date}</p>
            <p>Valid Until: {proposalData.validUntil}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Component for the proposal content
  const ProposalContent = () => (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h3 className="text-lg font-semibold text-yellow-500 mb-2">Client Information</h3>
        <div className="space-y-1 text-gray-700">
          <p><span className="font-medium">Name:</span> {proposalData.clientName}</p>
          <p><span className="font-medium">Email:</span> {proposalData.clientEmail}</p>
          <p><span className="font-medium">Phone:</span> {proposalData.clientPhone}</p>
          <p><span className="font-medium">Location:</span> {proposalData.clientLocation}</p>
        </div>

        <div className="py-2">
          <h1 className="underline font-semibold text-yellow-500">RE: SUPPLY OF {proposalData.solarSystem?.toUpperCase()}</h1>
          <p className="font-light">We refer to your enquiry regarding the above and now wish to forward our offer to you, terms and conditions
            as detailed below: -</p>
        </div>
        <div>
          <h2 className="text-yellow-500 italic font-semibold">Requirement: Solar Water Heater</h2>
          <p>Supply and Installation of {proposalData.systemModel}</p>
        </div>

        <h3 className="italic font-semibold text-yellow-500 mt-2 mb-2">Equipment</h3>
        <div className="space-y-1 text-gray-700">
          <p><span className="font-medium">System:</span> {proposalData.solarSystem}</p>
          <p><span className="font-medium">System Model:</span> {proposalData.systemModel}</p>
          <p><span className="font-medium">Description:</span> {proposalData.systemDescription}</p>
          <p><span className="font-medium">Specifications:</span></p>
          <ul className="ml-6 list-disc">
            <li>Collector Type: {proposalData.specifications?.collector_type}</li>
            <li>Tank Capacity: {proposalData.specifications?.capacity}</li>
            <li>Collector Area: {proposalData.specifications?.net_area}</li>
          </ul>
          <p>
            <span className="font-medium">Technician Required:</span> 
            <span className={`ml-2 font-semibold ${proposalData.technicianRequired ? "text-green-600" : "text-gray-600"}`}>
              {proposalData.technicianRequired ? "Yes (Recommended)" : "No"}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
          <img 
            src="/api/placeholder/200/200" 
            alt="Ultrasun Solar Water Heater" 
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    </div>
  );

  // Component for the price table
  const PriceTable = ({ items, subTotal, vat, total, title = "Price Schedule" }) => (
    <div className="px-6 pb-6">
      <h3 className="text-lg font-semibold text-yellow-500 mb-3">{title}</h3>
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
            {items && items.map((item, index) => (
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
            <tr className="border-t border-gray-300">
              <td colSpan="4" className="p-3 text-right font-medium">Sub-Total:</td>
              <td className="p-3 text-right font-medium">{subTotal.toLocaleString()}</td>
            </tr>
            <tr>
              <td colSpan="4" className="p-3 text-right font-medium">Add 16% VAT:</td>
              <td className="p-3 text-right font-medium">{vat.toLocaleString()}</td>
            </tr>
            <tr className="bg-blue-100 font-semibold text-gray-800">
              <td colSpan="4" className="p-3 text-right">Total Amount:</td>
              <td className="p-3 text-right text-green-600">
                {total.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );

  // Component for terms of trade
  const TermsOfTrade = () => (
    <div className="px-6 pb-6">
      <div className="p-4 bg-white text-gray-800 text-sm space-y-6">
        <h2 className="text-lg font-semibold underline text-yellow-500">Terms of Trade</h2>

        <div>
          <h3 className="font-medium text-yellow-500 italic">Delivery</h3>
          <p>
            Equipment available ex-stock subject to availability prior to order. Please allow for <strong>3No. weeks</strong> for
            assembly from date of order.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-yellow-500 italic">Payment</h3>
          <p>Full payment on order.</p>
        </div>

        <div>
          <h3 className="font-medium text-yellow-500 italic">Warranty</h3>
          <p>
            The {proposalData.solarSystem} and accessories are warranted for <strong>{proposalData.warranty}</strong>, from date of installation for
            failures caused by faulty design, materials or workmanship.
          </p>
          <p className="mt-1">
            Please see our attached standard <span className="text-blue-500 underline cursor-pointer">Terms of Warranty</span> document for more details.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-yellow-500 italic">Validity</h3>
          <p>
            The prices indicated are subject to confirmation at the date of the order confirmation.
          </p>
          <p className="mt-1">
            The prices given in <strong>KES</strong> have been arrived at based on the current Central Bank of Kenya exchange rates
            as of <strong>{proposalData.date}</strong>. Should this rate vary by more than 3% at the time of order confirmation or
            importation of goods, Davis & Shirtliff reserves the right to adjust the prices accordingly.
          </p>
          <p className="mt-1">
            The above notwithstanding, please note that should the statutory tax policy (e.g., VAT/ Import duty) change
            from the status at the time of order confirmation, receipt of goods, or invoicing, the prices will be adjusted
            based on the new ruling rate at that time.
          </p>
        </div>
      </div>
    </div>
  );

  // Component for bank details
  const BankDetails = () => (
    <div className="px-6 pb-6">
      <h3 className="text-lg font-semibold text-yellow-500 mb-3">Bank Account Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-bold text-blue-600 mb-2">KES BANK ACCOUNT DETAILS</h4>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1 font-medium">Account Name:</td>
                <td>Davis & Shirtliff Ltd</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">Bank Name:</td>
                <td>Standard Chartered</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">Bank Branch:</td>
                <td>Chiromo</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">Currency:</td>
                <td>KES</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">Account No.:</td>
                <td>01040336377700</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">Bank Code:</td>
                <td>02084</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">Swift Code:</td>
                <td>SCBLKENXXXX</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-bold text-blue-600 mb-2">USD BANK ACCOUNT DETAILS</h4>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1 font-medium">Account Name:</td>
                <td>Davis & Shirtliff Ltd</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">Bank Name:</td>
                <td>NCBA Bank Kenya</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">Bank Branch:</td>
                <td>Upperhill</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">Currency:</td>
                <td>USD</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">Account No.:</td>
                <td>6621600042</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">Bank Code:</td>
                <td>07000</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">Swift Code:</td>
                <td>CBAFKENXXXX</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-4 text-center font-bold text-red-600">
        <p>THIS IS NOT A TAX INVOICE. TAX INVOICE WILL BE ISSUED ONCE THE GOODS ARE SUPPLIED.</p>
      </div>
    </div>
  );

  // Component for signature block
  const SignatureBlock = () => (
    <div className="px-6 pb-6">
      <div className="mt-6">
        <p>Yours faithfully,</p>
        <p className="font-bold mt-1">For DAVIS & SHIRTLIFF LTD</p>
        <p className="mt-1 italic">Sales Engineer Name</p>
        <div className="h-12"></div> {/* Space for signature */}
      </div>
    </div>
  );

  // Component for the footer image
  const FooterImage = () => (
    <div className="flex py-2 justify-center items-center">
      <div className="h-12 w-full bg-gray-200 flex items-center justify-center text-gray-500">
        DAVIS & SHIRTLIFF - QUALITY, INNOVATION, SERVICE
      </div>
    </div>
  );

  // Action toolbar
  const ActionToolbar = () => (
    <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
      <div className="bg-white p-2 rounded-full shadow-lg">
        <button 
          onClick={handleBack}
          className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full"
          title="Back"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      
      <div className="bg-white p-2 rounded-full shadow-lg">
        <button 
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
          title="Print"
        >
          <Printer size={24} />
        </button>
      </div>
      
      <div className="bg-white p-2 rounded-full shadow-lg">
        <button 
          onClick={() => handleExport('PDF')}
          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
          title="Export as PDF"
          disabled={isExporting}
        >
          {isExporting && exportFormat === 'PDF' ? (
            <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
          ) : (
            <FileText size={24} />
          )}
        </button>
      </div>
      
      <div className="bg-white p-2 rounded-full shadow-lg">
        <button 
          onClick={() => handleExport('Excel')}
          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full"
          title="Export as Excel"
          disabled={isExporting}
        >
          {isExporting && exportFormat === 'Excel' ? (
            <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
          ) : (
            <Edit size={24} />
          )}
        </button>
      </div>
      
      <div className="bg-white p-2 rounded-full shadow-lg">
        <button 
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
          title="Save Proposal"
        >
          <Download size={24} />
        </button>
      </div>
    </div>
  );

  // Navigation control for multi-page view
  const PageNavigation = () => (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg">
      <div className="flex space-x-2 p-2">
        <button 
          onClick={() => setIsSecondPageVisible(false)}
          className={`px-3 py-1 rounded-full ${!isSecondPageVisible ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Page 1
        </button>
        <button 
          onClick={() => setIsSecondPageVisible(true)}
          className={`px-3 py-1 rounded-full ${isSecondPageVisible ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Page 2
        </button>
      </div>
    </div>
  );

  // Options toolbar
  const OptionsToolbar = () => (
    <div className="fixed top-4 right-4 bg-white p-2 rounded-lg shadow-lg">
      <div className="flex items-center">
        <label className="flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={showPoolCover} 
            onChange={handleAddPoolCover}
            className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Include Pool Cover</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="relative bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 print:p-0">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none">
          {!isSecondPageVisible ? (
            <>
              <ProposalHeader />
              <ProposalContent />
              <PriceTable 
                items={proposalData.components} 
                subTotal={subTotal} 
                vat={vat} 
                total={totalAmount}
              />
              {showPoolCover && (
                <PriceTable 
                  items={poolCoverComponents} 
                  subTotal={poolCoverSubTotal} 
                  vat={poolCoverVat} 
                  total={poolCoverTotal}
                  title="Pool Cover - Optional"
                />
              )}
            </>
          ) : (
            <>
              <ProposalHeader />
              <TermsOfTrade />
              <BankDetails />
              <SignatureBlock />
              <FooterImage />
            </>
          )}
        </div>
      </div>
      
      <ActionToolbar />
      <PageNavigation />
      <OptionsToolbar />
    </div>
  );
};

export default ProposalTemplate;