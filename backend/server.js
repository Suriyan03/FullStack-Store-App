const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const normalUserRoutes = require('./routes/normalUser.routes');
const storeOwnerRoutes = require('./routes/storeOwner.routes');
const userRoutes = require('./routes/user.routes'); // New import
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/normal-user', normalUserRoutes);
app.use('/api/store-owner', storeOwnerRoutes);
app.use('/api/user', userRoutes); // New route handler

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});