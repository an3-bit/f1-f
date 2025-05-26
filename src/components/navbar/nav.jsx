  import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, SettingsIcon } from 'lucide-react';
import { FaUserCircle } from 'react-icons/fa';

const Nav = () => {
  const navigate = useNavigate();

  // State for user name and initials
  const [userName, setUserName] = useState('');
  const [userInitials, setUserInitials] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Get user name from localStorage and set state
  React.useEffect(() => {
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

  const goToProfile = () => navigate('/profile');
  const goToSettings = () => navigate('/settings');

  // Toggle user menu visibility
  const toggleUserMenu = () => setShowUserMenu((prev) => !prev);

  // Handle user sign out
  const handleSignOut = () => {
    localStorage.removeItem('userName');
    navigate('/login', { replace: true });
  };

  return (
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
  );
};

export default Nav;