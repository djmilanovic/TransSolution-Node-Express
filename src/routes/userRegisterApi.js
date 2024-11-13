const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../../db'); // Import the database connection
const router = express.Router();

// Route for user registration
router.post('/', async (req, res) => {
    const { name, surname, phone_number, role, password } = req.body;

    // Validate request body
    if (!name || !surname || !phone_number || !role || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        // Check if the user already exists
        const existingUser = await pool.query('SELECT * FROM users WHERE phone_number = $1', [phone_number]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ success: false, message: 'User already exists.' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the new user into the database
        await pool.query(
            'INSERT INTO users (name, surname, phone_number, role, password_hash) VALUES ($1, $2, $3, $4, $5)',
            [name, surname, phone_number, role, hashedPassword]
        );

        res.status(201).json({ success: true, message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

module.exports = router;