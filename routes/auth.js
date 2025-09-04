const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db'); // Import koneksi database
const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password} = req.body;
    if (!email || !password) 
        return res.status(400).json({ message: 'Email dan password harus diisi' });
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query (
        "INSERT INTO users SET ?",
        { email: email, password: hashedPassword },
        (err) =>{
            if (err) return res.status(500).json({error: err.message});
            res.status(201).json({message: 'User berhasil didaftarkan'});
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
            res.json({ token, user: { id: user.id, email: user.email } });
        }
    );
});

module.exports = router;