import pool from "../../lib/db";

function buildMatrix(n, comparisons) {
    const matrix = Array.from({ length: n }, () => Array(n).fill(1));
    comparisons.forEach(({ k1, k2, value }) => {
        matrix[k1 - 1][k2 - 1] = value;
        matrix[k2 - 1][k1 - 1] = 1 / value;
    });
    return matrix;
}

function normalizeAndPriority(matrix) {
    const n = matrix.length;
    const colSum = Array(n).fill(0);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) colSum[j] += matrix[i][j];
    const norm = matrix.map((row, i) => row.map((v, j) => v / colSum[j]));
    const priority = norm.map((r) => r.reduce((a, b) => a + b) / n);
    return priority;
}

export default async function handler(req, res) {
    try {
        const kriterias = (await pool.query("SELECT * FROM kriteria ORDER BY id")).rows;
        const comps = req.body;
        const matrix = buildMatrix(kriterias.length, comps);
        const priority = normalizeAndPriority(matrix);
        res.json({ kriterias, priority });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
