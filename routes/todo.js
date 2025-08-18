//pertemuan 4
// File route untuk mengelola operasi CRUD pada todo

// Import framework Express.js
const express = require("express");
// Membuat instance router Express untuk mengelola routes
const router = express.Router();

// Data dummy todos dalam array sebagai simulasi database
let todos = [
  { id: 1, task: "Belajar Node.js", },
  { id: 2, task: "Membuat API", },
];

// Route GET untuk mendapatkan semua todos (READ operation)
router.get("/", (req, res) => {
  // Mengirim response dalam format JSON berisi semua todos
  res.json(todos);
});

// Route GET untuk mendapatkan todo berdasarkan ID tertentu (READ by ID)
router.get("/:id", (req, res) => {
  // Mencari todo berdasarkan ID dengan mengkonversi parameter string ke integer
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  // Jika todo tidak ditemukan, kirim response 404 dengan pesan error
  if (!todo) return res.status(404).send("Tugas tidak ditemukan");
  // Jika ditemukan, kirim todo dalam format JSON
  res.json(todo);
});

// Route POST untuk menambahkan todo baru (CREATE operation)
router.post("/", (req, res) => {
  // Membuat object todo baru dengan ID auto-increment dan task dari request body
  const newTodo = {
    id: todos.length + 1, // ID baru berdasarkan panjang array + 1
    task: req.body.task,  // Task diambil dari request body
  };
  // Menambahkan todo baru ke dalam array todos
  todos.push(newTodo);
  // Mengirim response status 201 (Created) dengan data todo yang baru dibuat
  res.status(201).json(newTodo);
});

// Route PUT untuk memperbarui todo berdasarkan ID (UPDATE operation)
router.put("/:id", (req, res) => {
  // Mencari todo yang akan diupdate berdasarkan ID
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  // Jika todo tidak ditemukan, kirim response 404 dengan pesan error
  if (!todo) return res.status(404).send("Tugas tidak ditemukan");

  // Update properti task dengan data dari request body
  todo.task = req.body.task;
  // Mengirim response dengan data todo yang sudah diupdate
  res.json(todo);
});

// Route DELETE untuk menghapus todo berdasarkan ID (DELETE operation)
router.delete("/:id", (req, res) => {
  // Mencari index todo yang akan dihapus berdasarkan ID
  const todoIndex = todos.findIndex((t) => t.id === parseInt(req.params.id));
  // Jika todo tidak ditemukan (index -1), kirim response 404 dengan pesan error
  if (todoIndex === -1) return res.status(404).send("Tugas tidak ditemukan");

  // Menghapus todo dari array berdasarkan index yang ditemukan
  todos.splice(todoIndex, 1);
  // Mengirim response status 204 (No Content) menandakan berhasil dihapus
  res.status(204).send();
});

// Mengekspor router agar bisa digunakan di file lain
module.exports = router;
// Mengekspor data todos juga agar bisa diakses dari file lain
module.exports.todos = todos;