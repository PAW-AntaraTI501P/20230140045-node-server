// Import library mysql2 untuk koneksi ke database MySQL
// mysql2 adalah driver MySQL untuk Node.js yang mendukung prepared statements dan async/await
const mysql = require("mysql2");
// Memuat environment variables dari file .env untuk konfigurasi database
require("dotenv").config();

// Membuat koneksi ke database MySQL menggunakan konfigurasi dari environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,         // Host database (localhost, IP address, atau domain)
  user: process.env.DB_USER,         // Username untuk login ke database
  password: process.env.DB_PASSWORD, // Password untuk login ke database
  database: process.env.DB_NAME,     // Nama database yang akan digunakan
});

// Mencoba melakukan koneksi ke database dengan callback function
connection.connect((err) => {
  // Jika terjadi error saat koneksi
  if (err) {
    // Tampilkan pesan error di console
    console.error("Error connecting to the database:", err);
    // Keluar dari function (menghentikan eksekusi)
    return;
  }
  // Jika koneksi berhasil, tampilkan pesan sukses
  console.log("Connected to the MySQL database.");
});

// Mengekspor object connection agar bisa digunakan di file lain
// Connection ini akan digunakan untuk menjalankan query SQL
module.exports = connection;