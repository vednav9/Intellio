import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layers,
  Sparkles,
  Users,
  TrendingUp,
  FileText,
  ImageIcon,
  Scissors,
  ArrowRight,
  Clock,
} from "lucide-react";
import axiosInstance from "../api/axios";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCreations: 0,
    toolsUsed: 0,
    communityPosts: 0,
  });
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, creationsRes] = await Promise.all([
        axiosInstance.get("/user/stats"),
        axiosInstance.get("/user/creations?limit=5"),
      ]);
      setStats(statsRes.data.data);
      setCreations(creationsRes.data.data.creations);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const quickActions = [
    {
      name: "Write Article",
      path: "/ai/write-article",
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      description: "AI-powered content creation",
    },
    {
      name: "Generate Images",
      path: "/ai/generate-images",
      icon: ImageIcon,
      color: "from-purple-500 to-purple-600",
      description: "Create stunning visuals",
    },
    {
      name: "Remove Background",
      path: "/ai/remove-background",
      icon: Scissors,
      color: "from-pink-500 to-pink-600",
      description: "Smart image editing",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">
          Here’s what’s happening with your AI creations today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Creations */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Creations</p>
            <h2 className="text-3xl font-bold text-gray-900">{stats.totalCreations}</h2>
          </div>
          <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            12% this month
          </p>
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <Layers className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* AI Tools Used */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-gray-600 mb-1">AI Tools Used</p>
            <h2 className="text-3xl font-bold text-gray-900">{stats.toolsUsed}</h2>
          </div>
          <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            2 this week
          </p>
          <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-pink-600" />
          </div>
        </div>

        {/* Community Posts */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-gray-600 mb-1">Community Posts</p>
            <h2 className="text-3xl font-bold text-gray-900">{stats.communityPosts}</h2>
          </div>
          <p className="text-xs text-blue-600 font-medium mt-2">2 new likes</p>
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => navigate(action.path)}
              className={`group bg-white rounded-xl p-6 border border-gray-200 hover:border-primary-500 hover:shadow-lg transition-all text-left`}
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-gradient-to-br ${action.color} text-white group-hover:scale-110 transition-transform`}
              >
                <action.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{action.name}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Creations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Creations</h2>
          <button
            onClick={() => navigate("/creations")}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
          >
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        {creations.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
            No creations yet. Try one of the quick actions below!
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {creations.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 capitalize">{item.tool?.replace(/-/g, " ") || item.type}</p>
                  <p className="text-xs text-gray-500 truncate">{item.prompt || "—"}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                  <Clock className="w-3 h-3" />
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>



    </div>
  );
}

export default Dashboard;
