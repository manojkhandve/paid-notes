const crypto = require("crypto");
const tokens = {};

function generateDownloadToken() {
    const token = crypto.randomBytes(20).toString("hex");

    tokens[token] = {
        expires: Date.now() + 5 * 60 * 1000, // 5 minutes
        used: false
    };

    return token;
}

function validateToken(token) {
    const record = tokens[token];
    if (!record) return false;

    if (record.used) return false;
    if (Date.now() > record.expires) return false;

    record.used = true; // one-time use
    return true;
}

module.exports = { generateDownloadToken, validateToken };
