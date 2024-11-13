const express = require('express');
const pool = require('../../db'); // Import the database connection
const router = express.Router();

// Route to update client details by client ID
router.post('/', async (req, res) => {
    const {
        id, // Unique ID of the client to be updated
        name,
        surname,
        phone_number,
        country,
        city,
        loyalty_bonus_money,
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE clients
             SET name = $1, surname = $2, phone_number = $3, country = $4, city = $5, loyalty_bonus_money = $6
             WHERE id = $7
             RETURNING *`,
            [name, surname, phone_number, country, city, loyalty_bonus_money, id]
        );

        if (result.rows.length > 0) {
            // If the client data was updated successfully
            res.json({ success: true, message: 'Client details updated successfully', data: result.rows[0] });
        } else {
            // If no client was found with the provided ID
            res.status(404).json({ success: false, message: 'Client not found' });
        }
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ success: false, message: 'Error updating client details' });
    }
});

module.exports = router;
