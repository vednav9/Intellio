import React, { useState } from "react";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import CreationsItem from "./CreationsItem";

function Creations({ creations = [], initialDisplayCount = 4 }) {
  const [showAll, setShowAll] = useState(false);
  const [expandedItems, setExpandedItems] = useState(new Set());

  const handleToggleExpand = (itemId) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const displayedCreations = showAll
    ? creations
    : creations.slice(0, initialDisplayCount);

  if (creations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No creations yet
        </h3>
        <p className="text-sm text-gray-600 max-w-sm mx-auto">
          Start creating amazing content with our AI tools. Your recent work
          will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Creations List - 1 per row */}
      <div className="space-y-3">
        {displayedCreations.map((item) => (
          <CreationsItem
            key={item.id}
            item={item}
            isExpanded={expandedItems.has(item.id)}
            onToggleExpand={handleToggleExpand}
          />
        ))}
      </div>

      {/* View All / Show Less Button */}
      {creations.length > initialDisplayCount && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className="group flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-full font-medium text-sm border-2 border-gray-200 hover:border-primary hover:text-primary hover:shadow-lg transition-all"
          >
            {showAll ? (
              <>
                Show Less
                <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              </>
            ) : (
              <>
                View All ({creations.length - initialDisplayCount} more)
                <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default Creations;
