const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db'); // Import koneksi database
const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ message: 'Nama, email, dan password harus diisi' });

    // Cek apakah email sudah terdaftar
    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, results) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            if (results && results.length > 0) {
                return res.status(400).json({ message: 'Email sudah terdaftar' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            db.query(
                "INSERT INTO users SET ?",
                { name: name, email: email, password: hashedPassword },
                (err2) => {
                    if (err2) return res.status(500).json({ message: err2.message });
                    res.status(201).json({ message: 'User berhasil didaftarkan' });
                }
            );
        }
    );
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: 'Email dan password harus diisi' });
    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, results) => {
            const user = results[0];
            if (!user) return res.status(400).json({ msg: "invalid credentials" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: "invalid credentials" });

            const token = jwt.sign({ id: user.id }, "your_jwt_secret", { expiresIn: 3600 });
            res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
        }
    );
});

module.exports = router;