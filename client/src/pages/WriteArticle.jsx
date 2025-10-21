import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Loader2,
  Copy,
  Download,
  Edit3,
  Check,
  X,
  Wand2,
} from "lucide-react";
import axiosInstance from "../api/axios"; // Axios instance with token interceptors
import toast from "react-hot-toast";

function WriteArticle() {
  const articleLength = [
    { length: 800, text: "Short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "Long (1200+ words)" },
  ];

  const toneOptions = [
    "Professional",
    "Casual",
    "Friendly",
    "Academic",
    "Persuasive",
  ];

  const [input, setInput] = useState("");
  const [selectedLength, setSelectedLength] = useState(800);
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [keywords, setKeywords] = useState("");
  const [generatedArticle, setGeneratedArticle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedArticle, setEditedArticle] = useState("");
  const [copied, setCopied] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error("Please enter a topic or prompt");
      return;
    }

    setIsLoading(true);
    setGeneratedArticle("");
    setIsEditing(false);

    try {
      const response = await axiosInstance.post("/ai/write-article", {
        topic: input,
        tone: selectedTone,
        length: selectedLength,
        keywords: keywords,
      });

      if (response.data?.success) {
        const article = response.data.data.article;
        setGeneratedArticle(article);
        setEditedArticle(article);
      } else {
        toast.error("Failed to generate article");
      }
    } catch (error) {
      console.error("WriteArticle API error:", error);
      toast.error("Error generating article");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = isEditing ? editedArticle : generatedArticle;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = () => {
    const textToDownload = isEditing ? editedArticle : generatedArticle;
    const blob = new Blob([textToDownload], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${input.substring(0, 30).replace(/\s+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Article downloaded!");
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setGeneratedArticle(editedArticle);
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setEditedArticle(generatedArticle);
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Write Article</h1>
        </div>
        <p className="text-gray-600">
          Generate high-quality articles with AI. Customize length, tone, and
          style.
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
                Article Topic / Prompt
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your article topic or detailed prompt here... e.g., 'The Future of Artificial Intelligence in Healthcare'"
                className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 ring-primary/50 focus:border-primary outline-none resize-none text-gray-700 placeholder-gray-400 transition-all"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-2">
                Be specific for better results. Include key points you want
                covered.
              </p>
            </div>

            {/* Article Length Selection */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Article Length
              </label>
              <div className="space-y-2">
                {articleLength.map((item) => (
                  <button
                    key={item.length}
                    type="button"
                    onClick={() => setSelectedLength(item.length)}
                    disabled={isLoading}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${
                      selectedLength === item.length
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 hover:border-primary/50 text-gray-700"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span className="font-medium">{item.text}</span>
                    {selectedLength === item.length && <Check className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selection */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Tone & Style
              </label>
              <div className="flex flex-wrap gap-2">
                {toneOptions.map((tone) => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => setSelectedTone(tone)}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedTone === tone
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            {/* Keywords (Optional) */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Keywords
                <span className="text-gray-400 text-xs ml-2">(Optional)</span>
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="AI, Technology, Innovation"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 ring-primary/50 focus:border-primary outline-none text-gray-700 placeholder-gray-400 transition-all"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-2">
                Separate keywords with commas for better SEO optimization.
              </p>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="group w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white rounded-xl font-semibold text-base transition-all hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Article...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 transition-transform group-hover:rotate-12" />
                  Generate Article
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column - Preview */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Preview Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Generated Article
              </h3>
              {generatedArticle && !isLoading && (
                <div className="flex items-center gap-2">
                  {/* Edit Button */}
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={handleEditToggle}
                        className="p-2 rounded-lg bg-green-100 hover:bg-green-200 transition-colors"
                        title="Save"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEditToggle}
                      className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4 text-gray-600" />
                    </button>
                  )}

                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Copy"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>

                  {/* Download Button */}
                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              )}
            </div>

            {/* Preview Content */}
            <div className="p-6 min-h-[500px] max-h-[700px] overflow-y-auto">
              {isLoading ? (
                // Loading State
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Generating Your Article
                  </h4>
                  <p className="text-sm text-gray-600 max-w-sm">
                    Our AI is crafting a high-quality article based on your
                    requirements...
                  </p>
                </div>
              ) : generatedArticle ? (
                // Generated Article
                isEditing ? (
                  <textarea
                    value={editedArticle}
                    onChange={(e) => setEditedArticle(e.target.value)}
                    className="w-full h-full min-h-[500px] p-4 border border-gray-200 rounded-lg focus:ring-2 ring-primary/50 focus:border-primary outline-none resize-none text-gray-700 font-mono text-sm"
                  />
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                      {generatedArticle}
                    </pre>
                  </div>
                )
              ) : (
                // Empty State
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <FileText className="w-10 h-10 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    No Article Generated Yet
                  </h4>
                  <p className="text-sm text-gray-600 max-w-sm">
                    Fill out the form and click "Generate Article" to create
                    your AI-powered content.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Info Card */}
          {generatedArticle && !isLoading && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Article Generated Successfully!</p>
                  <p className="text-xs text-blue-700">
                    You can edit, copy, or download your article using the buttons
                    above.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WriteArticle;
