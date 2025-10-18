import React, { useState, useRef } from "react";
import {
  Scissors,
  Upload,
  Loader2,
  Download,
  X,
  RefreshCw,
  Image as ImageIcon,
  Check,
  Sparkles,
  ArrowLeftRight,
} from "lucide-react";

function RemoveBackground() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [processedImage, setProcessedImage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [showComparison, setShowComparison] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
        setProcessedImage("");
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file (PNG, JPG, JPEG, WebP)");
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveBackground = async () => {
    if (!uploadedImage) {
      alert("Please upload an image first");
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 200);

    // Simulate API call - Replace with actual background removal API
    // (e.g., remove.bg API, or your own backend)
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      
      // Mock processed image - In production, this would be the API response
      setProcessedImage(previewUrl);
      setIsProcessing(false);
      setProgress(0);
    }, 2000);
  };

  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement("a");
    link.href = processedImage;
    link.download = `removed-bg-${Date.now()}.png`;
    link.click();
  };

  const handleReset = () => {
    setUploadedImage(null);
    setPreviewUrl("");
    setProcessedImage("");
    setIsProcessing(false);
    setShowComparison(false);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const backgroundColors = [
    { name: "White", value: "#ffffff" },
    { name: "Black", value: "#000000" },
    { name: "Gray", value: "#9ca3af" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#10b981" },
    { name: "Red", value: "#ef4444" },
    { name: "Yellow", value: "#fbbf24" },
    { name: "Purple", value: "#8b5cf6" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Remove Background
          </h1>
        </div>
        <p className="text-gray-600">
          Remove image backgrounds automatically with AI. Perfect for product
          photos, portraits, and more.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Upload */}
        <div className="space-y-6">
          {!previewUrl ? (
            // Upload Zone
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`bg-white rounded-xl border-2 border-dashed p-12 shadow-sm transition-all ${
                isDragging
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-green-400"
              }`}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Upload className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload an Image
                </h3>
                <p className="text-sm text-gray-600 mb-6 max-w-sm">
                  Drag and drop your image here, or click to browse
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all hover:scale-105 active:scale-95"
                >
                  Choose File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-4">
                  Supports: JPG, PNG, WebP (Max 10MB)
                </p>
              </div>
            </div>
          ) : (
            // Image Preview & Controls
            <div className="space-y-6">
              {/* Preview Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Original Image
                  </h3>
                  <button
                    onClick={handleReset}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Upload New"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={previewUrl}
                    alt="Original"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <ImageIcon className="w-4 h-4" />
                  <span>{uploadedImage?.name}</span>
                </div>
              </div>

              {/* Remove Background Button */}
              {!processedImage && !isProcessing && (
                <button
                  onClick={handleRemoveBackground}
                  className="group w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 via-green-600 to-teal-600 text-white rounded-xl font-semibold text-base transition-all hover:shadow-xl hover:shadow-green-500/25 hover:scale-[1.02] active:scale-95"
                >
                  <Scissors className="w-5 h-5 transition-transform group-hover:rotate-12" />
                  Remove Background
                  <Sparkles className="w-5 h-5" />
                </button>
              )}

              {/* Processing State */}
              {isProcessing && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                    <span className="font-medium text-gray-900">
                      Processing... {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-teal-500 transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Upload Another Button */}
              {processedImage && (
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-lg font-medium hover:border-green-500 hover:text-green-600 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Upload Another Image
                </button>
              )}
            </div>
          )}

          {/* Info Cards */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Best Results Tips
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Use high-resolution images</li>
                  <li>• Clear subject with good contrast</li>
                  <li>• Avoid complex or blurry backgrounds</li>
                  <li>• Works best with portraits and products</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Result */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Result Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Scissors className="w-5 h-5 text-green-600" />
                Processed Image
              </h3>
              {processedImage && (
                <div className="flex items-center gap-2">
                  {/* Comparison Toggle */}
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    {showComparison ? "Hide" : "Compare"}
                  </button>
                  {/* Download Button */}
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              )}
            </div>

            {/* Result Content */}
            <div className="p-6 min-h-[500px] max-h-[700px] overflow-y-auto">
              {isProcessing ? (
                // Processing State
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Removing Background
                  </h4>
                  <p className="text-sm text-gray-600 max-w-sm mb-4">
                    Our AI is carefully removing the background from your
                    image...
                  </p>
                  <div className="text-2xl font-bold text-green-600">
                    {progress}%
                  </div>
                </div>
              ) : processedImage ? (
                // Processed Result
                <div className="space-y-6">
                  {/* Comparison View */}
                  {showComparison ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">
                          BEFORE
                        </p>
                        <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                          <img
                            src={previewUrl}
                            alt="Before"
                            className="w-full h-auto object-contain"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">
                          AFTER
                        </p>
                        <div
                          className="rounded-lg overflow-hidden border border-gray-200"
                          style={{
                            background: `repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%) 50% / 20px 20px`,
                          }}
                        >
                          <img
                            src={processedImage}
                            alt="After"
                            className="w-full h-auto object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Single View with Checkerboard
                    <div
                      className="rounded-lg overflow-hidden border border-gray-200"
                      style={{
                        background: `repeating-conic-gradient(${backgroundColor}20 0% 25%, ${backgroundColor} 0% 50%) 50% / 20px 20px`,
                      }}
                    >
                      <img
                        src={processedImage}
                        alt="Processed"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  )}

                  {/* Background Color Selector */}
                  {!showComparison && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Background Color
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {backgroundColors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setBackgroundColor(color.value)}
                            className={`relative w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                              backgroundColor === color.value
                                ? "border-green-500 ring-2 ring-green-200"
                                : "border-gray-300"
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          >
                            {backgroundColor === color.value && (
                              <Check className="w-5 h-5 text-white absolute inset-0 m-auto drop-shadow-md" />
                            )}
                          </button>
                        ))}
                        {/* Custom Color Picker */}
                        <label
                          className="relative w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer hover:scale-110 transition-all overflow-hidden"
                          title="Custom Color"
                        >
                          <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div
                            className="w-full h-full"
                            style={{
                              background: `conic-gradient(red, yellow, lime, cyan, blue, magenta, red)`,
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Empty State
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Scissors className="w-10 h-10 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    No Image Processed Yet
                  </h4>
                  <p className="text-sm text-gray-600 max-w-sm">
                    Upload an image and click "Remove Background" to see the
                    magic happen.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Success Info */}
          {processedImage && !isProcessing && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">Background Removed!</p>
                  <p className="text-xs text-green-700">
                    Download your image or try different background colors.
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

export default RemoveBackground;
