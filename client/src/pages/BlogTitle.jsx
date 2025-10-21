import React, { useState } from "react";
import {
  Heading,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Heart,
  RefreshCw,
  Wand2,
  TrendingUp,
} from "lucide-react";
import axiosInstance from "../api/axios";
import toast from "react-hot-toast";

const blogCategories = [
  "General",
  "Technology",
  "Business",
  "Health",
  "Lifestyle",
  "Education",
  "Travel",
  "Food",
];

const numberOfTitlesOptions = [5, 10, 15];

function BlogTitle() {
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [input, setInput] = useState("");
  const [numberOfTitles, setNumberOfTitles] = useState(5);
  const [generatedTitles, setGeneratedTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error("Please enter a blog topic or keyword");
      return;
    }

    setIsLoading(true);
    setGeneratedTitles([]);

    try {
      const response = await axiosInstance.post("/ai/blog-titles", {
        topic: input.trim(),
        category: selectedCategory,
        count: numberOfTitles,
      });

      if (response.data.success) {
        // Use returned titles array
        setGeneratedTitles(response.data.data.titles);
        toast.success("Blog titles generated successfully!");
      } else {
        toast.error("Failed to generate blog titles.");
      }
    } catch (error) {
      console.error("BlogTitle API error:", error);
      toast.error(error.response?.data?.message || "Error generating titles");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (title, index) => {
    navigator.clipboard.writeText(title);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast.success("Copied to clipboard!");
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const handleRegenerate = () => {
    onSubmitHandler({ preventDefault: () => {} });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
            <Heading className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Title Generator</h1>
        </div>
        <p className="text-gray-600">
          Generate catchy, SEO-friendly blog titles in seconds. Perfect for content creators.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="space-y-6">
          <form onSubmit={onSubmitHandler} className="space-y-6">
            {/* Input Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Blog Topic / Keywords <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., AI in Healthcare, Digital Marketing, Healthy Eating"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 ring-primary/50 focus:border-primary outline-none text-gray-700 placeholder-gray-400 transition-all"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-2">Enter your main topic or keywords for the blog post.</p>
            </div>

            {/* Category Selection */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Blog Category</label>
              <div className="flex flex-wrap gap-2">
                {blogCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md shadow-pink-500/25"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Titles */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Number of Titles</label>
              <div className="flex gap-3">
                {numberOfTitlesOptions.map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setNumberOfTitles(num)}
                    disabled={isLoading}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                      numberOfTitles === num
                        ? "border-pink-500 bg-pink-50 text-pink-600"
                        : "border-gray-200 hover:border-pink-300 text-gray-700"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Choose how many title suggestions you want to generate.</p>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="group w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 text-white rounded-xl font-semibold text-base transition-all hover:shadow-xl hover:shadow-pink-500/25 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Titles...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 transition-transform group-hover:rotate-12" />
                  Generate Blog Titles
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Tips Card */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Tips for Better Titles</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Use numbers and lists (e.g., "10 Ways...")</li>
                  <li>• Include power words (Ultimate, Essential, Proven)</li>
                  <li>• Keep it under 60 characters for SEO</li>
                  <li>• Make it specific and actionable</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Results Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Heading className="w-5 h-5 text-pink-600" />
                Generated Titles
                {generatedTitles.length > 0 && (
                  <span className="text-sm font-normal text-gray-500">({generatedTitles.length})</span>
                )}
              </h3>
              {generatedTitles.length > 0 && !isLoading && (
                <button
                  onClick={handleRegenerate}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </button>
              )}
            </div>

            {/* Results Content */}
            <div className="p-6 min-h-[500px] max-h-[700px] overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <Loader2 className="w-12 h-12 text-pink-600 animate-spin mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Generating Titles</h4>
                  <p className="text-sm text-gray-600 max-w-sm">{`Creating ${numberOfTitles} catchy blog titles for you...`}</p>
                </div>
              ) : generatedTitles.length > 0 ? (
                <div className="space-y-3">
                  {generatedTitles.map((item, index) => (
                    <div
                      key={item.id}
                      className="group relative bg-gray-50 hover:bg-pink-50 border border-gray-200 hover:border-pink-300 rounded-lg p-4 transition-all"
                    >
                      <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white text-xs font-bold flex items-center justify-center shadow-md">
                        {index + 1}
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0 pt-1">
                          <p className="text-gray-900 font-medium leading-relaxed">{item.title}</p>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => toggleFavorite(item.id)}
                            className={`p-2 rounded-lg transition-all ${
                              favorites.has(item.id)
                                ? "bg-pink-100 text-pink-600"
                                : "hover:bg-gray-200 text-gray-400 hover:text-pink-500"
                            }`}
                            title="Favorite"
                          >
                            <Heart
                              className={`w-4 h-4 ${favorites.has(item.id) ? "fill-current" : ""}`}
                            />
                          </button>

                          <button
                            onClick={() => handleCopy(item.title, index)}
                            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                            title="Copy"
                          >
                            {copiedIndex === index ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Heading className="w-10 h-10 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Titles Generated Yet</h4>
                  <p className="text-sm text-gray-600 max-w-sm">
                    Enter a topic, select a category, and click "Generate Blog Titles" to get started.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Favorites Summary */}
          {favorites.size > 0 && (
            <div className="mt-4 bg-pink-50 border border-pink-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-pink-800">
                <Heart className="w-4 h-4 fill-current" />
                <span className="font-medium">
                  {favorites.size} {favorites.size === 1 ? "title" : "titles"} marked as favorite
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogTitle;
