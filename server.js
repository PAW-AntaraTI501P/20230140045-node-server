const express = require("express");
const app = express();
const port = 3000;

const todoRoutes = require("./routes/todo.js");
const { todos } = require("./routes/todo.js");



app.use(express.json());

app.use("/todos", todoRoutes);
//atur EJS sebagai view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");//rendering the index.ejs file
});

app.get("/contact", (req, res) => {
  res.render("contact");//rendering the contact.ejs file
});

app.use((req, res, next) => {
  res.status(404).render("404"); 
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});