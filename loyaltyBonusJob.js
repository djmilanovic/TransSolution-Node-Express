const cron = require('node-cron');
const pool = require('./db'); // Ensure correct path to your db connection file

cron.schedule('1 0 * * *', async () => {
    console.log('Running scheduled job to reset loyalty_bonus_money...');

    try {
        const query = `
            UPDATE clients
            SET
                loyalty_bonus_money = 0,
                cycle_start_date = CURRENT_DATE
            WHERE
                AGE(CURRENT_DATE, cycle_start_date) >= INTERVAL '3 months';
        `;

        const result = await pool.query(query);
        console.log(`Job completed. Rows updated: ${result.rowCount}`);
    } catch (error) {
        console.error('Error running scheduled job:', error);
    }
});

module.exports = cron;
