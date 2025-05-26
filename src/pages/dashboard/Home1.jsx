import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, BarChart, FileText, TrendingUp, Search, Book, User, LogOut, Settings as SettingsIcon, X } from 'lucide-react';
import ProductManual from '../Product_manual/product_manual';
import PDFViewer from '../../components/PDFViewer';

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

const ProposalItem = ({ id, customerName, systemName, date, status, onView }) => {
  return (
    <div className="border-b border-gray-100 py-4 flex justify-between items-center">
      <div>
        <h3 className="font-medium text-lg font-sans">{customerName}</h3>
        <p className="text-gray-500 text-sm font-sans">{systemName}</p>
        <div className="flex items-center mt-1">
          <span className="text-xs text-gray-500">{new Date(date).toLocaleDateString()}</span>
          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${status === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : status === 'approved'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
            }`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>
      <button
        onClick={() => onView(id)}
        className="text-blue-500 hover:text-blue-700 font-medium text-sm font-sans"
      >
        View
      </button>
    </div>
  );
};

// Modal component for proposal details
const ProposalModal = ({ proposal, onClose, onGenerateQuote }) => {
  if (!proposal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <h2 className="text-xl font-bold font-sans">Proposal Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Info */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 font-sans">Customer Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Customer Name</p>
              <p className="font-medium">{proposal.customerInfo.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{proposal.customerInfo.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{proposal.customerInfo.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{proposal.customerInfo.address || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* System Details */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 font-sans">System Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">System Type</p>
              <p className="font-medium">{proposal.systemDetails.name || 'Standard Solar Water System'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`px-2 py-1 text-xs rounded-full ${proposal.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : proposal.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                }`}>
                {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Submission Date</p>
              <p className="font-medium">{new Date(proposal.submissionDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estimated Cost</p>
              <p className="font-medium">${proposal.systemDetails.estimatedCost || '0.00'}</p>
            </div>
          </div>
        </div>

        {/* System Components */}
        {proposal.systemDetails.components && proposal.systemDetails.components.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 font-sans">System Components</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2">
                {proposal.systemDetails.components.map((component, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{component.name}</span>
                    <span className="text-gray-600">{component.quantity || 1} x ${component.price || '0.00'}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Notes */}
        {proposal.notes && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 font-sans">Notes</h3>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{proposal.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onGenerateQuote(proposal.id)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Generate Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Home1() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userInitials, setUserInitials] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [pendingProposals, setPendingProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showProposalModal, setShowProposalModal] = useState(false);

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

    // Load pending proposals from localStorage
    const proposals = JSON.parse(localStorage.getItem('pendingProposals')) || [];
    setPendingProposals(proposals);
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

  // Updated viewProposal function to open modal instead of navigating
  const viewProposal = (id) => {
    // Find the proposal with the given ID
    const proposal = pendingProposals.find(prop => prop.id === id);

    if (proposal) {
      setSelectedProposal(proposal);
      setShowProposalModal(true);
    }
  };

  const closeProposalModal = () => {
    setShowProposalModal(false);
    setSelectedProposal(null);
  };

  // Handle generating a quote from a proposal
  const handleGenerateQuote = (proposalId) => {
    // Remove the proposal from pending proposals
    const updatedProposals = pendingProposals.filter(proposal => proposal.id !== proposalId);

    // Update state and localStorage
    setPendingProposals(updatedProposals);
    localStorage.setItem('pendingProposals', JSON.stringify(updatedProposals));

    // Store the current proposal details for the quote page
    if (selectedProposal) {
      localStorage.setItem('currentQuoteProposal', JSON.stringify(selectedProposal));
    }

    // Close the modal
    closeProposalModal();

    // Navigate to quote2 page
    navigate('/quote2');
  };

  const openProductAssistant = () => navigate('/pdf-viewer');
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
                className="px-3 py-2 text-white hover:bg-blue-700 rounded-md transition-colors relative"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/proposal-generation');
                }}
              >
                <span>Proposals</span>
                {pendingProposals.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {pendingProposals.length}
                  </span>
                )}
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

        {/* Product Knowledge Assistant Section - FIXED */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-12">
          <div className="mb-4">
            <ProductManual />
            <PDFViewer />
          </div>
          
          {/* <div className="mb-4">
            <PDFViewer />
          </div> */}

          {/* <div className="flex items-center justify-center mt-2">
            <div className="text-gray-600 text-sm mx-4 font-sans">Or</div>
          </div> */}

          {/* Open Assistant button - Made wider and closer to the component */}
          {/* <div className="flex justify-center mt-2">
            <button
              onClick={openProductAssistant}
              className="flex items-center justify-center bg-blue-500 text-white py-2 px-12 w-full max-w-md rounded-md hover:bg-blue-600 transition-colors font-sans"
            >
              <Book className="w-4 h-4 mr-2" />
              Get Product Manual
            </button>
          </div> */}
        </div>

        {/* Pending Client Proposals Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-yellow-500" />
              <h2 className="text-xl font-bold font-sans">Pending Client Proposals</h2>
            </div>
            {pendingProposals.length > 0 && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                {pendingProposals.length} Pending
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-6 text-sm font-sans">
            Review pending proposals and proceed to quotation after approval
          </p>

          <div>
            {pendingProposals.length > 0 ? (
              pendingProposals.map(proposal => (
                <ProposalItem
                  key={proposal.id}
                  id={proposal.id}
                  customerName={proposal.customerInfo.fullName}
                  systemName={proposal.systemDetails.name}
                  date={proposal.submissionDate}
                  status={proposal.status}
                  onView={viewProposal}
                />
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <div className="text-gray-400 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <p className="text-gray-500">No pending client proposals at the moment</p>
                <button
                  onClick={startAssessment}
                  className="mt-4 text-blue-500 hover:text-blue-700 font-medium text-sm font-sans"
                >
                  Start a new assessment
                </button>
              </div>
            )}
          </div>

          {pendingProposals.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={manageProposals}
                className="text-blue-500 hover:text-blue-700 font-medium text-sm font-sans flex items-center"
              >
                View all proposals
                <svg className="ml-1 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Proposal Modal */}
      {showProposalModal && selectedProposal && (
        <ProposalModal
          proposal={selectedProposal}
          onClose={closeProposalModal}
          onGenerateQuote={handleGenerateQuote}
        />
      )}
    </div>
  );
}