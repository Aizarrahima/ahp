import pool from "../../lib/db";

export default async function handler(req, res) {
    try {
        if (req.method === "GET") {
            const result = await pool.query("SELECT * FROM kriteria ORDER BY id");
            return res.status(200).json(result.rows);
        }

        if (req.method === "POST") {
            const { nama_kriteria } = req.body;
            if (!nama_kriteria)
                return res.status(400).json({ error: "Nama kriteria wajib diisi" });
            await pool.query("INSERT INTO kriteria (nama_kriteria) VALUES ($1)", [
                nama_kriteria,
            ]);
            return res.status(201).json({ message: "Kriteria ditambahkan" });
        }

        return res.status(405).json({ error: "Method not allowed" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
