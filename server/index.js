const express = require('express');
const app = express();

app.use(express.json());

// Temporary in-memory storage (no database yet)
const urls = {};  
// Example: urls["abc123"] = "https://google.com"

// Create short URL
app.post('/shorten', (req, res) => {
  const originalUrl = req.body.url;

  // Create a simple random ID
  const id = Math.random().toString(36).substring(2, 8);

  urls[id] = originalUrl;

  res.json({
    shortId: id,
    shortUrl: `http://localhost:3000/${id}`
  });
});

// Redirect
app.get('/:id', (req, res) => {
  const id = req.params.id;
  const originalUrl = urls[id];

  if (!originalUrl) return res.status(404).send("Not found");

  res.redirect(originalUrl);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

