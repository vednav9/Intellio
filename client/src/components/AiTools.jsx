import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { AiTools as toolsData } from '../data/AiTools';
import { ArrowRight, Sparkles } from 'lucide-react';

function AiTools() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const handleToolClick = (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="px-4 sm:px-20 xl:px-32 py-24 bg-gradient-to-b from-white to-gray-50">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-primary/10 border border-primary/20">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI-Powered Suite</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Powerful AI Tools
        </h2>
        
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          Unlock your creative potential with our comprehensive suite of AI-powered tools.
          From content creation to image editing, everything you need in one place.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {toolsData.map((tool, index) => {
          const IconComponent = tool.icon;
          
          return (
            <div
              key={index}
              onClick={() => handleToolClick(tool.path)}
              className="group relative overflow-hidden rounded-2xl p-8 bg-white border-2 border-gray-200 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-transparent"
            >
              {/* Content */}
              <div className="relative z-10">
                {/* Icon Container with Gradient */}
                <div 
                  className="flex items-center justify-center w-14 h-14 mb-5 rounded-xl transition-transform group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background: `linear-gradient(135deg, ${tool.bg.from} 0%, ${tool.bg.to} 100%)`
                  }}
                >
                  <IconComponent className="w-7 h-7 text-white" strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  {tool.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                  {tool.description}
                </p>

                {/* CTA */}
                <div 
                  className="flex items-center gap-2 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: tool.bg.from }}
                >
                  <span>{isAuthenticated ? 'Get Started' : 'Sign in to use'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              {/* Gradient Border on Hover */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                style={{
                  background: `linear-gradient(135deg, ${tool.bg.from} 0%, ${tool.bg.to} 100%)`,
                  padding: '2px'
                }}
              >
                <div className="w-full h-full bg-white rounded-2xl" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      {!isAuthenticated && (
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Ready to supercharge your workflow?
          </p>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-full font-medium transition-all hover:shadow-xl hover:shadow-primary/25 hover:scale-105"
          >
            Sign Up Free
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}

export default AiTools;
