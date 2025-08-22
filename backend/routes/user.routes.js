const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const pool = require('../database');

router.use(authMiddleware);

// Joi schema for password change validation
const passwordChangeSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).max(16).required()
});

// PUT /api/user/password
router.put('/password', async (req, res) => {
    try {
        const { error } = passwordChangeSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
        const user = rows[0];

        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(401).json({ message: 'Incorrect current password' });
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [newHashedPassword, userId]);
        
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating password' });
    }
});

module.exports = router;