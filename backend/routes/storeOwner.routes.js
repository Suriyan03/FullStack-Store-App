const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const pool = require('../database');

router.use(authMiddleware);

// Middleware to check if the user is a store owner
const storeOwnerMiddleware = (req, res, next) => {
    if (req.user.role !== 'store_owner') {
        return res.status(403).json({ message: 'Access denied: Store Owner role required' });
    }
    next();
};

// GET /api/store-owner/dashboard
// Get the store's average rating and a list of users who have rated it
router.get('/dashboard', storeOwnerMiddleware, async (req, res) => {
    try {
        const ownerId = req.user.id;

        // Find the store owned by this user
        const [storeRows] = await pool.query('SELECT id FROM stores WHERE owner_id = ?', [ownerId]);
        if (storeRows.length === 0) {
            return res.status(404).json({ message: 'No store found for this owner.' });
        }
        const storeId = storeRows[0].id;

        // Get the average rating
        const [avgRating] = await pool.query(
            'SELECT AVG(rating) AS avg_rating FROM ratings WHERE store_id = ?',
            [storeId]
        );

        // Get the list of users who rated this store
        const [usersWithRatings] = await pool.query(
            `SELECT u.name, u.email, r.rating
             FROM ratings r
             JOIN users u ON r.user_id = u.id
             WHERE r.store_id = ?`,
            [storeId]
        );

        res.json({
            averageRating: avgRating[0].avg_rating || 0,
            usersWhoRated: usersWithRatings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching store data' });
    }
});

module.exports = router;