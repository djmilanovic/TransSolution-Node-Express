const express = require('express');
const pool = require('../../db'); // Import the database connection
const router = express.Router();

// Route to get users with role 'driver'
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE role = $1', ['driver']);

        if (result.rows.length > 0) {
            // If there are users with the 'driver' role, return them
            res.json({ success: true, data: result.rows });
        } else {
            // If no users with the 'driver' role found, return success with an empty array
            res.json({ success: true, data: [] });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching drivers' });
    }
});

module.exports = router;