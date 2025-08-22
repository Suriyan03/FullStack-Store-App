const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../database');
const Joi = require('joi');
require('dotenv').config();

// Joi schema for user registration validation
const userRegistrationSchema = Joi.object({
    name: Joi.string().min(5).max(60).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).required(),
    address: Joi.string().max(400).optional().allow('')
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { error } = userRegistrationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { name, email, password, address } = req.body;

        // Check if user already exists
        const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user with 'normal_user' role
        await pool.query('INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, address, 'normal_user']);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// POST /api/auth/login (existing login endpoint)
router.post('/login', async (req, res) => {
    // ... (Your existing login code here)
    const { email, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT id, password, role FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, role: user.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

module.exports = router;