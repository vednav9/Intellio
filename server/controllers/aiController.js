import { generateContent, generateContentWithImage } from '../utils/gemini.js';
import { sql } from '../config/db.js';
import { cleanupFile } from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import mammoth from 'mammoth';
import FormData from 'form-data';

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

    const hfApiKey = process.env.HUGGING_FACE_API_KEY;
    if (!hfApiKey) {
      return res.status(503).json({
        success: false,
        message: 'Image generation is not configured. Please add HUGGING_FACE_API_KEY to the server .env file. Get a free token at huggingface.co/settings/tokens',
      });
    }

    const sizeMap = {
      '1:1': { width: 1024, height: 1024 },
      '9:16': { width: 576, height: 1024 },
      '16:9': { width: 1024, height: 576 },
    };
    const dimensions = sizeMap[size] || { width: 1024, height: 1024 };
    const imageCount = Math.min(parseInt(count) || 1, 4);

    const styledPrompt = `${prompt}, ${style} style, high quality, detailed`;

    // HuggingFace Router API — FLUX.1-schnell (fast, free tier)
    const HF_URL = 'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell';

    // Generate images sequentially to avoid rate limiting
    const images = [];
    for (let idx = 0; idx < imageCount; idx++) {
      const response = await fetch(HF_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${hfApiKey}`,
          'Content-Type': 'application/json',
          Accept: 'image/jpeg',
        },
        body: JSON.stringify({
          inputs: styledPrompt,
          parameters: {
            width: dimensions.width,
            height: dimensions.height,
            num_inference_steps: 4,
            seed: Date.now() + idx * 1000,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`HuggingFace image gen error (image ${idx + 1}):`, response.status, errText.substring(0, 200));
        throw new Error(`Image generation failed: ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const mimeType = response.headers.get('content-type') || 'image/jpeg';

      images.push({
        id: idx + 1,
        url: `data:${mimeType};base64,${base64}`,
        prompt: styledPrompt,
        style,
        size,
      });
    }

    // Store only metadata (not base64 blobs) to keep DB rows small
    const storageMeta = images.map(({ id, style: s, size: sz }) => ({ id, prompt: styledPrompt, style: s, size: sz }));

    await sql`
      INSERT INTO creations (user_id, type, prompt, output, tool)
      VALUES (${userId}, 'image', ${prompt}, ${JSON.stringify(storageMeta)}, 'Generate Images')
    `;

    res.status(200).json({
      success: true,
      data: { images },
    });
  } catch (error) {
    console.error('Generate images error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate images. Please try again.',
    });
  }
};

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

    if (process.env.REMOVE_BG_API_KEY) {
      const formData = new FormData();
      formData.append('image_file', fs.createReadStream(req.file.path));
      formData.append('size', 'auto');

      const response = await axios.post(
        'https://api.remove.bg/v1.0/removebg',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'X-Api-Key': process.env.REMOVE_BG_API_KEY,
          },
          responseType: 'arraybuffer',
        }
      );

      const base64Image = Buffer.from(response.data, 'binary').toString('base64');
      const processedImage = `data:image/png;base64,${base64Image}`;

      await sql`
        INSERT INTO creations (user_id, type, prompt, output, tool)
        VALUES (${userId}, 'background-remove', 'Remove background', ${processedImage}, 'Remove Background')
      `;

      cleanupFile(req.file.path);

      return res.status(200).json({
        success: true,
        data: {
          processedImage,
        },
      });
    }

    // Option 2: Fallback - Return original with transparent background simulation
    const imageBase64 = fs.readFileSync(req.file.path, 'base64');
    const imageUrl = `data:${req.file.mimetype};base64,${imageBase64}`;

    await sql`
      INSERT INTO creations (user_id, type, prompt, output, tool)
      VALUES (${userId}, 'background-remove', 'Remove background', ${imageUrl}, 'Remove Background')
    `;

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

    const ext = path.extname(req.file.originalname).toLowerCase();
    let resumeText = '';

    // Extract text from the uploaded file
    if (ext === '.pdf') {
      const { default: pdfParse } = await import('pdf-parse');
      const dataBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(dataBuffer);
      resumeText = pdfData.text;
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: req.file.path });
      resumeText = result.value;
    } else if (ext === '.doc') {
      // .doc is legacy binary format — try mammoth anyway (works for some .doc files)
      try {
        const result = await mammoth.extractRawText({ path: req.file.path });
        resumeText = result.value;
      } catch {
        resumeText = 'Document text could not be fully extracted.';
      }
    }

    if (!resumeText || resumeText.trim().length < 50) {
      cleanupFile(req.file.path);
      return res.status(422).json({
        success: false,
        message: 'Could not extract text from the resume. Please ensure the file is not scanned/image-only and try again.',
      });
    }

    // Truncate to avoid token overflow (~12,000 chars ≈ 3,000 tokens)
    const truncatedText = resumeText.trim().substring(0, 12000);

    const roleContext = targetRole
      ? `The candidate is targeting the role: "${targetRole}". Evaluate keyword relevance and role fit accordingly.`
      : 'No specific target role provided. Do a general professional resume evaluation.';

    const prompt = `You are an expert resume reviewer and career coach. Carefully read the following resume text and provide a detailed, honest, and specific analysis.

${roleContext}

RESUME TEXT:
---
${truncatedText}
---

Based on the actual content above, return ONLY a valid JSON object (no markdown, no explanation, no code block) with this exact structure:
{
  "overallScore": <integer 0-100>,
  "atsScore": <integer 0-100>,
  "scores": {
    "content": <integer 0-100>,
    "formatting": <integer 0-100>,
    "ats": <integer 0-100>,
    "experience": <integer 0-100>,
    "skills": <integer 0-100>
  },
  "strengths": ["specific strength 1 based on the resume", "specific strength 2", "specific strength 3", "specific strength 4", "specific strength 5"],
  "improvements": ["specific actionable improvement 1", "specific improvement 2", "specific improvement 3", "specific improvement 4", "specific improvement 5"],
  "keywords": {
    "found": ["keyword1 found in resume", "keyword2", "keyword3", "keyword4", "keyword5"],
    "missing": ["important missing keyword 1", "missing keyword 2", "missing keyword 3", "missing keyword 4"]
  }
}

Critical rules:
- Scores must reflect actual resume quality — do NOT give inflated scores
- Strengths and improvements must reference specific details from the actual resume text
- Keywords.found must be real keywords/skills actually present in the resume
- Keywords.missing must be relevant keywords absent from the resume${targetRole ? ` for a ${targetRole} role` : ''}
- Return ONLY the JSON object, nothing else`;

    const rawResponse = await generateContent(prompt, 0.3);

    // Strip any markdown code fences Gemini might add despite instructions
    const cleaned = rawResponse
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    let reviewData;
    try {
      reviewData = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON response:', cleaned.substring(0, 300));
      throw new Error('AI returned malformed response. Please try again.');
    }

    // Clamp all scores to 0-100
    const clamp = (n) => Math.min(100, Math.max(0, Math.round(Number(n) || 0)));
    reviewData.overallScore = clamp(reviewData.overallScore);
    reviewData.atsScore = clamp(reviewData.atsScore);
    if (reviewData.scores) {
      for (const key of Object.keys(reviewData.scores)) {
        reviewData.scores[key] = clamp(reviewData.scores[key]);
      }
    }

    await sql`
      INSERT INTO creations (user_id, type, prompt, output, tool)
      VALUES (${userId}, 'resume', ${targetRole || 'General review'}, ${JSON.stringify(reviewData)}, 'Review Resume')
    `;

    cleanupFile(req.file.path);

    res.status(200).json({
      success: true,
      data: reviewData,
      message: 'Resume analyzed successfully',
    });
  } catch (error) {
    console.error('Review resume error:', error);
    if (req.file) cleanupFile(req.file.path);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to review resume',
    });
  }
};
