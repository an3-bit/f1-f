import { useState } from 'react';
import {
  Search,
  Settings,
  TrendingUp,
  ArrowRight,
  User,
  LogOut,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  Loader
} from 'lucide-react';
import { FileText, ArrowDownToLine, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Nav from '../../../components/navbar/nav';
export default function SolarSystemExpansionPlanner() {
  const [currentPage, setCurrentPage] = useState('main');
  const [productNumber, setProductNumber] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    selected_system: '',
    current_capacity: '',
    current_users: '',
    location: '',
    target_capacity: '',
  });
  
  const navigate = useNavigate();

  const userName = 'John Doe';
  const userInitials = 'JD';

  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);
  const goToProfile = () => {
    alert('Navigate to profile page');
    setShowUserMenu(false);
  };
  const goToSettings = () => {
    alert('Navigate to settings page');
    setShowUserMenu(false);
  };
  const handleSignOut = () => {
    alert('Sign out user');
    setShowUserMenu(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async () => {
    // Reset any previous errors
    setError(null);
    setLoading(true);
    
    try {
      // Make sure numeric fields are converted to numbers
      const payload = {
        selected_system: formData.selected_system,
        current_capacity: Number(formData.current_capacity),
        current_users: Number(formData.current_users),
        location: formData.location,
        target_capacity: Number(formData.target_capacity),
      };

      // Validate that numeric fields are actually numbers
      if (isNaN(payload.current_capacity) || isNaN(payload.current_users) || isNaN(payload.target_capacity)) {
        throw new Error('Capacity and users fields must contain valid numbers');
      }

      console.log('Sending payload:', payload);

      const response = await fetch('http://localhost:8000/api/futureexpansion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Server error: ${errorData}`);
      }

      const data = await response.json();
      console.log('Recommendations:', data);
      setRecommendations(data);
      setCurrentPage('recommendations');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  const MainPage = () => (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">System Expansion Planning</h1>
      <p className="text-gray-600 mb-8">Upgrade existing systems or design new expansions for growing hot water needs</p>
      <div className="flex  justify-center gap-6 ">
       

        {/* Existing System */}
        <div className="relative  group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-2xl shadow-blue-30/50  transition-all duration-300 ease-in-out overflow-hidden w-full md:w-2/3">
          <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500 rounded-full -mr-12 -mt-12 opacity-50"></div>
          <div className="p-8">
          <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-3 rounded-full inline-flex mb-6 relative z-10 shadow-lg">
      <TrendingUp className="text-white" size={28} />
    </div>
            <h2 className="text-2xl font-bold mb-3">Existing System</h2>
            <p className="text-gray-600 mb-6">Analyze an existing system to identify upgrade opportunities.</p>
            <ul className="mb-6 space-y-2">
              <li className="flex items-start"><div className="text-yellow-500 mr-2">•</div><span>Search by product number</span></li>
              <li className="flex items-start"><div className="text-yellow-500 mr-2">•</div><span>Review current system details</span></li>
              <li className="flex items-start"><div className="text-yellow-500 mr-2">•</div><span>Generate upgrade recommendations</span></li>
            </ul>
            <button onClick={() => setCurrentPage('existingSystem')} className="bg-blue-500 text-white py-3 px-4 rounded-full w-full hover:bg-blue-600 transition-colors cursor-pointer flex items-center justify-center">
              Find Existing System <ArrowRight className="ml-2" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ExistingSystemPage = () => (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Existing System Details</h1>
      <p className="text-gray-600 mb-6">Provide details of the current system to assess upgrade opportunities.</p>
      <div className="space-y-4 bg-white border p-6 rounded-lg shadow-sm">
        <div>
          <label className="block font-medium mb-1">Selected System</label>
          <input
            type="text"
            name="selected_system"
            className="w-full border rounded-md px-4 py-2"
            placeholder="e.g. UFS150D"
            value={formData.selected_system}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Current Capacity (Liters)</label>
          <input
            type="number"
            name="current_capacity"
            className="w-full border rounded-md px-4 py-2"
            placeholder="Enter a number"
            value={formData.current_capacity}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Current Users</label>
          <input
            type="number"
            name="current_users"
            className="w-full border rounded-md px-4 py-2"
            placeholder="Enter a number"
            value={formData.current_users}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            className="w-full border rounded-md px-4 py-2"
            placeholder="e.g. Nairobi"
            value={formData.location}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Target Capacity (Liters)</label>
          <input
            type="number"
            name="target_capacity"
            className="w-full border rounded-md px-4 py-2"
            placeholder="Enter a number"
            value={formData.target_capacity}
            onChange={handleInputChange}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

<div className="flex items-center gap-4 pt-4">
  <button
    onClick={handleFormSubmit}
    disabled={loading}
    className={`${
      loading 
        ? 'bg-gradient-to-r from-blue-400 to-blue-500 cursor-not-allowed' 
        : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg'
    } text-white font-medium py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 shadow-md`}
  >
    {loading ? (
      <>
        <Loader className="animate-spin h-5 w-5 mr-2" />
        <span className="animate-pulse">Processing...</span>
      </>
    ) : (
      <>
        <span>Submit for Recommendations</span>
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </>
    )}
  </button>

  <button
    onClick={() => setCurrentPage('main')}
    disabled={loading}
    className={`${
      loading 
        ? 'text-white cursor-not-allowed bg-red-300' 
        : 'text-blue-600 hover:text-indigo-700 bg-blue-50'
    } font-medium py-3 px-6 rounded-xl flex items-center gap-2 transition-all border border-transparent hover:border-blue-100`}
  >
    <ChevronLeft className="h-5 w-5 transition-transform hover:-translate-x-1 " />
    Back to Overview
  </button>
</div>
      </div>
    </div>
  );

  const RecommendationsPage = () => {
    if (!recommendations) return null;
    
    const { 
      current_system, 
      additional_systems, 
      total_new_capacity, 
      capacity_breakdown, 
      reasoning, 
      installation_notes, 
      considerations 
    } = recommendations;
    
    // Helper function to format notes by converting markdown-style formatting to JSX
    const formatNoteText = (text) => {
      // Extract the label and content using regex
      const match = text.match(/^\d+\.\s+\*\*([^:]+):\*\*\s+(.+)$/);
      
      if (match) {
        const [_, label, content] = match;
        return (
          <>
            <span className="font-bold">{label}:</span> {content}
          </>
        );
      }
      
      // If no match found, return the original text with any ** removed
      return text.replace(/\*\*/g, '');
    };
    
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-6 flex items-center">
          <button
            onClick={() => setCurrentPage('existingSystem')}
            className="text-blue-600 flex items-center mr-4"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold">System Expansion Recommendations</h1>
        </div>
        
        <div className="bg-white border rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="w-full md:w-1/2">
              <h2 className="text-xl font-semibold mb-4">Current System</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Model:</span>
                  <span>{current_system.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Capacity:</span>
                  <span>{current_system.capacity} liters</span>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <h2 className="text-xl font-semibold mb-4">Recommended Addition</h2>
              <div className="bg-green-50 p-4 rounded-lg">
                {additional_systems.map((system, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Model:</span>
                      <span>{system.model}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Capacity:</span>
                      <span>{system.capacity} liters</span>
                    </div>
                    <p className="text-sm mt-2">{system.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Capacity Summary</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700">Existing System</h3>
                  <p>{capacity_breakdown.existing_system} liters</p>
                </div>
                {Object.entries(capacity_breakdown).map(([key, value]) => {
                  if (key !== 'existing_system') {
                    return (
                      <div key={key}>
                        <h3 className="font-medium text-gray-700">{key}</h3>
                        <p>{value} liters</p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between font-bold">
                  <span>Total New Capacity:</span>
                  <span>{total_new_capacity} liters</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Reasoning</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>{reasoning}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Installation Notes</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2">
                {installation_notes.map((note, index) => (
                  <li key={index} className="ml-5 list-disc">
                    {formatNoteText(note)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">Additional Considerations</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2">
                {considerations.map((consideration, index) => (
                  <li key={index} className="ml-5 list-disc">
                    {formatNoteText(consideration)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between gap-4">
  {/* Edit Button */}
  <button
    onClick={() => setCurrentPage('existingSystem')}
    className="group relative px-6 py-3 border-2 border-blue-500 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:border-blue-600 flex items-center gap-2"
  >
    <span className="relative z-10">Edit System Details</span>
    <svg
      className="w-4 h-4 transition-transform group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  </button>

  {/* Export PDF Button */}
  <button
    onClick={() => alert('Exported to pdf')}
    className="group bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-blue-200/50"
  >
    <FileText className="w-5 h-5" />
    <span>Export to PDF</span>
    <ArrowDownToLine className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
  </button>

  {/* Quote Button */}
  <button
    onClick={() => {
      alert('Navigating to Sales Quote');
      navigate('/quote1');
    }}
    className="group bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-green-200/50"
  >
    <ShoppingCart className="w-5 h-5" />
    <span>Quote This</span>
    <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
  </button>
</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <Nav />

      {/* Page View */}
      {currentPage === 'main' && <MainPage />}
      {currentPage === 'existingSystem' && <ExistingSystemPage />}
      {currentPage === 'recommendations' && <RecommendationsPage />}
    </div>
  );
}