require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  // 👇 Handle preflight explicitly
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// URL schema (structure of data)
const UrlSchema = new mongoose.Schema({
  shortId: String,
  originalUrl: String,
  clicks: {
    type: Number,
    default: 0
  },
    createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create model
const Url = mongoose.model('Url', UrlSchema);

// Create short URL
app.post('/shorten', async (req, res) => {
  const originalUrl = req.body.url;

  const id = Math.random().toString(36).substring(2, 8);

  const newUrl = new Url({
    shortId: id,
    originalUrl: originalUrl
  });

  await newUrl.save();

  const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;

  res.json({
    shortId: id,
    shortUrl: `${baseUrl}/${id}`
  });
});

app.get('/stats/:id', async (req, res) => {
  const id = req.params.id;

  const urlData = await Url.findOne({ shortId: id });

  if (!urlData) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  res.json({
    shortId: urlData.shortId,
    originalUrl: urlData.originalUrl,
    clicks: urlData.clicks,
    createdAt: urlData.createdAt
  });
});


// Redirect
app.get('/:id', async (req, res) => {
  const id = req.params.id;

  const urlData = await Url.findOne({ shortId: id });

  if (!urlData) return res.status(404).send("Not found");

  // increment click count
  urlData.clicks += 1;
  await urlData.save();

  res.redirect(urlData.originalUrl);
});

app.listen(process.env.PORT, () => {
  console.log("Server running");
});
