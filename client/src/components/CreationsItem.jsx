import React from "react";
import {
  FileText,
  ImageIcon,
  Heading,
  Scissors,
  Eraser,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Copy,
  ExternalLink,
} from "lucide-react";

function CreationsItem({ item, isExpanded, onToggleExpand }) {
  // Get icon based on type
  const getIcon = (type) => {
    const icons = {
      article: FileText,
      image: ImageIcon,
      title: Heading,
      "background-remove": Scissors,
      "object-remove": Eraser,
      resume: FileCheck,
    };
    return icons[type] || FileText;
  };

  // Get color scheme based on type
  const getTypeStyles = (type) => {
    const styles = {
      article: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        badge: "bg-blue-50 text-blue-600 border-blue-200",
      },
      image: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        badge: "bg-purple-50 text-purple-600 border-purple-200",
      },
      title: {
        bg: "bg-pink-100",
        text: "text-pink-700",
        badge: "bg-pink-50 text-pink-600 border-pink-200",
      },
      "background-remove": {
        bg: "bg-green-100",
        text: "text-green-700",
        badge: "bg-green-50 text-green-600 border-green-200",
      },
      "object-remove": {
        bg: "bg-orange-100",
        text: "text-orange-700",
        badge: "bg-orange-50 text-orange-600 border-orange-200",
      },
      resume: {
        bg: "bg-indigo-100",
        text: "text-indigo-700",
        badge: "bg-indigo-50 text-indigo-600 border-indigo-200",
      },
    };
    return (
      styles[type] || {
        bg: "bg-gray-100",
        text: "text-gray-700",
        badge: "bg-gray-50 text-gray-600 border-gray-200",
      }
    );
  };

  // Get button action based on type
  const getActionButton = (type) => {
    const buttons = {
      article: { label: "Read Article", icon: Eye },
      image: { label: "View Image", icon: ExternalLink },
      title: { label: "Copy Title", icon: Copy },
      "background-remove": { label: "Download", icon: Download },
      "object-remove": { label: "Download", icon: Download },
      resume: { label: "View Resume", icon: Eye },
    };
    return buttons[type] || { label: "View", icon: ExternalLink };
  };

  const Icon = getIcon(item.type);
  const typeStyles = getTypeStyles(item.type);
  const actionButton = getActionButton(item.type);
  const ActionIcon = actionButton.icon;

  // Format date
  const formattedDate = new Date(item.createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Format type name for display
  const formatTypeName = (type) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all">
      {/* Main Content - Always Visible */}
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-lg ${typeStyles.bg} flex items-center justify-center flex-shrink-0`}
          >
            <Icon className={`w-6 h-6 ${typeStyles.text}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Type Badge and Date */}
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${typeStyles.badge}`}
              >
                {formatTypeName(item.type)}
              </span>
              <span className="text-xs text-gray-500">{formattedDate}</span>
            </div>

            {/* Prompt */}
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold text-gray-900">Prompt:</span>{" "}
              {item.prompt}
            </p>

            {/* Preview (collapsed state) */}
            {!isExpanded && item.output && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.type === "image" && item.output.startsWith("http")
                  ? "Click to view generated image"
                  : item.output}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* View/Action Button */}
            <button
              className={`flex items-center gap-1.5 px-3 py-2 ${typeStyles.badge} rounded-lg text-xs font-medium hover:shadow-md transition-all hover:scale-105 active:scale-95`}
            >
              {actionButton.label}
              <ActionIcon className="w-3.5 h-3.5" />
            </button>

            {/* Expand/Collapse Button */}
            <button
              onClick={() => onToggleExpand(item.id)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && item.output && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 animate-in slide-in-from-top duration-300">
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
            Generated Output
          </h4>
          {item.type === "image" && item.output.startsWith("http") ? (
            <div className="rounded-lg overflow-hidden bg-white border border-gray-200">
              <img
                src={item.output}
                alt={item.prompt}
                className="w-full max-h-96 object-contain"
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                {item.output}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CreationsItem;
