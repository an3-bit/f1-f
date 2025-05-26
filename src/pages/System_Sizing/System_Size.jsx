import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHandPointLeft, FaHandPointRight, FaCheckCircle } from "react-icons/fa";

const System_Size = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { backendData } = location.state || {}; // data from questionnaire page
  
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSystemSelect = (system) => {
    setSelectedSystem(system);
    setShowForm(true);
    // Scroll to the form
    setTimeout(() => {
      document.getElementById('customerForm').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
    if (!/^\d{10,12}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      errors.phoneNumber = "Please enter a valid phone number";
    }
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Please enter a valid email";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      
      // Create proposal object
      const proposalData = {
        id: `proposal-${Date.now()}`,
        customerInfo: formData,
        systemDetails: selectedSystem,
        additionalData: backendData,
        status: 'pending',
        submissionDate: new Date().toISOString()
      };
      
      // Get existing proposals from localStorage or initialize empty array
      const existingProposals = JSON.parse(localStorage.getItem('pendingProposals')) || [];
      
      // Add new proposal to array
      const updatedProposals = [...existingProposals, proposalData];
      
      // Save updated proposals back to localStorage
      localStorage.setItem('pendingProposals', JSON.stringify(updatedProposals));
      
      console.log("Form submitted and saved to localStorage:", proposalData);
      
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Redirect after showing success message
      setTimeout(() => {
        navigate('/submission-success', {
          state: {
            customerInfo: formData,
            selectedSystem: selectedSystem,
            fullData: backendData
          }
        });
      }, 2000);
    }
  };

  const handleBack = () => {
    navigate('/questionnaire');
    alert("Navigating back to questionnaire....");
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormErrors({});
  };

  if (!backendData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="text-red-600 font-semibold text-xl mb-4">No recommendations found.</div>
          <button 
            onClick={() => navigate('/questionnaire')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Return to Questionnaire
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mb-4 shadow-md rounded-xl shadow-primary_yellow">
      <h1 className="text-2xl font-bold mb-6">Recommended Systems</h1>
      
      <div className="space-y-8">
        {backendData.recommended_systems.map((system, index) => (
          <div 
            key={index} 
            className={`bg-white p-6 rounded-xl shadow-lg ${system.is_primary ? 'border-2 border-yellow-400' : ''}`}
          >
            {system.is_primary && (
              <div className="bg-yellow-400 text-white text-xs font-bold uppercase tracking-wider py-1 px-2 rounded-full inline-block mb-2">
                Primary Recommendation
              </div>
            )}
            
            <h2 className="text-xl font-semibold text-blue-700">{system.name}</h2>
            
            <div className="mt-2">
              <strong>System Model: </strong>{system.model}
            </div>
            
            <p className="mt-2 text-gray-700">{system.description}</p>
            
            <div className="mt-4">
              <h3 className="font-semibold text-gray-800">Specifications</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-800">
                <li>
                  <strong>Tank Size:</strong> {system.specifications?.tank_size || 'Not specified'}
                </li>
                <li>
                  <strong>Collector Type:</strong> {system.specifications?.collector_type || 'Not specified'}
                </li>
                {system.specifications?.heat_output && (
                  <li>
                    <strong>Heat Output:</strong> {system.specifications.heat_output}
                  </li>
                )}
              </ul>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => handleSystemSelect(system)}
                className="bg-primary_yellow flex justify-center items-center gap-2 text-white px-4 py-2 rounded-full hover:scale-105 hover:opacity-95 transition-all duration-300 "
              >
                Send to engineer for approval
                <FaHandPointRight className="text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Information Form */}
      {showForm && (
        <div id="customerForm" className="mt-10 bg-blue-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Customer Information
            </h3>
            <button 
              onClick={handleCloseForm}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          {submitSuccess ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center">
              <FaCheckCircle className="mr-2" />
              <span>Your request has been submitted successfully! Redirecting...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-blue-100 p-4 rounded mb-4">
                <p className="font-medium">Selected System: {selectedSystem?.name}</p>
                <p className="text-sm text-gray-600">Model: {selectedSystem?.model}</p>
                {selectedSystem?.estimated_cost && (
                  <p className="text-sm text-gray-600">Estimated Cost: KSh {selectedSystem.estimated_cost}</p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`shadow appearance-none border ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  placeholder="Enter your full name"
                />
                {formErrors.fullName && <p className="text-red-500 text-xs italic mt-1">{formErrors.fullName}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
                  Phone Number *
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`shadow appearance-none border ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  placeholder="Enter your phone number"
                />
                {formErrors.phoneNumber && <p className="text-red-500 text-xs italic mt-1">{formErrors.phoneNumber}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`shadow appearance-none border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  placeholder="Enter your email address"
                />
                {formErrors.email && <p className="text-red-500 text-xs italic mt-1">{formErrors.email}</p>}
              </div>
              
              <div className="flex items-center justify-between mt-6">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : "Submit Request"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {backendData.water_quality_requirements && (
        <div className="mt-10 bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Water Quality Requirements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {backendData.water_quality_requirements.map((item, i) => (
              <div key={i} className="bg-white p-3 rounded shadow-sm">
                <span className="font-medium">{item.parameter}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {backendData.additional_components && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Additional Components
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {backendData.additional_components.map((component, i) => (
              <div key={i} className="bg-white p-3 rounded shadow-sm border border-gray-100">
                <div className="font-medium">{component.name}</div>
                <div className="text-sm text-gray-600">{component.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {backendData.technical_specifications && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Technical Specifications
          </h3>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {backendData.technical_specifications.map((spec, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{spec.parameter}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {backendData.installation_notes && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Installation Notes
          </h3>
          <ul className="list-disc ml-6 text-gray-800 space-y-1">
            {backendData.installation_notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {backendData.warranty && (
        <div className="mt-8 bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Warranty Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-sm text-gray-500">Tank</div>
              <div className="font-medium">{backendData.warranty.tank}</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-sm text-gray-500">Collector</div>
              <div className="font-medium">{backendData.warranty.collector}</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-sm text-gray-500">Parts</div>
              <div className="font-medium">{backendData.warranty.parts}</div>
            </div>
          </div>
        </div>
      )}

      {backendData.reasoning && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Reasoning
          </h3>
          <p className="text-gray-800 bg-white p-4 rounded-lg shadow-sm">
            {backendData.reasoning}
          </p>
        </div>
      )}

      {backendData.additional_considerations && backendData.additional_considerations.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Additional Considerations
          </h3>
          <ul className="list-decimal ml-6 text-gray-800 space-y-1 bg-white p-4 rounded-lg shadow-sm">
            {backendData.additional_considerations.map((consideration, index) => (
              <li key={index}>{consideration}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-pink-100 rounded-xl p-4 mt-8 flex justify-between items-center">
        <p className="font-bold">NOT SATISFIED?</p>
        <button 
          onClick={handleBack} 
          className="hover:scale-105 hover:opacity-90 duration-300 transition-all flex bg-red-500 px-4 py-2 text-white font-semibold rounded-xl justify-center items-center gap-2"
        >
          <FaHandPointLeft /> Back to Questionnaire
        </button>
      </div>
    </div>
  );
};

export default System_Size;