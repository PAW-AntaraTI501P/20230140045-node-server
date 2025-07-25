const express = require('express');
const app = express();
const port = 3001;

const cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from node.js server' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});