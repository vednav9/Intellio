import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play, Sparkles, Wand2, ImageIcon } from "lucide-react";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-20 xl:px-32 pt-24 pb-16">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-xs sm:text-sm font-medium text-primary">
          Powered by Advanced AI
        </span>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto text-center space-y-6">
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
          Create amazing content
          <br />
          <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            with AI tools
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Transform your content creation with our suite of premium AI tools.
          Write articles, generate images, and enhance your workflow effortlessly.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/ai')}
            className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white rounded-full font-medium text-sm sm:text-base transition-all hover:shadow-xl hover:shadow-primary/25 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Start creating now
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => {/* Add demo video handler */}}
            className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-gray-700 rounded-full font-medium text-sm sm:text-base border-2 border-gray-200 transition-all hover:border-primary hover:text-primary hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Play className="w-4 h-4 transition-transform group-hover:scale-110" />
            Watch demo
          </button>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-xs sm:text-sm text-gray-700">
            <Wand2 className="w-4 h-4 text-primary" />
            <span>AI Writing</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-xs sm:text-sm text-gray-700">
            <ImageIcon className="w-4 h-4 text-primary" />
            <span>Image Generation</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-xs sm:text-sm text-gray-700">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Background Removal</span>
          </div>
        </div>
      </div>

      {/* Trust Indicators (Optional) */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-8 text-xs sm:text-sm text-gray-500">
        <span>✓ No credit card required</span>
        <span className="hidden sm:inline">✓ Free trial available</span>
        <span className="hidden md:inline">✓ Cancel anytime</span>
      </div>
    </section>
  );
}

export default Hero;
