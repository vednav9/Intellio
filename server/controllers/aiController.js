import { generateContent, generateContentWithImage } from '../utils/gemini.js';
import { sql } from '../config/db.js';
import { cleanupFile } from '../middleware/upload.js';
import fs from 'fs';

// @desc    Generate article
// @route   POST /api/ai/write-article
// @access  Private
export const writeArticle = async (req, res) => {
  try {
    const { topic, tone, length, keywords } = req.body;
    const userId = req.user.id;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a topic',
      });
    }

    const prompt = `Write a ${tone} article about "${topic}" that is approximately ${length} words long. ${
      keywords ? `Include these keywords: ${keywords}.` : ''
    } Use markdown formatting with headers, bullet points where appropriate. Make it engaging and informative.`;

    const article = await generateContent(prompt, 0.7);

    // Save to database
    await sql`
      INSERT INTO creations (user_id, type, prompt, output, tool)
      VALUES (${userId}, 'article', ${topic}, ${article}, 'Write Article')
    `;

    res.status(200).json({
      success: true,
      data: {
        article,
        wordCount: article.split(' ').length,
      },
    });
  } catch (error) {
    console.error('Write article error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate article',
    });
  }
};

// @desc    Generate blog titles
// @route   POST /api/ai/blog-titles
// @access  Private
export const generateBlogTitles = async (req, res) => {
  try {
    const { topic, category, count } = req.body;
    const userId = req.user.id;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a topic',
      });
    }

    const prompt = `Generate ${count || 5} catchy, SEO-friendly blog titles about "${topic}" in the ${
      category || 'general'
    } category. Make them engaging, click-worthy, and include power words. Format as a numbered list.`;

    const titlesText = await generateContent(prompt, 0.9);

    // Parse titles from numbered list
    const titles = titlesText
      .split('\n')
      .filter((line) => line.trim())
      .map((line, idx) => ({
        id: idx + 1,
        title: line.replace(/^\d+\.\s*/, '').trim(),
      }));

    // Save to database
    await sql`
      INSERT INTO creations (user_id, type, prompt, output, tool)
      VALUES (${userId}, 'title', ${topic}, ${titlesText}, 'Blog Title')
    `;

    res.status(200).json({
      success: true,
      data: {
        titles,
      },
    });
  } catch (error) {
    console.error('Generate blog titles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate blog titles',
    });
  }
};

// @desc    Generate images (Mock - uses placeholder)
// @route   POST /api/ai/generate-images
// @access  Private
export const generateImages = async (req, res) => {
  try {
    const { prompt, style, size, count } = req.body;
    const userId = req.user.id;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image prompt',
      });
    }

    // Mock image generation - In production, use DALL-E, Stable Diffusion, etc.
    const aspectRatios = {
      '1:1': '800x800',
      '9:16': '600x1067',
      '16:9': '1067x600',
    };

    const resolution = aspectRatios[size] || '800x800';
    const colors = ['6366f1', '8b5cf6', 'ec4899', '3b82f6', '10b981'];

    const images = Array.from({ length: count || 1 }, (_, idx) => ({
      id: idx + 1,
      url: `https://via.placeholder.com/${resolution}/${colors[idx % colors.length]}/ffffff?text=${encodeURIComponent(
        style + ' ' + prompt
      )}`,
      prompt,
      style,
      size,
    }));

    // Save to database
    await sql`
      INSERT INTO creations (user_id, type, prompt, output, tool)
      VALUES (${userId}, 'image', ${prompt}, ${JSON.stringify(images)}, 'Generate Images')
    `;

    res.status(200).json({
      success: true,
      data: {
        images,
      },
    });
  } catch (error) {
    console.error('Generate images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate images',
    });
  }
};

