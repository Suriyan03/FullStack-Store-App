const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');
const pool = require('../database');
const bcrypt = require('bcrypt');
const Joi = require('joi');

router.use(authMiddleware, adminMiddleware);

// Joi Schemas (unchanged)
const userSchema = Joi.object({
    name: Joi.string().min(5).max(60).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(16).required(),
    address: Joi.string().max(400).optional().allow(''),
    role: Joi.string().valid('system_admin', 'normal_user', 'store_owner').required()
});

const storeSchema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().max(400).required(),
    ownerId: Joi.number().required()
});

// GET /api/admin/dashboard (unchanged)
router.get('/dashboard', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT COUNT(*) AS totalUsers FROM users');
        const [stores] = await pool.query('SELECT COUNT(*) AS totalStores FROM stores');
        const [ratings] = await pool.query('SELECT COUNT(*) AS totalRatings FROM ratings');

        res.json({
            totalUsers: users[0].totalUsers,
            totalStores: stores[0].totalStores,
            totalRatings: ratings[0].totalRatings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching dashboard data' });
    }
});

// POST /api/admin/users (unchanged)
router.post('/users', async (req, res) => {
    try {
        const { error } = userSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { name, email, password, address, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query('INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, address, role]);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating user' });
    }
});

// POST /api/admin/stores (unchanged)
router.post('/stores', async (req, res) => {
    try {
        const { error } = storeSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { name, address, ownerId } = req.body;

        const [ownerRows] = await pool.query('SELECT role FROM users WHERE id = ?', [ownerId]);
        if (ownerRows.length === 0 || ownerRows[0].role !== 'store_owner') {
            return res.status(400).json({ message: 'Invalid ownerId or user is not a store owner' });
        }

        await pool.query('INSERT INTO stores (name, address, owner_id) VALUES (?, ?, ?)', [name, address, ownerId]);
        res.status(201).json({ message: 'Store created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating store' });
    }
});

// GET /api/admin/users - List users with filtering and sorting
router.get('/users', async (req, res) => {
    try {
        const { sort = 'name', order = 'ASC', name, email, address, role } = req.query;
        let query = 'SELECT id, name, email, address, role FROM users WHERE 1=1';
        const params = [];

        if (name) {
            query += ' AND name LIKE ?';
            params.push(`%${name}%`);
        }
        if (email) {
            query += ' AND email LIKE ?';
            params.push(`%${email}%`);
        }
        if (address) {
            query += ' AND address LIKE ?';
            params.push(`%${address}%`);
        }
        if (role) {
            query += ' AND role = ?';
            params.push(role);
        }

        const validSortFields = ['name', 'email', 'address', 'role'];
        const validOrder = ['ASC', 'DESC'];

        const sortField = validSortFields.includes(sort) ? sort : 'name';
        const sortOrder = validOrder.includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';

        query += ` ORDER BY ${sortField} ${sortOrder}`;

        const [users] = await pool.query(query, params);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
});

// GET /api/admin/stores - List stores with filtering and sorting
router.get('/stores', async (req, res) => {
    try {
        const { sort = 'name', order = 'ASC', name, address, rating } = req.query;
        let query = `
            SELECT
                s.id,
                s.name,
                s.address,
                u.email AS owner_email,
                AVG(r.rating) AS avg_rating
            FROM stores s
            JOIN users u ON s.owner_id = u.id
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE 1=1
        `;
        const params = [];

        if (name) {
            query += ' AND s.name LIKE ?';
            params.push(`%${name}%`);
        }
        if (address) {
            query += ' AND s.address LIKE ?';
            params.push(`%${address}%`);
        }
        
        query += ' GROUP BY s.id';

        // Add rating filter
        if (rating) {
            query += ' HAVING AVG(r.rating) >= ?';
            params.push(parseFloat(rating));
        }

        const validSortFields = ['name', 'address', 'avg_rating'];
        const validOrder = ['ASC', 'DESC'];

        const sortField = validSortFields.includes(sort) ? sort : 'name';
        const sortOrder = validOrder.includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';

        query += ` ORDER BY ${sortField} ${sortOrder}`;

        const [stores] = await pool.query(query, params);
        res.json(stores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching stores' });
    }
});

module.exports = router;