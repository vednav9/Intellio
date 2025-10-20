import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, User } from "lucide-react";
import { useAuthStore } from "../store/authStore";

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "U";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name[0].toUpperCase();
  };

  return (
    <nav 
      role="navigation"
      aria-label="Main navigation"
      className="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm"
    >
      <div className="flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32 max-w-[1920px] mx-auto">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="focus:outline-none focus:ring-2 focus:ring-primary rounded-lg transition-transform hover:scale-105 active:scale-95"
          aria-label="Go to homepage"
        >
          <div className="flex items-center gap-2">
            <svg
              width="40"
              height="40"
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
            <span className="hidden sm:block font-semibold text-lg text-gray-800">
              Intellio
            </span>
          </div>
        </button>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {/* Go to Dashboard Button - Hidden on mobile */}
              <button
                onClick={() => navigate("/ai")}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Go to dashboard"
              >
                Dashboard
              </button>

              {/* User Avatar Button */}
              <button
                onClick={() => navigate("/ai")}
                className="group relative focus:outline-none focus:ring-2 focus:ring-primary rounded-full transition-transform hover:scale-105 active:scale-95"
                aria-label="Go to dashboard"
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-primary/20 hover:ring-primary/40 transition-all shadow-md">
                    {getUserInitials()}
                  </div>
                )}
                
                {/* Tooltip */}
                <div className="absolute -bottom-10 right-0 hidden group-hover:block">
                  <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
                    {user.name}
                  </div>
                </div>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* Sign In Button - Desktop */}
              <button
                onClick={() => navigate("/login")}
                className="hidden sm:flex items-center gap-2 px-6 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Sign in to your account"
              >
                Sign In
              </button>

              {/* Get Started Button */}
              <button
                onClick={() => navigate("/register")}
                className="group flex items-center gap-2 rounded-full text-sm font-medium cursor-pointer bg-primary text-white px-6 sm:px-10 py-2.5 transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Get started for free"
              >
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
