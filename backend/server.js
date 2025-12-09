require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());

// Allow frontend + render
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://paid-notes-frontend.onrender.com",
      "*",
    ],
    methods: "GET,POST",
  })
);

// ENV variables
const RAZORPAY_KEY = process.env.RAZORPAY_KEY;
const BASE_URL = process.env.BASE_URL; // MUST be added in .env
const PORT = process.env.PORT || 8080;

// Temporary token → file store
const linkStore = new Map();

// --- ROUTE 1: Razorpay Key ---
app.get("/api/razorpay-key", (req, res) => {
  res.json({ key: RAZORPAY_KEY });
});

// --- ROUTE 2: Create Download Link ---
app.post("/create-download-link", (req, res) => {
  const { file } = req.body;

  if (!file) {
    return res.status(400).json({ error: "File name is required" });
  }

  const token = crypto.randomBytes(20).toString("hex");

  // store file for 2 minutes
  linkStore.set(token, file);
  setTimeout(() => linkStore.delete(token), 120000);

  res.json({
    link: `${BASE_URL}/download/${token}`,
  });
});

// --- ROUTE 3: Secure Download ---
app.get("/download/:token", (req, res) => {
  const token = req.params.token;
  const fileName = linkStore.get(token);

  if (!fileName) {
    return res.status(401).send("Link expired or invalid ❌");
  }

  const filePath = path.resolve("files", fileName);
  console.log("Downloading:", filePath);

  res.download(filePath, (err) => {
    if (err) {
      console.error("Download error:", err);
      return res.status(500).send("File not found ❌");
    }
    linkStore.delete(token);
  });
});

// Start server
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
