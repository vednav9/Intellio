// client/src/pages/Community.jsx
import React from 'react';
import { Users, TrendingUp } from 'lucide-react';

function Community() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Community</h1>
        </div>
        <p className="text-gray-600">Share your AI creations with the community</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
        <p className="text-gray-600">
          The community feature will be available soon. Share and discover amazing AI-generated content.
        </p>
      </div>
    </div>
  );
}

export default Community;
