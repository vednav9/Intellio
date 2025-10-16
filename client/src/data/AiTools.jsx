// src/data/AiTools.jsx
import { 
  PenTool, 
  Lightbulb, 
  ImagePlus, 
  Eraser, 
  Trash2, 
  FileCheck 
} from 'lucide-react';

export const AiTools = [
  {
    title: 'AI Article Writer',
    description: 'Generate high-quality, SEO-optimized articles in seconds with advanced AI writing capabilities',
    icon: PenTool,
    bg: { from: '#3B82F6', to: '#8B5CF6' }, // Blue to Purple
    path: '/ai/write-article'
  },
  {
    title: 'Blog Title Generator',
    description: 'Create catchy, click-worthy blog titles that boost engagement and improve SEO rankings',
    icon: Lightbulb,
    bg: { from: '#F59E0B', to: '#EF4444' }, // Amber to Red
    path: '/ai/blog-title'
  },
  {
    title: 'AI Image Generation',
    description: 'Transform text prompts into stunning, professional images using cutting-edge AI technology',
    icon: ImagePlus,
    bg: { from: '#10B981', to: '#06B6D4' }, // Green to Cyan
    path: '/ai/generate-images'
  },
  {
    title: 'Background Removal',
    description: 'Instantly remove backgrounds from images with precision, perfect for product photos and portraits',
    icon: Eraser,
    bg: { from: '#EC4899', to: '#8B5CF6' }, // Pink to Purple
    path: '/ai/remove-background'
  },
  {
    title: 'Object Removal',
    description: 'Seamlessly erase unwanted objects from photos while maintaining natural-looking results',
    icon: Trash2,
    bg: { from: '#F97316', to: '#FB923C' }, // Orange to Light Orange
    path: '/ai/remove-object'
  },
  {
    title: 'Resume Reviewer',
    description: 'Get instant AI-powered feedback to optimize your resume and land more interview opportunities',
    icon: FileCheck,
    bg: { from: '#6366F1', to: '#A78BFA' }, // Indigo to Violet
    path: '/ai/review-resume'
  }
];
