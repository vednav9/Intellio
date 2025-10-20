import { sql } from '../config/db.js';

// @desc    Get user creations
// @route   GET /api/user/creations
// @access  Private
export const getUserCreations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, offset = 0 } = req.query;

    const creations = await sql`
      SELECT id, type, prompt, output, tool, created_at
      FROM creations
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    res.status(200).json({
      success: true,
      data: {
        creations,
        count: creations.length,
      },
    });
  } catch (error) {
    console.error('Get creations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch creations',
    });
  }
};

// @desc    Get user stats
// @route   GET /api/user/stats
// @access  Private
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [creationsCount] = await sql`
      SELECT COUNT(*) as total FROM creations WHERE user_id = ${userId}
    `;

    const [toolsUsed] = await sql`
      SELECT COUNT(DISTINCT tool) as total FROM creations WHERE user_id = ${userId}
    `;

    res.status(200).json({
      success: true,
      data: {
        totalCreations: parseInt(creationsCount.total),
        creditsUsed: parseInt(creationsCount.total) * 10,
        creditsRemaining: 50,
        toolsUsed: parseInt(toolsUsed.total),
        communityPosts: 0,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
    });
  }
};

// @desc    Delete creation
// @route   DELETE /api/user/creations/:id
// @access  Private
export const deleteCreation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await sql`
      DELETE FROM creations WHERE id = ${id} AND user_id = ${userId}
    `;

    res.status(200).json({
      success: true,
      message: 'Creation deleted successfully',
    });
  } catch (error) {
    console.error('Delete creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete creation',
    });
  }
};
