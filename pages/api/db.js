import pool from '../../lib/db';

export default async function handler(req, res) {
    try {
        const result = await pool.query('SELECT NOW() AS now');
        res.status(200).json({ status: 'Connected to DB', time: result.rows[0].now });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