// @desc    Remove background from image (Mock)
// @route   POST /api/ai/remove-background
// @access  Private
export const removeBackground = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    // TODO : ADD API
    // Now - return the same image (in production, process it)
    const imageBase64 = fs.readFileSync(req.file.path, 'base64');
    const imageUrl = `data:${req.file.mimetype};base64,${imageBase64}`;

    // Save to database
    await sql`
      INSERT INTO creations (user_id, type, prompt, output, tool)
      VALUES (${userId}, 'background-remove', 'Remove background', ${imageUrl}, 'Remove Background')
    `;

    // Cleanup uploaded file
    cleanupFile(req.file.path);

    res.status(200).json({
      success: true,
      data: {
        processedImage: imageUrl,
      },
    });
  } catch (error) {
    console.error('Remove background error:', error);
    if (req.file) cleanupFile(req.file.path);
    res.status(500).json({
      success: false,
      message: 'Failed to remove background',
    });
  }
};

// @desc    Remove object from image (Mock)
// @route   POST /api/ai/remove-object
// @access  Private
export const removeObject = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    // Mock object removal - In production, use inpainting models
    const imageBase64 = fs.readFileSync(req.file.path, 'base64');
    const imageUrl = `data:${req.file.mimetype};base64,${imageBase64}`;

    // Save to database
    await sql`
      INSERT INTO creations (user_id, type, prompt, output, tool)
      VALUES (${userId}, 'object-remove', 'Remove object', ${imageUrl}, 'Remove Object')
    `;

    // Cleanup uploaded file
    cleanupFile(req.file.path);

    res.status(200).json({
      success: true,
      data: {
        processedImage: imageUrl,
      },
    });
  } catch (error) {
    console.error('Remove object error:', error);
    if (req.file) cleanupFile(req.file.path);
    res.status(500).json({
      success: false,
      message: 'Failed to remove object',
    });
  }
};

// @desc    Review resume
// @route   POST /api/ai/review-resume
// @access  Private
export const reviewResume = async (req, res) => {
  try {
    const { targetRole } = req.body;
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume',
      });
    }

    // Read file content
    const fileContent = fs.readFileSync(req.file.path, 'utf8');

    const prompt = `Analyze this resume${
      targetRole ? ` for a ${targetRole} position` : ''
    } and provide:
1. Overall score (0-100)
2. Scores for: content, formatting, ATS compatibility, experience, skills (each 0-100)
3. Top 5 strengths
4. Top 5 areas for improvement
5. Keywords found and keywords missing
6. ATS compatibility score

Resume content:
${fileContent.substring(0, 5000)}

Provide response in this JSON format:
{
  "overallScore": number,
  "scores": {"content": number, "formatting": number, "ats": number, "experience": number, "skills": number},
  "strengths": ["string"],
  "improvements": ["string"],
  "keywords": {"found": ["string"], "missing": ["string"]},
  "atsScore": number
}`;

    const reviewText = await generateContent(prompt, 0.3);

    // Parse JSON response
    let reviewData;
    try {
      reviewData = JSON.parse(reviewText);
    } catch {
      // Fallback if AI doesn't return valid JSON
      reviewData = {
        overallScore: 75,
        scores: { content: 80, formatting: 75, ats: 70, experience: 75, skills: 80 },
        strengths: ['Well-structured content', 'Clear experience section'],
        improvements: ['Add more keywords', 'Improve ATS compatibility'],
        keywords: { found: ['Management', 'Leadership'], missing: ['Agile', 'Scrum'] },
        atsScore: 70,
      };
    }

    // Save to database
    await sql`
      INSERT INTO creations (user_id, type, prompt, output, tool)
      VALUES (${userId}, 'resume', ${targetRole || 'General review'}, ${JSON.stringify(
      reviewData
    )}, 'Review Resume')
    `;

    // Cleanup uploaded file
    cleanupFile(req.file.path);

    res.status(200).json({
      success: true,
      data: reviewData,
    });
  } catch (error) {
    console.error('Review resume error:', error);
    if (req.file) cleanupFile(req.file.path);
    res.status(500).json({
      success: false,
      message: 'Failed to review resume',
    });
  }
};
