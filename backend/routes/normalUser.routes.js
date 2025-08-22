const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const pool = require('../database');
const Joi = require('joi');

router.use(authMiddleware);

// Joi schema for rating validation
const ratingSchema = Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    storeId: Joi.number().integer().required()
});

// GET /api/normal-user/stores (unchanged)
router.get('/stores', async (req, res) => {
    try {
        const query = `
            SELECT
                s.id,
                s.name,
                s.address,
                AVG(r.rating) AS overall_rating,
                MAX(CASE WHEN r.user_id = ? THEN r.rating ELSE NULL END) AS user_submitted_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            GROUP BY s.id
            ORDER BY s.name ASC;
        `;
        const userId = req.user.id;
        const [stores] = await pool.query(query, [userId]);
        res.json(stores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching stores' });
    }
});

// POST /api/normal-user/ratings
// Endpoint to submit or update a rating
router.post('/ratings', async (req, res) => {
    try {
        // Validation check for rating and storeId
        const { error } = ratingSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        
        const { rating, storeId } = req.body;
        const userId = req.user.id;

        // Check if a rating from this user for this store already exists
        const [existingRating] = await pool.query(
            'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?', 
            [userId, storeId]
        );

        if (existingRating.length > 0) {
            // Update existing rating
            await pool.query(
                'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?', 
                [rating, userId, storeId]
            );
            return res.status(200).json({ message: 'Rating updated successfully' });
        } else {
            // Insert new rating
            await pool.query(
                'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)', 
                [userId, storeId, rating]
            );
            return res.status(201).json({ message: 'Rating submitted successfully' });
        }
    } catch (error) {
        console.error('Error submitting rating:', error); // Log the specific error
        return res.status(500).json({ message: 'Server error submitting rating' });
    }
});

module.exports = router;