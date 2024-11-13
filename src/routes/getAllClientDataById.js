const express = require('express');
const pool = require('../../db'); // Import the database connection
const router = express.Router();

// Route to get users by qr_code_id
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);

        if (result.rows.length > 0) {
            // If the client exists, send back the client data with exists = true
            res.json({ exists: true, data: result.rows[0] });
        } else {
            // If the client does not exist, send exists = false
            res.json({ exists: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching client' });
    }
});

module.exports = router;