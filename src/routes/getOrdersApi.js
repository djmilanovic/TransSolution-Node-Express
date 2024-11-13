const express = require('express');
const pool = require('../../db'); // Import the database connection
const router = express.Router();

// Route to filter orders by optional client ID, driver ID, and date range
router.get('/', async (req, res) => {
    const { clientId, driverId, startDate, endDate } = req.query;

    try {
        // Base SQL query without filters, will retrieve all orders by default
        let sql = `
            SELECT orders.order_description AS description,
                   orders.price,
                   orders.created_at,
                   orders.discount_used,   -- Include the discount_used column
                   orders.discount_price,  -- Include the discount_price column
                   clients.name AS clientName,
                   users.name AS userName
            FROM orders
            JOIN clients ON orders.client_id = clients.id
            JOIN users ON orders.user_id = users.id
            WHERE 1 = 1
        `;

        const params = [];

        // Add conditional filters based on available parameters
        if (clientId) {
            sql += ` AND clients.id = $${params.length + 1}`;
            params.push(clientId);
        }

        if (driverId) {
            sql += ` AND users.id = $${params.length + 1}`;
            params.push(driverId);
        }

        if (startDate) {
            sql += ` AND orders.created_at >= $${params.length + 1}`;
            params.push(startDate);
        }

        if (endDate) {
            sql += ` AND orders.created_at <= $${params.length + 1}`;
            params.push(endDate);
        }

        const result = await pool.query(sql, params);

        res.json({ orders: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

module.exports = router;
