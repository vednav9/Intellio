import express from 'express';
import {
  writeArticle,
  generateBlogTitles,
  generateImages,
  removeBackground,
  removeObject,
  reviewResume,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Text generation routes
router.post('/write-article', writeArticle);
router.post('/blog-titles', generateBlogTitles);
router.post('/generate-images', generateImages);

// Image processing routes
router.post('/remove-background', upload.single('image'), removeBackground);
router.post('/remove-object', upload.single('image'), removeObject);

// Resume review
router.post('/review-resume', upload.single('resume'), reviewResume);

export default router;
