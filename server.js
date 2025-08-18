require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const app = express();
const todoRoutes = require("./routes/tododb.js");
const db = require("./database/db.js"); // Import database connection
const port = process.env.PORT || 3000; // Use environment variable or default to 3000
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);

app.use(express.json());
//atur EJS sebagai view engine
app.set("view engine", "ejs");

app.use("/todos", todoRoutes);

app.get("/", (req, res) => {
  res.render("index", {
    layout: "layouts/main-layout",
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    layout: "layouts/main-layout",
  });//rendering the contact.ejs file
});


app.get("/todos-data", (req, res) => {
  db.query("SELECT * FROM todos", (err, todos) => {
    if (err) return res.status(500).send("Internal Server Error");
    res.json(todos);
  });
});

app.get("/todo-view", (req, res) =>{
  db.query("SELECT * FROM todos", (err, todos) =>{
    if (err) return res.status(500).send("Internal Server Error");
    res.render("todo",{
      layout : "layouts/main-layout",
      todos: todos
    })
  });
});


app.get("/todos-list", (req, res) => {
  db.query("SELECT * FROM todos", (err, todos) => {
    if (err) return res.status(500).send("Internal Server Error");
    res.render("todos-page", {
      layout: "layouts/main-layout",
      todos: todos
    });
  });
});

app.use((req, res, next) => {
  res.status(404).render("404"); 
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});