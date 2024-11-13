const express = require('express');
const pool = require('../../db'); // Import the database connection
const router = express.Router();

// POST route to create a new order
router.post('/', async (req, res) => {
    const { client_id, user_id, order_description, price, useBonusMoney,loyalty_bonus_money } = req.body;
    const bonusMoney = price / 10;

    if (!client_id || !user_id || !order_description || !price) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        let discountUsed = false; // Default to false
        let discountPrice = 0; // Default to 0

        if (useBonusMoney) {
            // If bonus money is used, set discount_used to true and set the discount price to the bonus amount
            discountUsed = true;
            discountPrice = loyalty_bonus_money;
            // Reset the bonus money to 0 if the user opted to use it
            await pool.query(
                'UPDATE clients SET loyalty_bonus_money = 0 WHERE id = $1',
                [client_id]
            );
        } else {
            // Add bonusMoney to the current value if not using it
            await pool.query(
                'UPDATE clients SET loyalty_bonus_money = loyalty_bonus_money + $1 WHERE id = $2',
                [bonusMoney, client_id]
            );
        }

        // Insert the new order into the database, including discount_used and discount_price
        const result = await pool.query(
            'INSERT INTO orders (client_id, user_id, order_description, price, discount_used, discount_price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [client_id, user_id, order_description, price, discountUsed, discountPrice]
        );

        res.status(201).json({ success: true, order: result.rows[0] });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
});

module.exports = router;
