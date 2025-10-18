import React, { useState, useRef, useEffect } from "react";
import {
  Eraser,
  Upload,
  Loader2,
  Download,
  X,
  RefreshCw,
  Image as ImageIcon,
  Check,
  Sparkles,
  ArrowLeftRight,
  Paintbrush,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

function RemoveObject() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [processedImage, setProcessedImage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [tool, setTool] = useState("brush"); // 'brush' or 'eraser'
  const [showComparison, setShowComparison] = useState(false);
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    if (previewUrl && canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const image = imageRef.current;

      // Wait for image to load
      image.onload = () => {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        canvas.style.width = "100%";
        canvas.style.height = "auto";

        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.lineJoin = "round";
        contextRef.current = context;
      };
    }
  }, [previewUrl]);

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

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    setIsDrawing(true);
    contextRef.current.beginPath();
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    contextRef.current.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (tool === "brush") {
      contextRef.current.globalCompositeOperation = "source-over";
      contextRef.current.strokeStyle = "rgba(255, 0, 0, 0.5)";
      contextRef.current.lineWidth = brushSize;
    } else {
      contextRef.current.globalCompositeOperation = "destination-out";
      contextRef.current.lineWidth = brushSize;
    }

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    contextRef.current.closePath();
  };

  const clearMask = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleRemoveObject = async () => {
    if (!uploadedImage) {
      alert("Please upload an image first");
      return;
    }

    const canvas = canvasRef.current;
    const maskData = canvas.toDataURL();

    // Check if mask is empty
    const context = contextRef.current;
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const hasDrawing = imageData.data.some((value) => value !== 0);

    if (!hasDrawing) {
      alert("Please mark the objects you want to remove");
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

    // Simulate API call - Replace with actual object removal API
    // Send both image and mask to backend
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);

      // Mock processed image - In production, this would be the API response
      setProcessedImage(previewUrl);
      setIsProcessing(false);
      setProgress(0);
    }, 2500);
  };

  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement("a");
    link.href = processedImage;
    link.download = `removed-object-${Date.now()}.png`;
    link.click();
  };

  const handleReset = () => {
    setUploadedImage(null);
    setPreviewUrl("");
    setProcessedImage("");
    setIsProcessing(false);
    setShowComparison(false);
    setProgress(0);
    clearMask();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <Eraser className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Remove Object</h1>
        </div>
        <p className="text-gray-600">
          Remove unwanted objects from your images. Mark the objects you want to
          remove and let AI do the rest.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Upload & Edit */}
        <div className="space-y-6">
          {!previewUrl ? (
            // Upload Zone
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`bg-white rounded-xl border-2 border-dashed p-12 shadow-sm transition-all ${
                isDragging
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300 hover:border-orange-400"
              }`}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <Upload className="w-10 h-10 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload an Image
                </h3>
                <p className="text-sm text-gray-600 mb-6 max-w-sm">
                  Drag and drop your image here, or click to browse
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all hover:scale-105 active:scale-95"
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
            // Image Editor
            <div className="space-y-6">
              {/* Canvas Editor Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Mark Objects to Remove
                  </h3>
                  <button
                    onClick={handleReset}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Upload New"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Canvas Container */}
                <div className="relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    ref={imageRef}
                    src={previewUrl}
                    alt="Original"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="absolute inset-0 cursor-crosshair"
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <ImageIcon className="w-4 h-4" />
                  <span>{uploadedImage?.name}</span>
                </div>
              </div>

              {/* Drawing Tools */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Drawing Tools
                </label>

                {/* Tool Selector */}
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => setTool("brush")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      tool === "brush"
                        ? "border-orange-500 bg-orange-50 text-orange-600"
                        : "border-gray-200 hover:border-orange-300 text-gray-700"
                    }`}
                  >
                    <Paintbrush className="w-4 h-4" />
                    Brush
                  </button>
                  <button
                    onClick={() => setTool("eraser")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      tool === "eraser"
                        ? "border-orange-500 bg-orange-50 text-orange-600"
                        : "border-gray-200 hover:border-orange-300 text-gray-700"
                    }`}
                  >
                    <Eraser className="w-4 h-4" />
                    Eraser
                  </button>
                </div>

                {/* Brush Size */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Brush Size
                    </span>
                    <span className="text-sm font-semibold text-orange-600">
                      {brushSize}px
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setBrushSize(Math.max(5, brushSize - 5))}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <button
                      onClick={() => setBrushSize(Math.min(50, brushSize + 5))}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Clear Mask Button */}
                <button
                  onClick={clearMask}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All Marks
                </button>
              </div>

              {/* Remove Object Button */}
              {!processedImage && !isProcessing && (
                <button
                  onClick={handleRemoveObject}
                  className="group w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 text-white rounded-xl font-semibold text-base transition-all hover:shadow-xl hover:shadow-orange-500/25 hover:scale-[1.02] active:scale-95"
                >
                  <Eraser className="w-5 h-5 transition-transform group-hover:rotate-12" />
                  Remove Marked Objects
                  <Sparkles className="w-5 h-5" />
                </button>
              )}

              {/* Processing State */}
              {isProcessing && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Loader2 className="w-5 h-5 text-orange-600 animate-spin" />
                    <span className="font-medium text-gray-900">
                      Processing... {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Upload Another Button */}
              {processedImage && (
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-lg font-medium hover:border-orange-500 hover:text-orange-600 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Process Another Image
                </button>
              )}
            </div>
          )}

          {/* Info Card */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  How to Use
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Paint over objects you want to remove</li>
                  <li>• Use eraser to fix mistakes</li>
                  <li>• Adjust brush size for precision</li>
                  <li>• AI will intelligently fill the gaps</li>
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
                <Eraser className="w-5 h-5 text-orange-600" />
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
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
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
                  <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Removing Objects
                  </h4>
                  <p className="text-sm text-gray-600 max-w-sm mb-4">
                    Our AI is intelligently removing the marked objects and
                    filling the gaps...
                  </p>
                  <div className="text-2xl font-bold text-orange-600">
                    {progress}%
                  </div>
                </div>
              ) : processedImage ? (
                // Processed Result
                <div className="space-y-4">
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
                        <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                          <img
                            src={processedImage}
                            alt="After"
                            className="w-full h-auto object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Single View
                    <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      <img
                        src={processedImage}
                        alt="Processed"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  )}
                </div>
              ) : (
                // Empty State
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Eraser className="w-10 h-10 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    No Image Processed Yet
                  </h4>
                  <p className="text-sm text-gray-600 max-w-sm">
                    Upload an image, mark the objects you want to remove, and
                    click "Remove Marked Objects".
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Success Info */}
          {processedImage && !isProcessing && (
            <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-800">
                  <p className="font-medium mb-1">Objects Removed Successfully!</p>
                  <p className="text-xs text-orange-700">
                    The marked objects have been intelligently removed from your
                    image.
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

export default RemoveObject;
