import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, X, Menu, User, LogOut, Home, Grid, PlusCircle } from "lucide-react";

export function Navbar({ user, logout, setSearch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearch(searchQuery);
      navigate("/home");
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearch("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Determine if the navbar should be transparent (only on landing page when at top)
  const isTransparent = location.pathname === "/" && !isScrolled && !isOpen;
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  // Don't show navbar on login or register pages
  if (isAuthPage) return null;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent 
          ? "bg-transparent" 
          : "bg-gray-900/95 backdrop-blur-sm shadow-lg border-b border-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to={user ? "/home" : "/"} className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mr-2 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                  <path d="M5 10a5 5 0 0110 0 5 5 0 01-10 0z" />
                </svg>
              </div>
              <span className="text-white text-xl font-bold">CollabSphere</span>
            </Link>
          </div>

          {/* Search bar - only show when user is logged in */}
          {user && (
            <div className={`hidden md:flex items-center flex-1 max-w-md mx-4 ${isSearchFocused ? "z-10" : ""}`}>
              <form onSubmit={handleSearchSubmit} className="w-full relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search posts..."
                  className="block w-full pl-10 pr-10 py-2 border border-gray-700 rounded-full leading-5 bg-gray-800/80 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:text-white transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </form>
            </div>
          )}

          {/* Desktop navigation links */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  to="/home" 
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    location.pathname === "/home" 
                      ? "text-white bg-gray-800/80 border border-gray-700" 
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <span className="flex items-center">
                    <Home className="h-4 w-4 mr-1.5" />
                    Home
                  </span>
                </Link>
                <Link 
                  to="/categories" 
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    location.pathname === "/categories" 
                      ? "text-white bg-gray-800/80 border border-gray-700" 
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <span className="flex items-center">
                    <Grid className="h-4 w-4 mr-1.5" />
                    Categories
                  </span>
                </Link>
                <Link 
                  to="/create" 
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors duration-200"
                >
                  <span className="flex items-center">
                    <PlusCircle className="h-4 w-4 mr-1.5" />
                    Create
                  </span>
                </Link>
                
                {/* User profile dropdown */}
                <div className="relative ml-3">
                  <div>
                    <button 
                      className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all"
                      onClick={() => navigate('/profile')}
                    >
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                        <span className="text-white font-bold">
                          {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={logout}
                  className="ml-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:translate-y-[-1px] transition-all duration-200"
                >
                  <span className="flex items-center">
                    <LogOut className="h-4 w-4 mr-1.5" />
                    Logout
                  </span>
                </button>
              </>
            ) : (
              location.pathname !== "/" ? (
                <Link 
                  to="/" 
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors duration-200"
                >
                  <span className="flex items-center">
                    <Home className="h-4 w-4 mr-1.5" />
                    Home
                  </span>
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-200 border border-gray-700 hover:text-white hover:border-gray-600 hover:bg-gray-800/50 transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="ml-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:translate-y-[-1px] transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-1 rounded-lg hover:bg-gray-800/50 transition-colors duration-200"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-gray-800/95 backdrop-blur-sm border-b border-gray-700`}
      >
        {/* Mobile search - only for logged in users */}
        {user && (
          <div className="px-4 pt-4 pb-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search posts..."
                className="block w-full pl-10 pr-10 py-2 border border-gray-700 rounded-full leading-5 bg-gray-800 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="submit"
                className={`${
                  searchQuery ? "block" : "hidden"
                } mt-2 w-full py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white`}
              >
                Search
              </button>
            </form>
          </div>
        )}
        
        <div className="px-4 pt-2 pb-4 space-y-1">
          {user ? (
            <>
              <Link 
                to="/home" 
                className={`flex items-center px-3 py-2.5 rounded-lg text-base font-medium ${
                  location.pathname === "/home" 
                    ? "text-white bg-gray-700 border border-gray-600" 
                    : "text-gray-300 hover:text-white hover:bg-gray-700/70"
                } transition-colors duration-200`}
              >
                <Home className="h-5 w-5 mr-3" />
                Home
              </Link>
              <Link 
                to="/categories" 
                className={`flex items-center px-3 py-2.5 rounded-lg text-base font-medium ${
                  location.pathname === "/categories" 
                    ? "text-white bg-gray-700 border border-gray-600" 
                    : "text-gray-300 hover:text-white hover:bg-gray-700/70"
                } transition-colors duration-200`}
              >
                <Grid className="h-5 w-5 mr-3" />
                Categories
              </Link>
              <Link 
                to="/create" 
                className="flex items-center px-3 py-2.5 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700/70 transition-colors duration-200"
              >
                <PlusCircle className="h-5 w-5 mr-3" />
                Create Post
              </Link>
              <Link 
                to="/profile" 
                className={`flex items-center px-3 py-2.5 rounded-lg text-base font-medium ${
                  location.pathname === "/profile" 
                    ? "text-white bg-gray-700 border border-gray-600" 
                    : "text-gray-300 hover:text-white hover:bg-gray-700/70"
                } transition-colors duration-200`}
              >
                <User className="h-5 w-5 mr-3" />
                My Profile
              </Link>
              <button 
                onClick={logout}
                className="flex items-center w-full mt-2 px-3 py-2.5 rounded-lg text-base font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md transition-all duration-200"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </>
          ) : (
            location.pathname !== "/" ? (
              <Link 
                to="/" 
                className="flex items-center px-3 py-2.5 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700/70 transition-colors duration-200"
              >
                <Home className="h-5 w-5 mr-3" />
                Home
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center justify-center px-3 py-2.5 rounded-lg text-base font-medium text-gray-200 border border-gray-700 hover:text-white hover:bg-gray-700/70 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center justify-center mt-2 px-3 py-2.5 rounded-lg text-base font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}