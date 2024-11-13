const express = require('express');
const pool = require('../../db'); // Database connection
const router = express.Router();
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For creating JWT

// Define a secret key for JWT (should be in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET;

// Login route
router.post('/', async (req, res) => {
    const { phoneNumber, password } = req.body;

    try {
        // Query the database for a user with the provided phone number
        const queryResult = await pool.query('SELECT id, password_hash,name,surname, role FROM users WHERE phone_number = $1', [phoneNumber]);

        if (queryResult.rows.length > 0) {
            const user = queryResult.rows[0];
            const passwordMatch = await bcrypt.compare(password, user.password_hash); // Compare provided password with stored hash

            if (passwordMatch) {
                // Generate JWT token if password matches
                const token = jwt.sign(
                    { id: user.id, phoneNumber: phoneNumber, role: user.role }, // Payload
                    JWT_SECRET, // Secret key
                    { expiresIn: '1h' } // Token expiry
                );

                // Send token back to the client
                res.json({ success: true, token, user: { name: user.name, surname: user.surname,id:user.id,role:user.role } });
                // console.log(user.name, user.surname, user.role);
            } else {
                res.json({ success: false, message: 'Incorrect password' });
            }
        } else {
            // No user found with the provided phone number
            res.json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;