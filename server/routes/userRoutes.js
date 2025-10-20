import express from 'express';
import { getUserCreations, getUserStats, deleteCreation } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/creations', getUserCreations);
router.get('/stats', getUserStats);
router.delete('/creations/:id', deleteCreation);

export default router;
