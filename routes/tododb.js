// Import framework Express.js untuk membuat router
const express = require('express');
// Membuat instance router Express untuk mengelola routes
const router = express.Router();
// Mengimpor koneksi database MySQL dari file db.js
const db = require('../database/db');

// Route GET untuk mendapatkan semua todos dari database (READ operation)
router.get('/', (req, res) => {
    // Query SQL untuk mengambil semua data dari tabel todos
    db.query('SELECT * FROM todos', (err, results) => {
        // Jika terjadi error database, kirim response 500 Internal Server Error
        if (err) return res.status(500).send('Internal Server Error');
        // Jika berhasil, kirim data todos dalam format JSON
        res.json(results);
    });
});

// Route GET untuk mendapatkan todo berdasarkan ID dari database (READ by ID)
router.get('/:id', (req, res) => {
    // Query SQL dengan parameter untuk mencari todo berdasarkan ID
    db.query('SELECT * FROM todos WHERE id = ?', [req.params.id], (err, results) => {
        // Jika terjadi error database, kirim response 500 Internal Server Error
        if (err) return res.status(500).send('Internal Server Error');
        // Jika tidak ditemukan hasil (array kosong), kirim response 404
        if (results.length === 0) return res.status(404).send('Tugas tidak ditemukan');
        // Jika ditemukan, kirim data todo pertama (index 0) dalam format JSON
        res.json(results[0]);
    });
});

// Route POST untuk menambahkan todo baru ke database (CREATE operation)
router.post('/', (req, res) => {
    // Destructuring untuk mengambil properti task dari request body
    const { task } = req.body;
    // Validasi: cek apakah task kosong atau hanya berisi whitespace
    if (!task || task.trim() === '') {
        // Jika validasi gagal, kirim response 400 Bad Request
        return res.status(400).send('Tugas tidak boleh kosong');
    }

    // Query SQL INSERT untuk menambahkan todo baru dengan parameter task yang sudah di-trim
    db.query('INSERT INTO todos (task) VALUES (?)', [task.trim()], (err, results) => {
        // Jika terjadi error database, kirim response 500 Internal Server Error
        if (err) return res.status(500).send('Internal Server Error');
        // Membuat object todo baru dengan ID dari insertId, task yang di-trim, dan completed false
        const newTodo = { id: results.insertId, task: task.trim(), completed: false };
        // Kirim response 201 Created dengan data todo yang baru dibuat
        res.status(201).json(newTodo);
    });
});

// Route PUT untuk memperbarui todo berdasarkan ID di database (UPDATE operation)
router.put('/:id', (req, res) => {
    // Destructuring untuk mengambil properti task dan completed dari request body
    const { task, completed } = req.body;

    // Query SQL UPDATE untuk memperbarui task dan completed berdasarkan ID
    db.query('UPDATE todos SET task = ?, completed = ? WHERE id = ?', [task, completed, req.params.id], (err, results) => {
        // Jika terjadi error database, kirim response 500 Internal Server Error
        if (err) return res.status(500).send('Internal Server Error');
        // Jika tidak ada baris yang terpengaruh (ID tidak ditemukan), kirim response 404
        if (results.affectedRows === 0) return res.status(404).send('Tugas tidak ditemukan');
        // Jika berhasil, kirim response dengan data todo yang telah diupdate
        res.json({ id: req.params.id, task, completed });
    });
});

// Route DELETE untuk menghapus todo berdasarkan ID dari database (DELETE operation)
router.delete('/:id', (req, res) => {
    // Query SQL DELETE untuk menghapus todo berdasarkan ID
    db.query('DELETE FROM todos WHERE id = ?', [req.params.id], (err, results) => {
        // Jika terjadi error database, kirim response 500 Internal Server Error
        if (err) return res.status(500).send('Internal Server Error');
        // Jika tidak ada baris yang terpengaruh (ID tidak ditemukan), kirim response 404
        if (results.affectedRows === 0) return res.status(404).send('Tugas tidak ditemukan');
        // Jika berhasil dihapus, kirim response 204 No Content (sukses tanpa data)
        res.status(204).send();
    });
});

// Mengekspor router agar bisa digunakan di file server.js
module.exports = router;