import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Eye, Download, FileText, X, User, Settings, LogOut } from 'lucide-react';


export default function ProposalGenerationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [proposals, setProposals] = useState([]);
  
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isGeneratingForm, setIsGeneratingForm] = useState(false);
  const [proposalTitle, setProposalTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [proposalSearchQuery, setProposalSearchQuery] = useState('');
  const [filteredProposals, setFilteredProposals] = useState(proposals);
  const [userName, setUserName] = useState('');
  const [userInitials, setUserInitials] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Check for quote data passed from the sales quote page
  useEffect(() => {
    if (location.state && location.state.quoteData) {
      const quoteData = location.state.quoteData;
      
      // Create a quote object from the passed data
      const newQuote = {
        reference: quoteData.Reference || quoteData.No,
        client: quoteData.Sell_to_Customer_Name,
        date: formatDate(new Date().toISOString()),
        status: 'Open',
        total: quoteData.Amount_Expected ? `Ksh ${quoteData.Amount_Expected.toLocaleString()}` : 'Price not available',
        validUntil: formatDate(quoteData.Quote_Valid_Until_Date)
      };
      
      // Set as selected quote and open the generation form
      setSelectedQuote(newQuote);
      setIsGeneratingForm(true);
      setProposalTitle(`${newQuote.client} Solar Hot Water Proposal`);
      
      // Clear the state to prevent re-processing
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);
  
  // Filter proposals based on search query
  useEffect(() => {
    if (proposalSearchQuery.trim() === '') {
      setFilteredProposals(proposals);
    } else {
      const filtered = proposals.filter(proposal => 
        proposal.title.toLowerCase().includes(proposalSearchQuery.toLowerCase()) ||
        proposal.client.toLowerCase().includes(proposalSearchQuery.toLowerCase()) ||
        proposal.quoteRef.toLowerCase().includes(proposalSearchQuery.toLowerCase())
      );
      setFilteredProposals(filtered);
    }
  }, [proposalSearchQuery, proposals]);
  
  // Search quotes from API
  const searchQuotes = async () => {
    setIsLoading(true);
    
    try {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }
      
      // Check if the search query looks like a reference number
      if (searchQuery.includes('SQ') || searchQuery.includes('WE/Q') || searchQuery.includes('/')) {
        // Call the API endpoint to get quote details
        try {
          // Make the actual API call
          const response = await fetch(`http://127.0.0.1:8000/erp/get/sales-quote/${encodeURIComponent(searchQuery)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          
          // Use the actual API response data
          const data = await response.json();
          
          // Process the quote data to extract only what we need
          if (data && data['@odata.context'] && data.value && data.value.length > 0) {
            const quoteData = data.value[0];
            
            // Extract the necessary fields
            const processedQuote = {
              reference: quoteData.Reference || quoteData.No,
              client: quoteData.Sell_to_Customer_Name,
              date: formatDate(quoteData.Document_Date),
              status: quoteData.Status,
              total: calculateTotal(quoteData) || 'Price not available',
              validUntil: formatDate(quoteData.Quote_Valid_Until_Date)
            };
            
            setSearchResults([processedQuote]);
          } else {
            setSearchResults([]);
          }
          
        } catch (error) {
          console.error('Error fetching quote:', error);
          setSearchResults([]);
        }
      } else {
        // Search by client name
        try {
          // Replace with actual API call for client search
          const response = await fetch(`http://127.0.0.1:8000/erp/search/clients/${encodeURIComponent(searchQuery)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          setSearchResults(data);
        } catch (error) {
          console.error('Error searching clients:', error);
          setSearchResults([]);
        }
      }
    } catch (error) {
      console.error('Error searching quotes:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format date to a readable format
  const formatDate = (dateString) => {
    if (!dateString || dateString === '0001-01-01') return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };
  
  // Calculate total from quote data (placeholder - adjust based on your API response structure)
  const calculateTotal = (quoteData) => {
    // This is a placeholder. In a real implementation, you would extract and sum 
    // the line items from the quote or use a total field if available
    return quoteData.Amount_Expected ? `Ksh ${quoteData.Amount_Expected.toLocaleString()}` : 'Price not available';
  };
  
  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchQuotes();
  };
  
  // Handle proposal search input change
  const handleProposalSearchChange = (e) => {
    setProposalSearchQuery(e.target.value);
  };
  
  // Use selected quote
  const handleUseQuote = (quote) => {
    setSelectedQuote(quote);
    setIsSearchModalOpen(false);
    setIsGeneratingForm(true);
    
    // Pre-fill proposal title based on client name
    setProposalTitle(`${quote.client} Solar Hot Water Proposal`);
  };
  
  // Generate proposal
  const handleGenerateProposal = () => {
    setIsLoading(true);
  
    setTimeout(() => {
      const newProposal = {
        id: Date.now(), // Use timestamp as a unique ID
        title: proposalTitle,
        client: selectedQuote.client,
        quoteRef: selectedQuote.reference,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Draft',
        total: selectedQuote.total
      };
  
      const updatedProposals = [...proposals, newProposal];
      setProposals(updatedProposals);
      setFilteredProposals(updatedProposals);
      
      // Save to localStorage for persistence
      localStorage.setItem('proposals', JSON.stringify(updatedProposals));
      
      setIsGeneratingForm(false);
      setSelectedQuote(null);
      setIsLoading(false);
  
      // Navigate to proposal-template page with state
      navigate('/proposal-template', { state: { proposal: newProposal } });
    }, 1000);
  };
  
  // Cancel actions
  const handleCancel = () => {
    if (isSearchModalOpen) {
      setIsSearchModalOpen(false);
    }
    
    if (isGeneratingForm) {
      setIsGeneratingForm(false);
    }
    
    setSelectedQuote(null);
  };
 
  const handleViewProposal = (proposal) => {
    navigate('/proposal-template', { state: { proposal } });
  };
  
  const handleDownloadProposal = (proposal) => {
    navigate('/proposal-template', { state: { proposal, mode: 'download' } });
  };
  
  const handleEditProposal = (proposal) => {
    // Implement edit functionality
    console.log('Editing proposal:', proposal);
  };
  
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
    
    // Load existing proposals from localStorage or API
    const fetchProposals = async () => {
      try {
        // You can replace this with an actual API call
        const savedProposals = localStorage.getItem('proposals');
        if (savedProposals) {
          setProposals(JSON.parse(savedProposals));
          setFilteredProposals(JSON.parse(savedProposals));
        }
      } catch (error) {
        console.error('Error loading proposals:', error);
      }
    };
    
    fetchProposals();
  }, [navigate]);
  
  const goToProfile = () => navigate('/profile');
  const goToSettings = () => navigate('/settings');
  
  // Search Modal Component
  const SearchModal = () => {
    if (!isSearchModalOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Search Sales Quotes</h3>
            <button 
              onClick={() => setIsSearchModalOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          
          <p className="text-gray-600 mb-4">Search for existing sales quotes by reference number or client name.</p>
          
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter quote reference (e.g., WE/Q/DND/SDR/1007504)"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
          
          <div className="overflow-hidden border border-gray-200 rounded-lg mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
                  </tr>
                ) : searchResults.length > 0 ? (
                  searchResults.map((quote, index) => (
                    <tr key={index} className="hover:bg-blue-50 cursor-pointer" onClick={() => handleUseQuote(quote)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{quote.reference}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quote.client}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quote.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          quote.status === 'Accepted' || quote.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {quote.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quote.total}</td>
                    </tr>
                  ))
                ) : searchQuery ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No quotes found matching "{searchQuery}"</td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">Enter a search query to find quotes</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
            >
              Cancel
            </button>
            <button 
              onClick={() => selectedQuote && handleUseQuote(selectedQuote)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              disabled={!selectedQuote}
            >
              Use This Quote
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation */}
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
                href="/proposal-template" 
                className="px-3 py-2 bg-blue-700 text-white rounded-md transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/proposal-template');
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
                    <Settings className="mr-2 h-4 w-4" />
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Proposal Generation</h1>
          <p className="text-gray-600">Generate and manage proposals based on sales quotes.</p>
        </div>

        {isGeneratingForm ? (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Generate New Proposal</h2>
            <p className="text-gray-600 text-sm mb-6">Create a proposal from an existing sales quote</p>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
              <h3 className="font-medium mb-3">Selected Quote</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Reference:</p>
                  <p className="font-medium">{selectedQuote.reference}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Client:</p>
                  <p className="font-medium">{selectedQuote.client}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date:</p>
                  <p className="font-medium">{selectedQuote.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total:</p>
                  <p className="font-medium">{selectedQuote.total}</p>
                </div>
                {selectedQuote.validUntil && (
                  <div>
                    <p className="text-sm text-gray-500">Valid Until:</p>
                    <p className="font-medium">{selectedQuote.validUntil}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="proposalTitle" className="block text-sm font-medium text-gray-700 mb-1">Proposal Title</label>
              <input
                type="text"
                id="proposalTitle"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={proposalTitle}
                onChange={(e) => setProposalTitle(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <button 
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleGenerateProposal}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={isLoading || !proposalTitle.trim()}
              >
                <FileText size={16} className="mr-2" />
                {isLoading ? 'Generating...' : 'Generate Proposal'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">Generate New Proposal</h2>
                <p className="text-gray-600 text-sm">Create a proposal from an existing sales quote</p>
              </div>
            </div>
            
            <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
              <div className="flex justify-center mb-4">
                <FileText size={48} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">No quote selected</h3>
              <p className="text-gray-500 mt-2 mb-6">Search for a sales quote to generate a proposal.</p>
              <button 
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded mx-auto hover:bg-blue-700"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <Search size={16} className="mr-1" />
                Search Quotes
              </button>
            </div>
          </div>
        )}

        
          {/* Existing Proposals */}
          <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold">Existing Proposals</h2>
              <p className="text-gray-600 text-sm">View and download your generated proposals</p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search proposals..."
                className="px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={proposalSearchQuery}
                onChange={handleProposalSearchChange}
              />
              <div className="absolute left-3 top-2.5">
                <Search size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quote Ref
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProposals.map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {proposal.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {proposal.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {proposal.quoteRef}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {proposal.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        proposal.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}> 


                        {proposal.status}
                      </span>
                    </td>     
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleViewProposal(proposal)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDownloadProposal(proposal)}
                        className="text-green-600 hover:text-green-800 mr-2"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => handleEditProposal(proposal)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        <Settings size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredProposals.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No proposals found matching "{proposalSearchQuery}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main> 
      <SearchModal />
    </div>
  );
}