import { useEffect, useState } from "react";

export default function Home() {
    const [kriterias, setKriterias] = useState([]);
    const [comparisons, setComparisons] = useState([]);
    const [results, setResults] = useState(null);
    const [newKriteria, setNewKriteria] = useState("");

    // Fetch kriteria dari database
    useEffect(() => {
        fetch("/api/kriteria")
            .then((res) => res.json())
            .then(setKriterias);
    }, []);

    // Update matrix input
    useEffect(() => {
        const pairs = [];
        for (let i = 0; i < kriterias.length; i++) {
            for (let j = i + 1; j < kriterias.length; j++) {
                pairs.push({ k1: kriterias[i], k2: kriterias[j], value: 1 });
            }
        }
        setComparisons(pairs);
    }, [kriterias]);

    const handleInputChange = (index, value) => {
        const updated = [...comparisons];
        updated[index].value = value;
        setComparisons(updated);
    };

    const addKriteria = async () => {
        if (!newKriteria.trim()) return;
        await fetch("/api/kriteria", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nama_kriteria: newKriteria }),
        });
        setNewKriteria("");
        const data = await fetch("/api/kriteria").then((r) => r.json());
        setKriterias(data);
    };

    const hitungAHP = async () => {
        const body = comparisons.map((c) => ({
            k1: c.k1.id,
            k2: c.k2.id,
            value: parseFloat(c.value) || 1,
        }));
        const res = await fetch("/api/compute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        setResults(await res.json());
    };

    return (
        <main style={{ padding: "40px", fontFamily: "system-ui" }}>
            <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
                🧮 Sistem Pendukung Keputusan - AHP
            </h1>

            {/* Tambah Kriteria */}
            <section style={{ marginBottom: "30px" }}>
                <h2>Tambah Kriteria</h2>
                <input
                    placeholder="Nama kriteria"
                    value={newKriteria}
                    onChange={(e) => setNewKriteria(e.target.value)}
                    style={{
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        marginRight: "10px",
                    }}
                />
                <button
                    onClick={addKriteria}
                    style={{
                        padding: "8px 16px",
                        border: "none",
                        background: "#0070f3",
                        color: "white",
                        borderRadius: "6px",
                    }}
                >
                    Tambah
                </button>
            </section>

            {/* Input Perbandingan */}
            <section style={{ marginBottom: "30px" }}>
                <h2>Perbandingan Kriteria</h2>
                {comparisons.length === 0 && <p>Tambahkan kriteria dulu.</p>}
                {comparisons.map((pair, index) => (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "8px",
                        }}
                    >
                        <span style={{ width: "150px" }}>{pair.k1.nama_kriteria}</span>
                        <input
                            type="number"
                            min="1"
                            max="9"
                            step="0.1"
                            value={pair.value}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            style={{
                                width: "80px",
                                padding: "6px",
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                                textAlign: "center",
                            }}
                        />
                        <span style={{ width: "150px" }}>{pair.k2.nama_kriteria}</span>
                    </div>
                ))}
            </section>

            {/* Tombol Hitung */}
            <button
                onClick={hitungAHP}
                style={{
                    padding: "10px 24px",
                    background: "#0070f3",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    marginBottom: "30px",
                }}
            >
                Hitung AHP
            </button>

            {/* Hasil */}
            {results && (
                <section>
                    <h2>Hasil Bobot Kriteria</h2>
                    <ul>
                        {results.kriterias.map((k, i) => (
                            <li key={k.id}>
                                {k.nama_kriteria}: <b>{results.priority[i].toFixed(4)}</b>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </main>
    );
}
