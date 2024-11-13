const express = require('express');
const pool = require('../../db'); // Import the database connection
const router = express.Router();

// Route to get all clients
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT name, surname, id FROM clients');

        if (result.rows.length > 0) {
            // Return all clients instead of just the first one
            res.json({ exists: true, clients: result.rows });
        } else {
            res.json({ exists: false, clients: [] });
        }
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ message: 'Error fetching clients' });
    }
});

module.exports = router;
