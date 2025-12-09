// server.js
require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

// IMPORTANT: Your PDFs are in "files" folder
const PDF_DIR = path.join(__dirname, "files");

// Store signed download links
const linkStore = new Map();

// Send Razorpay key to frontend
app.get("/api/razorpay-key", (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY });
});

// Generate secure signed link
app.post("/create-download-link", (req, res) => {
  const { file } = req.body;

  if (!file) {
    return res.status(400).json({ error: "File name is required" });
  }

  const token = crypto.randomBytes(20).toString("hex");
  const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

  linkStore.set(token, { file, expiry });

  const downloadUrl = `https://paid-notes.onrender.com/download/${token}`;
  res.json({ link: downloadUrl });
});

// Download file route
app.get("/download/:token", (req, res) => {
  const token = req.params.token;
  const data = linkStore.get(token);

  if (!data) {
    return res.status(404).send("Invalid link.");
  }

  if (Date.now() > data.expiry) {
    linkStore.delete(token);
    return res.status(403).send("Link expired.");
  }

  const filePath = path.join(PDF_DIR, data.file);
  res.download(filePath, data.file);
});

// Render-friendly port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running on port " + PORT));
