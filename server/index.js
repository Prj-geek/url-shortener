require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
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

  res.json({
    shortId: id,
    shortUrl: `http://localhost:3000/${id}`
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
