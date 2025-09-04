// Memuat file konfigurasi environment variables dari file .env
require("dotenv").config(); 

// Mengimport framework Express.js untuk membuat web server
const express = require("express");

const cors = require("cors");
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

const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth");

// Mengaktifkan middleware express-ejs-layouts
app.use(expressLayouts);

// Middleware untuk parsing JSON request body
app.use(express.json());

app.use(cors());
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

// GET: Mengambil semua todos
app.get("/api/todos", (req, res) => {
  const { search } = req.query;
  console.log(
    `Menerima permintaan GET untuk todos. Kriteria pencarian: '${search}'`
  );

  let query = "SELECT * FROM todos";
  const params = [];

  if (search) {
    query += " WHERE task LIKE ?";
    params.push(`%${search}%`);
  }

  db.query(query, params, (err, todos) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log("Berhasil mengirim todos:", todos.length, "item.");
    res.json({ todos: todos });
  });
});

// POST: Menambah todo baru
app.post("/api/todos", (req, res) => {
    const { task } = req.body;
    console.log("Menerima permintaan POST untuk menambah task:", task);

    if (!task) {
        console.error("Task tidak ditemukan di body permintaan.");
        return res.status(400).json({ error: 'Task is required' });
    }
    const query = 'INSERT INTO todos (task, completed) VALUES (?, ?)';
    db.query(query, [task, false], (err, result) => {
        if (err) {
            console.error("Database insert error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        console.log("Todo berhasil ditambahkan dengan ID:", result.insertId);
        res.status(201).json({ 
            message: 'Todo added successfully', 
            id: result.insertId,
            task, 
            completed: false 
        });
    });
});

// PUT: Memperbarui status 'completed' saja
app.put("/api/todos/:id", (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    console.log(`Menerima permintaan PUT untuk ID: ${id} dengan status completed: ${completed}`);

    // Validasi input
    if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: "Invalid 'completed' value. Must be a boolean." });
    }
    
    const query = 'UPDATE todos SET completed = ? WHERE id = ?';

    db.query(query, [completed, id], (err, result) => {
        if (err) {
            console.error("Database update error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (result.affectedRows === 0) {
            console.error("Todo tidak ditemukan untuk ID:", id);
            return res.status(404).json({ error: 'Todo not found' });
        }
        console.log(`Todo dengan ID ${id} berhasil diperbarui.`);
        res.json({ message: 'Todo updated successfully' });
    });
});

// DELETE: Menghapus todo berdasarkan ID
app.delete("/api/todos/:id", (req, res) => {
    const { id } = req.params;
    console.log(`Menerima permintaan DELETE untuk ID: ${id}`);
    const query = 'DELETE FROM todos WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Database delete error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (result.affectedRows === 0) {
            console.error("Todo tidak ditemukan untuk ID:", id);
            return res.status(404).json({ error: 'Todo not found' });
        }
        console.log(`Todo dengan ID ${id} berhasil dihapus.`);
        res.json({ message: 'Todo deleted successfully' });
    });
});
app.use("/api/auth", authRoutes);
app.use("/api/todos", authMiddleware, todoRoutes);

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