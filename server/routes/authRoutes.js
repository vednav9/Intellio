import express from 'express';
import passport from '../config/passport.js';
import {
  register,
  login,
  logout,
  logoutAll,
  refreshAccessToken,
  getMe,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  generateAccessToken,
  generateRefreshToken,
  storeRefreshToken,
} from '../utils/tokenUtils.js';

const router = express.Router();

// Regular auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/logout-all', protect, logoutAll);
router.post('/refresh-token', refreshAccessToken);
router.get('/me', protect, getMe);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
  }),
  async (req, res) => {
    try {
      // Generate tokens
      const accessToken = generateAccessToken(req.user.id);
      const refreshToken = generateRefreshToken(req.user.id);

      // Store refresh token
      await storeRefreshToken(req.user.id, refreshToken);

      // Redirect to frontend with tokens
      res.redirect(
        `${process.env.CLIENT_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
    }
  }
);

export default router;
