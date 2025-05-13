import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, BarChart, FileText, TrendingUp, Search, Book, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import ProductManual from '../Product_manual/product_manual';
// Import icons
const Card = ({ icon, title, description, buttonText, onClick }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col h-full">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${icon.bgColor}`}>
          {icon.component}
        </div>
        <h3 className="text-lg font-medium mb-2 font-sans">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow font-sans">{description}</p>
        <button 
          onClick={onClick} 
          className="mt-auto flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors font-sans"
        >
          {buttonText} {' '}
          <svg className="ml-1 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const ProductCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100 flex items-center">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-base font-sans">{title}</h3>
        <p className="text-gray-600 text-sm font-sans">{description}</p>
      </div>
    </div>
  );
};

const ProposalItem = ({ title, date, onView }) => {
  return (
    <div className="border-b border-gray-100 py-4 flex justify-between items-center">
      <div>
        <h3 className="font-medium text-lg font-sans">{title}</h3>
        <p className="text-gray-500 text-sm font-sans">{date}</p>
      </div>
      <button 
        onClick={onView}
        className="text-blue-500 hover:text-blue-700 font-medium text-sm font-sans"
      >
        View
      </button>
    </div>
  );
};

export default function Home1() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userInitials, setUserInitials] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  useEffect(() => {
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
  }, [navigate]);
  
  const handleSignOut = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    
    // Redirect to login page
    navigate('/', { replace: true });
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };
  
  const startAssessment = () => navigate('/assessment-dashboard');
  const createQuote = () => navigate('/quote1');
  const manageProposals = () => navigate('/proposal-generation');
  const planExpansion = () => navigate('/solar-system-expansion-planner');
  const viewProposal = (id) => navigate(`/proposals/${id}`);
  const openProductAssistant = () => navigate('/product-assistant');
  const goToProfile = () => navigate('/profile');
  const goToSettings = () => navigate('/settings');
 

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-sans">
      {/* Header with logo and user info */}
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
                href="/home1" 
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
                href="/solar-system-expansion-planner" 
                className="px-3 py-2 text-white hover:bg-blue-700 rounded-md transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/solar-system-expansion-planner');
                }}
              >
                <span>Future Expansion</span>
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

      {/* Main content */}
      <div className="w-full max-w-6xl p-8">
        {/* Hero section */}
        <div className="flex flex-col items-center justify-center py-12 mb-8 border-b border-gray-200">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
            <div className="text-blue-500">
              <svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" fill="none">
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
          <h1 className="text-4xl font-bold mb-2 text-center font-sans">AI Solar Water Dashboard</h1>
          <p className="text-gray-600 text-center max-w-2xl text-lg font-sans">
            Streamline your solar hot water system sizing, quoting, and proposal generation process
          </p>
        </div>

        {/* Main feature cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <Card
            icon={{
              component: <Settings className="w-5 h-5 text-blue-500" />,
              bgColor: "bg-blue-100"
            }}
            title="Triage & Sizing"
            description="Answer a series of questions about your client's hot water needs to get accurate system recommendations."
            buttonText="Start Assessment"
            onClick={startAssessment}
          />
          <Card
            icon={{
              component: <BarChart className="w-5 h-5 text-green-500" />,
              bgColor: "bg-green-100"
            }}
            title="Sales Quote"
            description="Create professional sales quotes with accurate pricing and component details directly in Business Central."
            buttonText="Create Quote"
            onClick={createQuote}
          />
          <Card
            icon={{
              component: <FileText className="w-5 h-5 text-purple-500" />,
              bgColor: "bg-purple-100"
            }}
            title="Proposal Generation"
            description="Generate professional proposals and bills of materials that can be downloaded, edited, and reuploaded."
            buttonText="Manage Proposals"
            onClick={manageProposals}
          />
          <Card
            icon={{
              component: <TrendingUp className="w-5 h-5 text-yellow-500" />,
              bgColor: "bg-yellow-100"
            }}
            title="Future Expansion"
            description="Analyze existing systems for potential upgrades or design new expansion solutions for growing needs."
            buttonText="Plan Expansion"
            onClick={planExpansion}
          />
        </div>

        {/* Product Knowledge Assistant Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-12">
          <ProductManual />
          
          
          
          
          {/* Product cards */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            <ProductCard
              icon={<div className="text-blue-500">☀</div>}
              title="Ultrasun UFS 150D"
              description="Flatplate Solar Water Heater - Direct System"
            />
            <ProductCard
              icon={<div className="text-blue-500">☀</div>}
              title="Ultrasun UVT 200"
              description="Evacuated Tube Solar Water Heater - 200L"
            />
            <ProductCard
              icon={<div className="text-blue-500">☀</div>}
              title="Ultrasun UFX 200D"
              description="Premium Flatplate Solar Water Heater - 200L"
            />
          </div>
          
          {/* Open Assistant button */}
          <div className="flex justify-center">
            <button 
              onClick={openProductAssistant}
              className="flex items-center justify-center bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition-colors font-sans"
            >
              <Book className="w-4 h-4 mr-2" />
              Open Product Assistant
            </button>
          </div>
        </div>

        {/* Recent Proposals Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <FileText className="w-5 h-5 mr-2 text-yellow-500" />
            <h2 className="text-xl font-bold font-sans">Recent Proposals</h2>
          </div>
          <p className="text-gray-600 mb-6 text-sm font-sans">
            Access your recently generated proposals and quotes
          </p>
          
          <div>
            <ProposalItem
              title="Oceanside Resort"
              date="2023-11-15"
              onView={() => viewProposal('oceanside')}
            />
            <ProposalItem
              title="Mountain View Apartments"
              date="2023-11-10"
              onView={() => viewProposal('mountain-view')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}