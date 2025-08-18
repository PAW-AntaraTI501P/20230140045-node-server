// Memuat file konfigurasi environment variables dari file .env
require("dotenv").config(); 

// Mengimport framework Express.js untuk membuat web server
const express = require("express");

// Membuat instance aplikasi Express
const app = express();

// Mengimport routes untuk todo dari file tododb.js
const todoRoutes = require("./routes/tododb.js");

// Mengimport koneksi database dari file db.js
const db = require("./database/db.js"); 

// Menentukan port server, menggunakan environment variable PORT atau default ke 3000
const port = process.env.PORT || 3000; 

// Mengimport middleware express-ejs-layouts untuk layout EJS
const expressLayouts = require("express-ejs-layouts");

// Mengaktifkan middleware express-ejs-layouts
app.use(expressLayouts);

// Middleware untuk parsing JSON request body
app.use(express.json());

// Mengatur EJS sebagai template engine untuk rendering view
app.set("view engine", "ejs");

// Menggunakan routes todo pada path /todos
app.use("/todos", todoRoutes);

// Route GET untuk halaman utama (home page)
app.get("/", (req, res) => {
  // Render halaman index.ejs dengan layout main-layout
  res.render("index", {
    layout: "layouts/main-layout",
  });
});

// Route GET untuk halaman kontak
app.get("/contact", (req, res) => {
  // Render halaman contact.ejs dengan layout main-layout
  res.render("contact", {
    layout: "layouts/main-layout",
  });
});


// Route GET untuk mengambil data todos dalam format JSON
app.get("/todos-data", (req, res) => {
  // Query database untuk mengambil semua data todos
  db.query("SELECT * FROM todos", (err, todos) => {
    // Jika terjadi error, kirim response error 500
    if (err) return res.status(500).send("Internal Server Error");
    // Kirim data todos dalam format JSON
    res.json(todos);
  });
});

// Route GET untuk menampilkan halaman todo dengan data dari database
app.get("/todo-view", (req, res) =>{
  // Query database untuk mengambil semua data todos
  db.query("SELECT * FROM todos", (err, todos) =>{
    // Jika terjadi error, kirim response error 500
    if (err) return res.status(500).send("Internal Server Error");
    // Render halaman todo.ejs dengan data todos dan layout main-layout
    res.render("todo",{
      layout : "layouts/main-layout",
      todos: todos
    })
  });
});


// Route GET untuk menampilkan halaman daftar todos
app.get("/todos-list", (req, res) => {
  // Query database untuk mengambil semua data todos
  db.query("SELECT * FROM todos", (err, todos) => {
    // Jika terjadi error, kirim response error 500
    if (err) return res.status(500).send("Internal Server Error");
    // Render halaman todos-page.ejs dengan data todos dan layout main-layout
    res.render("todos-page", {
      layout: "layouts/main-layout",
      todos: todos
    });
  });
});

// Middleware untuk menangani route yang tidak ditemukan (404)
app.use((req, res, next) => {
  // Kirim response text sederhana jika halaman tidak ditemukan
  res.status(404).send("404 - Page Not Found");
});

// Menjalankan server pada port yang telah ditentukan
app.listen(port, () => {
  // Menampilkan pesan bahwa server telah berjalan
  console.log(`Server running on http://localhost:${port}`);
});