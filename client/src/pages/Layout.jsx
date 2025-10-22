import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { X, Menu, Bell, User, ChevronDown, LogOut, Settings, UserCircle } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import Sidebar from "../components/Sidebar";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "U";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name[0].toUpperCase();
  };

  // Get page title from route
  const getPageTitle = () => {
    if (location.pathname === "/ai") return "Dashboard";
    
    return location.pathname
      .split("/")
      .pop()
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar for Desktop */}
      <Sidebar className="hidden lg:flex" />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} isMobile />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Logo for Mobile */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer lg:hidden"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 31 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m8.75 11.3 6.75 3.884 6.75-3.885M8.75 34.58v-7.755L2 22.939m27 0-6.75 3.885v7.754M2.405 15.408 15.5 22.954l13.095-7.546M15.5 38V22.939M29 28.915V16.962a2.98 2.98 0 0 0-1.5-2.585L17 8.4a3.01 3.01 0 0 0-3 0L3.5 14.377A3 3 0 0 0 2 16.962v11.953A2.98 2.98 0 0 0 3.5 31.5L14 37.477a3.01 3.01 0 0 0 3 0L27.5 31.5a3 3 0 0 0 1.5-2.585"
                  stroke="#4F39F6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-semibold text-lg text-gray-800">
                Intellio
              </span>
            </div>

            {/* Page Title - Hidden on mobile */}
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-800">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 sm:gap-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {/* User Avatar */}
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-primary/20"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
                    {getUserInitials()}
                  </div>
                )}

                {/* User Info - Hidden on small screens */}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700 leading-tight">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 leading-tight">
                    {user?.email || "user@example.com"}
                  </p>
                </div>

                <ChevronDown className="w-4 h-4 text-gray-600 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {profileOpen && (
                <>
                  {/* Overlay for closing dropdown */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />

                  {/* Dropdown Content */}
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info in Dropdown */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-800">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email || "user@example.com"}
                      </p>
                      {user?.provider && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                          {user.provider === "google" ? "Google Account" : "Local Account"}
                        </span>
                      )}
                    </div>

                    

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
