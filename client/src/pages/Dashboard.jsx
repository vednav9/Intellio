import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layers,
  Zap,
  Sparkles,
  Users,
  TrendingUp,
  Crown,
  ArrowRight,
  FileText,
  ImageIcon,
  Scissors,
  Clock,
} from "lucide-react";
import Creations from "../components/Creations";

function Dashboard() {
  const navigate = useNavigate();
  const [creations, setCreations] = useState([]);
  const [stats, setStats] = useState({
    totalCreations: 0,
    creditsUsed: 0,
    creditsRemaining: 5,
    toolsUsed: 0,
    communityPosts: 0,
  });

  const getDashboardData = async () => {
    // Mock data with proper structure - Replace with actual API call
    const mockCreations = [
      {
        id: 1,
        type: "article",
        prompt: "Write an article about the future of AI in healthcare",
        output:
          "Artificial Intelligence is revolutionizing healthcare by enabling faster diagnoses, personalized treatment plans, and predictive analytics. Machine learning algorithms can now detect diseases earlier than traditional methods...",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        tool: "Write Article",
      },
      {
        id: 2,
        type: "image",
        prompt: "Generate a futuristic product banner with neon colors",
        output: "https://via.placeholder.com/800x600/6366f1/ffffff?text=AI+Generated+Banner",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        tool: "Generate Images",
      },
      {
        id: 3,
        type: "title",
        prompt: "Create 5 catchy blog titles about productivity",
        output:
          "1. 10 Proven Ways to Double Your Productivity\n2. The Ultimate Guide to Time Management\n3. Productivity Hacks Every Professional Needs\n4. From Burnout to Balance: A Success Story\n5. How to Achieve More in Less Time",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        tool: "Blog Title",
      },
      {
        id: 4,
        type: "background-remove",
        prompt: "Remove background from product photo",
        output: "https://via.placeholder.com/600x600/ffffff/6366f1?text=No+Background",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        tool: "Remove Background",
      },
      {
        id: 5,
        type: "resume",
        prompt: "Review my software engineer resume for improvements",
        output:
          "Overall Score: 8.5/10\n\nStrengths:\n- Clear technical skills section\n- Quantified achievements\n\nImprovements:\n- Add more action verbs\n- Expand project descriptions\n- Include relevant certifications",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        tool: "Review Resume",
      },
    ];

    setCreations(mockCreations);
    setStats({
      totalCreations: mockCreations.length,
      creditsUsed: 45,
      creditsRemaining: 5,
      toolsUsed: 6,
      communityPosts: 8,
    });
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
      description: "AI-powered content",
    },
    {
      name: "Generate Images",
      path: "/ai/generate-images",
      icon: ImageIcon,
      color: "from-purple-500 to-purple-600",
      description: "Create visuals",
    },
    {
      name: "Remove Background",
      path: "/ai/remove-background",
      icon: Scissors,
      color: "from-pink-500 to-pink-600",
      description: "Edit images",
    },
  ];

  const recentActivity = [
    {
      action: "Created article",
      time: "2 hours ago",
      tool: "Write Article",
    },
    {
      action: "Generated image",
      time: "5 hours ago",
      tool: "Generate Images",
    },
    {
      action: "Removed background",
      time: "1 day ago",
      tool: "Remove Background",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your AI creations today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Creations */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Creations
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                {stats.totalCreations}
              </h2>
              <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12% this month
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Credits Used */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Credits Used
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                {stats.creditsUsed}
              </h2>
              <p className="text-xs text-orange-600 font-medium mt-2">
                {stats.creditsRemaining} remaining
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* AI Tools Used */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                AI Tools Used
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                {stats.toolsUsed}
              </h2>
              <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +2 this week
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>

        {/* Community Posts */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Community Posts
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                {stats.communityPosts}
              </h2>
              <p className="text-xs text-blue-600 font-medium mt-2">
                2 new likes
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Plan Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Premium Plan</h3>
              <p className="text-sm text-white/90">
                You have {stats.creditsRemaining} credits remaining. Upgrade for
                unlimited access.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/pricing")}
            className="group flex items-center gap-2 px-6 py-2.5 bg-white text-primary rounded-full font-medium text-sm hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex-shrink-0"
          >
            Upgrade Now
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(action.path)}
                className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-primary/50 hover:shadow-lg transition-all text-left"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                  {action.name}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Creations - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Creations
            </h2>
            <button
              onClick={() => navigate("/ai/creations")}
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </button>
          </div>
          <Creations creations={creations} />
        </div>

        {/* Activity Timeline - Takes 1 column */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
            {recentActivity.map((activity, idx) => (
              <div
                key={idx}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.tool}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}

            {recentActivity.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
