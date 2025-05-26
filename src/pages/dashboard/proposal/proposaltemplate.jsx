import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Download, FileText, ArrowLeft, Printer } from "lucide-react";
import logo from "../../../assets/logo.png";
import bank from "../../../assets/payment.png"
import warranty from "../../../assets/warranty.png"



const ProposalTemplate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [proposalData, setProposalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processLocationData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (location.state?.backendData && location.state?.selectedSystem) {
          transformDataFromRecommendations(location.state.backendData, location.state.selectedSystem);
        } else if (location.state?.quoteData) {
          const productsWithDetails = await Promise.all(
            location.state.quoteData.products.map(async (product) => {
              try {
                if (!product.productNumber) return product;
                
                const response = await fetch(
                  `http://127.0.0.1:8000/erp/products/number/${product.productNumber}`
                );
                const data = await response.json();
                
                return {
                  ...product,
                  Unit_Price: data.value[0]?.Unit_Price || product.price,
                  Description: data.value[0]?.Description || product.model,
                };
              } catch (error) {
                console.error('Product fetch error:', error);
                return product;
              }
            })
          );
          transformProposalData({ ...location.state.quoteData, products: productsWithDetails });
        } else if (location.state?.proposal) {
          transformDataFromProposalPage(location.state.proposal);
        } else {
          handleLocalStorageFallback();
        }
      } catch (err) {
        setError(`Error loading proposal: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    const handleLocalStorageFallback = () => {
      try {
        const savedSystem = JSON.parse(localStorage.getItem('recommendedSystem'));
        const savedQuote = JSON.parse(localStorage.getItem('quoteData'));
        const savedProposal = JSON.parse(localStorage.getItem('currentProposal'));

        if (savedSystem) {
          transformDataFromRecommendations(createMockBackendData(savedSystem), savedSystem);
        } else if (savedQuote) {
          transformProposalData(savedQuote);
        } else if (savedProposal) {
          transformDataFromProposalPage(savedProposal);
        } else {
          setError("No proposal data available");
        }
      } catch (storageErr) {
        setError("Failed to load saved data");
      }
    };

    processLocationData();
  }, [location.state]);

  // Data Transformation Functions
  const transformDataFromProposalPage = (proposal) => {
    try {
      const clientData = JSON.parse(localStorage.getItem('selectedClient') || '{}');
      const transformed = createBaseTemplate({
        reference: proposal.quoteRef,
        client: {
          name: clientData.name || proposal.client,
          phone: clientData.details || proposal.phone,
          email: clientData.email || proposal.email,
          location: proposal.location
        },
        terms: { warranty: proposal.warranty }
      });

      if (proposal.total) {
        const price = parsePrice(proposal.total);
        transformed.requirements = [createSystemRequirement(price)];
      } else {
        transformed.requirements = [createDefaultRequirement()];
      }

      setProposalData(transformed);
    } catch (err) {
      setError("Failed to process proposal data");
    }
  };

  const transformDataFromRecommendations = (backendData, selectedSystem) => {
    try {
      const clientData = JSON.parse(localStorage.getItem('selectedClient') || '{}');
      const transformed = createBaseTemplate({
        reference: backendData.quotation_number,
        client: {
          name: clientData.name || localStorage.getItem('userName'),
          phone: clientData.details,
          email: clientData.email || localStorage.getItem('userEmail')
        },
        terms: { warranty: selectedSystem?.warranty }
      });

      if (selectedSystem) {
        transformed.requirements = [createSystemRequirement(selectedSystem.price)];
        const assessmentData = JSON.parse(localStorage.getItem('fullAssessmentData') || '{}');
        assessmentData?.additionalComponents?.forEach(component => {
          if (component.selected) {
            transformed.requirements.push(createComponentRequirement(component));
          }
        });
      }

      setProposalData(transformed);
    } catch (err) {
      setError("Failed to process recommendation data");
    }
  };

  const transformProposalData = (quoteData) => {
    try {
      const transformed = createBaseTemplate({
        reference: quoteData.reference,
        client: {
          name: quoteData.client?.Name,
          phone: quoteData.client?.Phone_No,
          email: quoteData.client?.E_Mail,
          location: quoteData.client?.Address
        }
      });
      // console.log("ref",backendData.quotation_number);
      

      if (quoteData.products?.length) {
        transformed.requirements = quoteData.products.map(product => ({
          title: product.Description || "Solar Water Heating System",
          description: product.Product_Model || "Solar component",
          items: [
            createItem(product.Description || product.model, product.quantity, product.Unit_Price, product.discount),
            createItem("Installation Fee", 1, 0, 0),
            createItem("Transport Fee", 1, 0, 0)
          ].map(calculateItemTotals),
          ...calculateTotals([
            product.Unit_Price * product.quantity * (1 - (product.discount / 100)),
            0, 0
          ])
        }));
      }

      setProposalData(transformed);
    } catch (err) {
      setError("Failed to process quote data");
    }
  };

  // Helper Functions
  const createBaseTemplate = (overrides) => ({
    reference: overrides.reference || `PROP-${Date.now().toString().slice(-6)}`,
    date: new Date().toLocaleDateString("en-GB"),
    title: "Solar Water Heating Proposal",
    client: {
      name: overrides.client?.name || "Client Name",
      phone: overrides.client?.phone || "254768372439",
      email: overrides.client?.email || "client@example.com",
      location: overrides.client?.location || "Nairobi, Kenya"
    },
    terms: {
      delivery: "Subject to availability during order placement",
      payment: "In full with order",
      validity: "30 days from quotation date",
      warranty: overrides.terms?.warranty || "Standard terms apply"
    },
    requirements: [],
    ...overrides
  });

  const createSystemRequirement = (price) => {
    const items = [
      createItem("Solar Water Heater", 1, price || 85000, 15),
      createItem("Installation Fee", 1, 0, 0),
      createItem("Transport Fee", 1, 0, 0)
    ];
    return { ...createRequirement("Solar Water Heating System", items), ...calculateTotals(items) };
  };

  const createComponentRequirement = (component) => {
    const items = [
      createItem(component.name, 1, component.price || 5000, 15),
      createItem("Installation Fee", 1, 0, 0),
      createItem("Transport Fee", 1, 0, 0)
    ];
    return { ...createRequirement(component.name, items), ...calculateTotals(items) };
  };

  const createRequirement = (title, items) => ({
    title,
    description: "Supply and installation component",
    items: items.map(calculateItemTotals)
  });

  const createItem = (name, quantity, rate, discount) => ({
    name, quantity, rate, discount,
    amount: rate * quantity * (1 - (discount / 100))
  });

  const calculateItemTotals = item => ({
    ...item,
    amount: Math.round(item.amount * 100) / 100
  });

  const calculateTotals = (items) => {
    const subTotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const vat = subTotal * 0.16;
    return {
      subTotal: Math.round(subTotal * 100) / 100,
      vat: Math.round(vat * 100) / 100,
      total: Math.round((subTotal + vat) * 100) / 100
    };
  };

  const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    const numericValue = parseFloat(price.replace(/[^0-9.]/g, ''));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  const createMockBackendData = (system) => ({
    quotation_number: `PROP-${Date.now().toString().slice(-6)}`,
    client: {
      Name: system.client?.name || "Client Name",
      Phone_No: system.client?.phone || "254768372439",
      E_Mail: system.client?.email || "client@example.com",
      Address: "Nairobi, Kenya"
    }
  });

  // Export Functions
  const handleExport = (format) => {
    console.log(`Exporting as ${format}...`);
    alert(`Exported as ${format} successfully!`);
  };

  const exportToWord = () => {
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>Solar Water Heating Proposal</title>
        <style>
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f2f2f2; }
          .header { margin-bottom: 20px; }
          .requirement { margin-bottom: 20px; }
          .total-section { margin-left: auto; width: 300px; background-color: #f9f9f9; padding: 10px; }
          .footer { margin-top: 30px; text-align: center; }
        </style>
      </head>
      <body>
    `;
    
    const proposalElement = document.getElementById('proposal-content');
    const proposalHTML = proposalElement.innerHTML;
    
    const footer = `
      </body>
      </html>
    `;
    
    const sourceHTML = header + proposalHTML + footer;
    const blob = new Blob([sourceHTML], { type: 'application/msword' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Proposal_${proposalData.reference}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Rendering Functions
  const formatCurrency = (amount) => 
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);

  const renderProposalContent = (data) => (
    <div id="proposal-content">
      <header className="mb-8">
        <div className="flex justify-between items-start w-full mb-6 bg-gray-100 border border-gray-200 p-4 shadow-md rounded-b-md">
          <div className="flex items-center w-1/2">
            <img src={logo} alt="Logo" className="h-full w-full object-cover" />
          </div>
          
          <div className="text-right w-fit self-start">
            <div className="bg-blue-600 text-gray-200 px-2 py-1 text-xs font-bold rounded-b">
              {["WATER PUMPS", "BOREHOLE SERVICE", "SWIMMING POOLS", 
                "WATER TREATMENT", "GENERATORS", "SOLAR EQUIPMENT", 
                "IRRIGATION"].map((text, idx) => (
                <p key={idx} className="whitespace-nowrap">{text}</p>
              ))}
            </div>
            
            <div className="mt-2 text-sm">
              <p>Ref: {data.reference}</p>
              <p>{data.date}</p>
            </div>
          </div>
        </div>

        <div className="mb-8 px-4">
          <h1 className="font-bold italic underline text-primary_yellow">Client Details</h1>
          <p className="font-bold text-lg">{data.client.name}</p>
          <p className="text-gray-600">+{data.client.phone}</p>
          <p className="text-gray-600">{data.client.email}</p>
          <p className="font-bold text-gray-700">{data.client.location}</p>
        </div>
      </header>

      <main className="px-4">
        <p>Dear Sir/Madam,</p>
        <h3 className="text-lg font-bold mb-4 border-b-2 border-blue-600 pb-2">
          RE: SUPPLY & INSTALLATION 
        </h3>
        <p className="mb-6 text-gray-700">
          We refer to your enquiry regarding the above and now wish to forward our offer to you, 
          terms and conditions as detailed below:
        </p>

        {data.requirements.map((requirement, index) => (
          <section key={index} className="mb-8">
          <h4 className="font-bold mb-2 text-blue-600">Requirement 1: {requirement.title}</h4>
          <p className="mb-4 text-gray-700">{requirement.description}</p>
        
          <table className="w-full mb-4 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {['S/No.', 'Equipment', 'Qty', 'Rate (KES)', 'Disc%', 'Amount (KES)'].map((header, idx) => (
                  <th key={idx} className="p-2 border text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requirement.items.map((item, idx) => {
                const discountRate = item.discount || 0;
                const amount = item.quantity * item.rate * (1 - discountRate / 100);
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-2 border">{idx + 1}</td>
                    <td className="p-2 border font-medium">{item.name}</td>
                    <td className="p-2 border">{item.quantity}</td>
                    <td className="p-2 border">{formatCurrency(item.rate)}</td>
                    <td className="p-2 border">{discountRate}</td>
                    <td className="p-2 border font-semibold">{formatCurrency(amount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        
          {/* Calculate Subtotal, VAT and Total */}
          {(() => {
            const subTotal = requirement.items.reduce((sum, item) => {
              const discountRate = item.discount || 0;
              const amount = item.quantity * item.rate * (1 - discountRate / 100);
              return sum + amount;
            }, 0);
        
            const vat = subTotal * 0.16;
            const total = subTotal + vat;
        
            return (
              <div className="ml-auto w-64 bg-gray-50 p-3 rounded-lg">
                {[
                  ['Sub-Total', subTotal],
                  ['Add 16% VAT', vat],
                  ['Total (KES)', total]
                ].map(([label, value], idx) => (
                  <div key={idx} className="flex justify-between mb-1">
                    <span className={idx === 2 ? 'font-bold' : ''}>{label}</span>
                    <span className={idx === 2 ? 'font-bold text-blue-600' : ''}>
                      {formatCurrency(value)}
                    </span>
                  </div>
                ))}
              </div>
            );
          })()}
        </section>
        
        ))}

        {data.requirements.length > 1 && (
          <div className="ml-auto w-64 bg-blue-50 p-3 rounded-lg mb-8">
            <div className="flex justify-between">
              <span className="font-bold">Grand Total (KES)</span>
              <span className="font-bold text-blue-600">
                {formatCurrency(data.requirements.reduce((sum, req) => sum + req.total, 0))}
              </span>
            </div>
          </div>
        )}

<div className="mt-10 text-sm text-gray-800">
  <h3 className="text-primary_yellow font-bold p-4">TERMS OF TRADE</h3>
  {/* Bank Account Details Image Placeholder */}
  <div className="mb-6">
    <img
      src={bank} 
      alt="Bank Account Details"
      className="w-full max-w-2xl mx-auto"
    />
    <h1 className="FLEX justify-center items-center text-red-600 text-sm ">THIS IS NOT A  TAX INVOICE. TAX INVOICE WILL BE ISSUED ONCE THE GOODS ARE SUPPLIED</h1>
  </div>

 
  <p className="mb-2"><strong className="text-primary_yellow">Payment</strong><br />In full with order</p>

  
  <p className="mb-2"><strong className="text-primary_yellow">Delivery</strong><br />Subject to availability of components during order placement.</p>

  
  <p className="mb-2">
    <strong className="text-primary_yellow">Warranty</strong><br />
    The pump equipment and accessories are warranted for 24-months, from date of installation for failures caused by faulty design, materials or workmanship.
  </p>
  <p className="mb-4">
    Please see our attached standard <a href="#" className="text-blue-600 underline">Terms of Warranty</a> document for more details.
  </p>

  <p className="mb-4">
    <strong className="text-primary_yellow">Force Majeure</strong><br />
    This proposal is for all intents and purposes executable subject to “Force Majeure” events which cannot reasonably be avoided by our diligent observation under circumstances, which are beyond our reasonable control and which make our performance of our responsibilities stated herein impossible or so impractical as reasonably to be considered impossible in the stated herein impossible or so impractical as reasonably to be considered impossible in the circumstances. Such events include but is not limited to, war, riots, civil disorder, earthquake, storm, flood or adverse weather conditions, strikes, lockouts or other industrial action, terrorist acts, acts of piracy, confiscation or any other action by government agencies.
  </p>

  <div className="mb-10">
    <img
      src={warranty} 
      alt="Dayliff Enhanced Warranty"
      className="w-full max-w-2xl mx-auto"
    />
  </div>

  
  <div className="shadow-md shadow-gray-400 rounded-2xl bg-blue-50 p-6 md:p-8 max-w-3xl mx-auto my-10 border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4 text-red-500">Price Confirmation Notice ‼️</h2>
      <ul className="space-y-3 text-gray-700 text-base leading-relaxed list-decimal">
        <li>
           All prices quoted are subject to confirmation at the time of order.
        </li>
        <li>
           Quoted prices are valid as of the proposal date. Any exchange rate variation exceeding 2% will result in a corresponding price adjustment.
        </li>
        <li>
           Should there be changes in statutory tax policies (e.g., VAT or import duties) at the time of order confirmation or receipt of goods, prices will be adjusted accordingly.
        </li>
        <li>
           Due to ongoing input cost uncertainties, this offer remains subject to final confirmation at the order date.
        </li>
        <li>
           Relevant product data sheets are attached. We await your further instructions.
        </li>
      </ul>
      <p className="mt-6 text-gray-700">
        If you have any questions, please feel free to contact us.
      </p>
    </div>
</div>


        <footer className="mt-12 text-center text-sm border-t-2 border-blue-600 pt-4">
          <p className="font-semibold">DAVIS & SHIRTLIFF LTD</p>
          <p>PO Box 41762-00100, Nairobi, Kenya</p>
          <p>Tel: (+254 20) 6968 000, 0711 079000</p>
          <p className="text-blue-600">sales@dayliff.com • davisandshirtliff.com</p>
        </footer>
      </main>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8 m-4 bg-white shadow">
      {loading ? (
        <div className="text-center p-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4">Fetching latest product prices...</p>
        </div>
      ) : error ? (
        <div className="text-center p-8">
          <div className="text-red-500 mb-4">{error}</div>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      ) : proposalData ? (
        <>
          {renderProposalContent(proposalData)}
          
          <div className="fixed bottom-4 right-4 flex gap-2">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 bg-gray-600 text-white rounded-full shadow-lg hover:bg-gray-700 transition"
              title="Go Back"
            >
              <ArrowLeft size={24} />
            </button>
            <button 
              onClick={() => window.print()}
              className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
              title="Print"
            >
              <Printer size={24} />
            </button>
            <button 
              onClick={() => handleExport('PDF')}
              className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition"
              title="Export as PDF"
            >
              <FileText size={24} />
            </button>
            <button 
              onClick={exportToWord}
              className="p-2 bg-blue-700 text-white rounded-full shadow-lg hover:bg-blue-800 transition"
              title="Export as Word"
            >
              <Download size={24} />
            </button>
          </div>
        </>
      ) : (
        <div className="text-center p-8">
          <div className="text-red-500 mb-4">Failed to load proposal data</div>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
};

export default ProposalTemplate;