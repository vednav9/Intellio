import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

function Navbar() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();

  const userButtonAppearance = {
    elements: {
      userButtonAvatarBox: "w-10 h-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-all",
      userButtonPopoverCard: "shadow-xl",
    },
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
          <img
            src="/vite.svg"
            alt="Company logo"
            className="w-10 h-10"
          />
        </button>

        {/* Auth Section */}
        <div className="flex items-center">
          {isLoaded ? (
            user ? (
              <UserButton 
                appearance={userButtonAppearance}
                afterSignOutUrl="/"
              />
            ) : (
              <button
                onClick={openSignIn}
                className="group flex items-center gap-2 rounded-full text-sm font-medium cursor-pointer bg-primary text-white px-6 sm:px-10 py-2.5 transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Sign in to your account"
              >
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            )
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" aria-label="Loading user status" />
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
