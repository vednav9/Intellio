import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Heading,
  ImageIcon,
  Scissors,
  Eraser,
  FileCheck,
  Users,
  Sparkles,
  X,
  Home,
} from "lucide-react";

function Sidebar({ className = "", onClose, isMobile = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      section: "Main",
      items: [
        {
          path: "/ai",
          name: "Dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      section: "AI Tools",
      items: [
        {
          path: "/ai/write-article",
          name: "Write Article",
          icon: FileText,
        },
        {
          path: "/ai/blog-title",
          name: "Blog Title",
          icon: Heading,
        },
        {
          path: "/ai/generate-images",
          name: "Generate Images",
          icon: ImageIcon,
        },
        {
          path: "/ai/remove-background",
          name: "Remove Background",
          icon: Scissors,
        },
        {
          path: "/ai/remove-object",
          name: "Remove Object",
          icon: Eraser,
        },
        {
          path: "/ai/review-resume",
          name: "Review Resume",
          icon: FileCheck,
        },
      ],
    },
    {
      section: "Community",
      items: [
        {
          path: "/ai/community",
          name: "Community",
          icon: Users,
        },
      ],
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <aside
      className={`w-64 bg-white border-r border-gray-200 flex flex-col shadow-lg ${className}`}
    >
      {/* Sidebar Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200">
        <div
          onClick={() => handleNavigation("/")}
          className="flex items-center gap-2 cursor-pointer group"
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
          <span className="font-semibold text-lg text-gray-800 group-hover:text-primary transition-colors">
            Intellio
          </span>
        </div>

        {/* Close button for mobile */}
        {isMobile && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Premium Badge */}
      <div className="px-4 pt-4">
        <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Premium Plan
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            5 credits remaining
          </p>
          <button className="w-full py-1.5 text-xs font-medium text-white bg-primary rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all">
            Upgrade Now
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        {menuItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {section.section}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={itemIdx}>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary text-white shadow-md shadow-primary/25"
                          : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Back to Home Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => handleNavigation("/")}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
