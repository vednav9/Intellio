import React, { useState, useRef } from "react";
import {
  FileCheck,
  Upload,
  Loader2,
  Download,
  X,
  RefreshCw,
  FileText,
  Check,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Award,
  Target,
  Zap,
} from "lucide-react";

function ReviewResume() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (file && validTypes.includes(file.type)) {
      setUploadedFile(file);
      setFileName(file.name);
      setReviewData(null);
    } else {
      alert("Please upload a valid resume file (PDF or DOCX)");
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

  const handleAnalyzeResume = async () => {
    if (!uploadedFile) {
      alert("Please upload a resume first");
      return;
    }

    setIsAnalyzing(true);
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

    // Simulate API call - Replace with actual resume analysis API
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);

      // Mock review data
      const mockReview = {
        overallScore: 85,
        scores: {
          content: 90,
          formatting: 82,
          ats: 78,
          experience: 88,
          skills: 85,
        },
        strengths: [
          "Clear and quantified achievements with specific metrics",
          "Strong technical skills section with relevant technologies",
          "Well-organized with consistent formatting",
          "Professional summary clearly states value proposition",
          "Good use of action verbs throughout",
        ],
        improvements: [
          "Add more industry-specific keywords for better ATS compatibility",
          "Include relevant certifications and professional development",
          "Expand on leadership and soft skills examples",
          "Consider adding a projects section with links",
          "Optimize file format to ensure ATS compatibility",
        ],
        keywords: {
          found: ["JavaScript", "React", "Python", "Team Leadership", "Agile"],
          missing: ["Cloud Computing", "CI/CD", "Microservices", "Docker"],
        },
        atsScore: 78,
      };

      setReviewData(mockReview);
      setIsAnalyzing(false);
      setProgress(0);
    }, 3000);
  };

  const handleReset = () => {
    setUploadedFile(null);
    setFileName("");
    setTargetRole("");
    setReviewData(null);
    setIsAnalyzing(false);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
            <FileCheck className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Review Resume</h1>
        </div>
        <p className="text-gray-600">
          Get instant AI-powered feedback on your resume. Improve your chances of
          landing your dream job.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Upload */}
        <div className="space-y-6">
          {!uploadedFile ? (
            // Upload Zone
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`bg-white rounded-xl border-2 border-dashed p-12 shadow-sm transition-all ${
                isDragging
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300 hover:border-indigo-400"
              }`}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                  <Upload className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Your Resume
                </h3>
                <p className="text-sm text-gray-600 mb-6 max-w-sm">
                  Drag and drop your resume here, or click to browse
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
                >
                  Choose File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-4">
                  Supports: PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>
            </div>
          ) : (
            // File Info & Controls
            <div className="space-y-6">
              {/* File Preview Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Uploaded Resume
                  </h3>
                  <button
                    onClick={handleReset}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Upload New"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {fileName}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {(uploadedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              </div>

              {/* Target Role Input (Optional) */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Target Job Role
                  <span className="text-gray-400 text-xs ml-2">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g., Senior Software Engineer, Product Manager"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 ring-indigo-500/50 focus:border-indigo-500 outline-none text-gray-700 placeholder-gray-400 transition-all"
                  disabled={isAnalyzing}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Help us tailor the review to your desired position
                </p>
              </div>

              {/* Analyze Button */}
              {!reviewData && !isAnalyzing && (
                <button
                  onClick={handleAnalyzeResume}
                  className="group w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-base transition-all hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-95"
                >
                  <FileCheck className="w-5 h-5 transition-transform group-hover:rotate-12" />
                  Analyze Resume
                  <Sparkles className="w-5 h-5" />
                </button>
              )}

              {/* Processing State */}
              {isAnalyzing && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                    <span className="font-medium text-gray-900">
                      Analyzing... {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Upload Another Button */}
              {reviewData && (
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-lg font-medium hover:border-indigo-500 hover:text-indigo-600 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Review Another Resume
                </button>
              )}
            </div>
          )}

          {/* Info Card */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  What We Analyze
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Content quality and relevance</li>
                  <li>• ATS (Applicant Tracking System) compatibility</li>
                  <li>• Formatting and visual appeal</li>
                  <li>• Keywords and industry terms</li>
                  <li>• Experience and skills presentation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Review Results */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Review Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                Resume Analysis
              </h3>
              {reviewData && (
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
              )}
            </div>

            {/* Review Content */}
            <div className="p-6 min-h-[500px] max-h-[700px] overflow-y-auto">
              {isAnalyzing ? (
                // Analyzing State
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Analyzing Your Resume
                  </h4>
                  <p className="text-sm text-gray-600 max-w-sm mb-4">
                    Our AI is reviewing your resume for content, formatting, ATS
                    compatibility, and more...
                  </p>
                  <div className="text-2xl font-bold text-indigo-600">
                    {progress}%
                  </div>
                </div>
              ) : reviewData ? (
                // Review Results
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBg(
                        reviewData.overallScore
                      )} mb-4`}
                    >
                      <div className="text-center">
                        <div
                          className={`text-4xl font-bold ${getScoreColor(
                            reviewData.overallScore
                          )}`}
                        >
                          {reviewData.overallScore}
                        </div>
                        <div className="text-xs font-medium text-gray-600">
                          out of 100
                        </div>
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">
                      {getScoreLabel(reviewData.overallScore)} Resume
                    </h4>
                    <p className="text-sm text-gray-600">
                      Your resume is well-crafted with room for improvement
                    </p>
                  </div>

                  {/* Score Breakdown */}
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4 text-indigo-600" />
                      Score Breakdown
                    </h5>
                    <div className="space-y-3">
                      {Object.entries(reviewData.scores).map(([key, value]) => (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            <span
                              className={`text-sm font-bold ${getScoreColor(
                                value
                              )}`}
                            >
                              {value}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                value >= 80
                                  ? "bg-green-500"
                                  : value >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ATS Compatibility */}
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h5 className="text-sm font-semibold text-gray-900 mb-1">
                          ATS Compatibility Score
                        </h5>
                        <p className="text-xs text-gray-600 mb-2">
                          How well your resume works with applicant tracking
                          systems
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                              style={{ width: `${reviewData.atsScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-indigo-600">
                            {reviewData.atsScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      Strengths
                    </h5>
                    <ul className="space-y-2">
                      {reviewData.strengths.map((strength, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas for Improvement */}
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      Areas for Improvement
                    </h5>
                    <ul className="space-y-2">
                      {reviewData.improvements.map((improvement, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Keywords */}
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-600" />
                      Keywords Analysis
                    </h5>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">
                          Found in Resume:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {reviewData.keywords.found.map((keyword, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">
                          Consider Adding:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {reviewData.keywords.missing.map((keyword, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Empty State
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <FileCheck className="w-10 h-10 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    No Resume Analyzed Yet
                  </h4>
                  <p className="text-sm text-gray-600 max-w-sm">
                    Upload your resume and click "Analyze Resume" to get detailed
                    feedback and improvement suggestions.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Success Info */}
          {reviewData && !isAnalyzing && (
            <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-indigo-800">
                  <p className="font-medium mb-1">Analysis Complete!</p>
                  <p className="text-xs text-indigo-700">
                    Review the feedback above to improve your resume and increase
                    your chances of getting hired.
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

export default ReviewResume;
