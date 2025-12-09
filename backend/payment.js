// payments.js (updated for Render)
const BACKEND_URL = "https://paid-notes.onrender.com";

// Example function to request a secure download link
function generateDownloadLink(fileName) {
  fetch(`${BACKEND_URL}/create-download-link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file: fileName }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.link) {
        // Open the secure PDF link in a new tab
        window.location.href = data.link;
      } else {
        alert("❌ Failed to generate secure download link.");
      }
    })
    .catch((err) => console.error("Error creating download link:", err));
}
