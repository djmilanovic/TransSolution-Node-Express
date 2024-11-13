const express = require('express');
const pool = require('../../db'); // Import the database connection
const router = express.Router();

// Route for client registration
router.post('/', async (req, res) => {
    const { name, surname, phone_number, country, city, qr_code_id } = req.body;

    // Validate request body
    if (!name || !surname || !phone_number || !country || !city || !qr_code_id) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        // Check if the client already exists
        const existingClient = await pool.query('SELECT * FROM clients WHERE phone_number = $1', [phone_number]);
        if (existingClient.rows.length > 0) {
            return res.status(409).json({ success: false, message: 'Client already exists.' });
        }

        // Insert the new client into the database with cycle_start_date as the current date
        const result = await pool.query(
            `INSERT INTO clients (name, surname, phone_number, country, city, qr_code_id, cycle_start_date)
             VALUES ($1, $2, $3, $4, $5, $6, NOW())
             RETURNING *`,
            [name, surname, phone_number, country, city, qr_code_id]
        );

        const newClient = result.rows[0];

        // Change the response structure to return client data under 'data'
        res.status(201).json({
            success: true,
            message: 'Client registered successfully.',
            data: newClient // Return the new client data under 'data'
        });
    } catch (error) {
        console.error('Error registering client:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

module.exports = router;