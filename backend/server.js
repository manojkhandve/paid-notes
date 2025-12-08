// server.js
require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Load key from .env
const RAZORPAY_KEY = process.env.RAZORPAY_KEY;

// Temporary storage for signed links (in-memory)
const linkStore = new Map();

// --- ROUTE 1: Send Razorpay Key ---
app.get("/api/razorpay-key", (req, res) => {
  res.json({ key: RAZORPAY_KEY });
});

// --- ROUTE 2: Create secure download link ---
app.post("/create-download-link", (req, res) => {
  const { file } = req.body;

  if (!file) {
    return res.status(400).json({ error: "File name is required" });
  }

  // Generate unique token
  const token = crypto.randomBytes(20).toString("hex");

  // Store token → file mapping (expiring in 2 minutes)
  linkStore.set(token, file);
  setTimeout(() => linkStore.delete(token), 2 * 60 * 1000);

  // Send link
  res.json({
    link: `http://localhost:${process.env.PORT}/download/${token}`,
  });
});

// --- ROUTE 3: Download using secure link ---
app.get("/download/:token", (req, res) => {
  const token = req.params.token;

  const fileName = linkStore.get(token);

  if (!fileName) {
    return res.status(401).send("Link expired or invalid ❌");
  }

  const filePath = path.resolve("files", fileName);


  res.download(filePath, () => {
    linkStore.delete(token);
  });
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Backend running on port ${process.env.PORT}`);
});


app.get("/download/:token", (req, res) => {
  const token = req.params.token;
  const fileName = linkStore.get(token);

  if (!fileName) {
    return res.status(401).send("Link expired or invalid ❌");
  }

  const filePath = path.resolve("files", fileName);

  console.log("Attempting to download:", filePath); // DEBUG

  res.download(filePath, (err) => {
    if (err) {
      console.error("Download error:", err);
      return res.status(500).send("File not found ❌");
    }
    linkStore.delete(token);
  });
});
