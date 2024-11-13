const express = require('express');
const pool = require('../../db'); // Import the database connection
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const router = express.Router();

// Route to update the password of a driver
router.post('/', async (req, res) => {
    const { id, newPassword } = req.body;

    if (!id || !newPassword) {
        return res.status(400).json({ success: false, message: 'Driver ID and new password are required' });
    }

    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        const result = await pool.query(
            'UPDATE users SET password_hash = $1 WHERE id = $2 AND role = $3 RETURNING id',
            [hashedPassword, id, 'driver']
        );

        if (result.rows.length > 0) {
            // If the password update was successful, return a success response
            res.json({ success: true, message: 'Password updated successfully' });
        } else {
            // If no matching driver was found, return an error response
            res.status(404).json({ success: false, message: 'Driver not found' });
        }
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ success: false, message: 'Error updating password' });
    }
});

module.exports = router;
