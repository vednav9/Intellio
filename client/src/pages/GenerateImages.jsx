import React, { useState } from "react";
import {
  ImageIcon,
  Sparkles,
  Loader2,
  Download,
  Wand2,
  X,
  Maximize2,
  RefreshCw,
} from "lucide-react";

function GenerateImages() {
  const imageStyles = ["Realistic", "Ghibli", "Anime", "3D", "Portrait"];

  const imageSizes = [
    { label: "Square", value: "1:1" },
    { label: "Portrait", value: "9:16" },
    { label: "Landscape", value: "16:9" },
  ];

  const numberOfImagesOptions = [1, 2, 4];

  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [imageSize, setImageSize] = useState("1:1");
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      alert("Please enter an image prompt");
      return;
    }

    setIsLoading(true);
    setGeneratedImages([]);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate API call - Replace with actual API
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);

      // Mock generated images based on size
      const aspectRatios = {
        "1:1": "600x600",
        "9:16": "600x1067",
        "16:9": "1067x600",
      };
      const size = aspectRatios[imageSize];

      const mockImages = Array.from({ length: numberOfImages }, (_, idx) => ({
        id: idx + 1,
        url: `https://via.placeholder.com/${size}/${
          ["6366f1", "8b5cf6", "ec4899", "3b82f6"][idx % 4]
        }/ffffff?text=${selectedStyle}+Image+${idx + 1}`,
        prompt: prompt,
        style: selectedStyle,
        size: imageSize,
      }));

      setGeneratedImages(mockImages);
      setIsLoading(false);
      setProgress(0);
    }, 3000);
  };

  const handleDownload = async (imageUrl, index) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-generated-${selectedStyle}-${index + 1}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const openFullscreen = (image) => {
    setSelectedImage(image);
  };

  const closeFullscreen = () => {
    setSelectedImage(null);
  };

  const handleRegenerate = () => {
    onSubmitHandler({ preventDefault: () => {} });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            AI Image Generator
          </h1>
        </div>
        <p className="text-gray-600">
          Create stunning images from text descriptions. Choose your style and
          let AI bring your vision to life.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="space-y-6">
          <form onSubmit={onSubmitHandler} className="space-y-6">
            {/* Prompt Input */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Image Prompt
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to create... e.g., 'A futuristic city at sunset with flying cars and neon lights'"
                className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 ring-primary/50 focus:border-primary outline-none resize-none text-gray-700 placeholder-gray-400 transition-all"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-2">
                Be specific and descriptive for better results. Include details
                about colors, mood, and composition.
              </p>
            </div>

            {/* Style Selection */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Art Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {imageStyles.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setSelectedStyle(style)}
                    disabled={isLoading}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      selectedStyle === style
                        ? "border-purple-500 bg-purple-50 text-purple-600"
                        : "border-gray-200 hover:border-purple-300 text-gray-700"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Size */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Image Size
              </label>
              <div className="grid grid-cols-3 gap-3">
                {imageSizes.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() => setImageSize(size.value)}
                    disabled={isLoading}
                    className={`flex flex-col items-center justify-center px-4 py-3 rounded-lg border-2 transition-all ${
                      imageSize === size.value
                        ? "border-purple-500 bg-purple-50 text-purple-600"
                        : "border-gray-200 hover:border-purple-300 text-gray-700"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span className="text-sm font-medium mb-1">{size.label}</span>
                    <span className="text-xs text-gray-500">{size.value}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Images */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Number of Images
              </label>
              <div className="flex gap-3">
                {numberOfImagesOptions.map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setNumberOfImages(num)}
                    disabled={isLoading}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                      numberOfImages === num
                        ? "border-purple-500 bg-purple-50 text-purple-600"
                        : "border-gray-200 hover:border-purple-300 text-gray-700"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Generating multiple images uses more credits.
              </p>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="group w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 text-white rounded-xl font-semibold text-base transition-all hover:shadow-xl hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating... {progress}%
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 transition-transform group-hover:rotate-12" />
                  Generate Images
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Progress Bar */}
            {isLoading && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Right Column - Gallery */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Gallery Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                Generated Images
                {generatedImages.length > 0 && (
                  <span className="text-sm font-normal text-gray-500">
                    ({generatedImages.length})
                  </span>
                )}
              </h3>
              {generatedImages.length > 0 && !isLoading && (
                <button
                  onClick={handleRegenerate}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </button>
              )}
            </div>

            {/* Gallery Content */}
            <div className="p-6 min-h-[500px] max-h-[700px] overflow-y-auto">
              {isLoading ? (
                // Loading State
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Creating Your Images
                  </h4>
                  <p className="text-sm text-gray-600 max-w-sm mb-4">
                    This may take a few moments. We're crafting{" "}
                    {numberOfImages} {numberOfImages === 1 ? "image" : "images"}{" "}
                    in {selectedStyle} style...
                  </p>
                  <div className="text-2xl font-bold text-purple-600">
                    {progress}%
                  </div>
                </div>
              ) : generatedImages.length > 0 ? (
                // Generated Images Grid
                <div
                  className={`grid gap-4 ${
                    numberOfImages === 1
                      ? "grid-cols-1"
                      : numberOfImages === 2
                      ? "grid-cols-1 sm:grid-cols-2"
                      : "grid-cols-2"
                  }`}
                >
                  {generatedImages.map((image, index) => (
                    <div
                      key={image.id}
                      className="group relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-purple-300 transition-all"
                    >
                      {/* Image */}
                      <img
                        src={image.url}
                        alt={`Generated ${image.style} image ${index + 1}`}
                        className="w-full h-auto object-cover"
                      />

                      {/* Overlay with Actions */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        {/* Zoom Button */}
                        <button
                          onClick={() => openFullscreen(image)}
                          className="p-3 bg-white rounded-lg hover:scale-110 transition-transform"
                          title="View Fullscreen"
                        >
                          <Maximize2 className="w-5 h-5 text-gray-700" />
                        </button>

                        {/* Download Button */}
                        <button
                          onClick={() => handleDownload(image.url, index)}
                          className="p-3 bg-white rounded-lg hover:scale-110 transition-transform"
                          title="Download"
                        >
                          <Download className="w-5 h-5 text-gray-700" />
                        </button>
                      </div>

                      {/* Style Badge */}
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200">
                          {image.style}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Empty State
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <ImageIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    No Images Generated Yet
                  </h4>
                  <p className="text-sm text-gray-600 max-w-sm">
                    Enter a prompt, choose your style, and click "Generate
                    Images" to create stunning AI art.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Info Card */}
          {generatedImages.length > 0 && !isLoading && (
            <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-purple-800">
                  <p className="font-medium mb-1">
                    {generatedImages.length}{" "}
                    {generatedImages.length === 1 ? "image" : "images"}{" "}
                    generated successfully!
                  </p>
                  <p className="text-xs text-purple-700">
                    Style: {selectedStyle} • Size: {imageSize} • Hover to
                    download or view fullscreen
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeFullscreen}
        >
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="max-w-5xl max-h-[90vh] relative">
            <img
              src={selectedImage.url}
              alt={selectedImage.prompt}
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm text-white rounded-lg p-4">
              <p className="text-sm font-medium mb-1">
                {selectedImage.prompt}
              </p>
              <p className="text-xs text-gray-300">
                Style: {selectedImage.style} • Size: {selectedImage.size}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GenerateImages;
