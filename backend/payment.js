const BACKEND_URL = "https://paid-notes.onrender.com";

function generateDownloadLink(fileName) {
  fetch(`${BACKEND_URL}/create-download-link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file: fileName }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.link) {
        window.location.href = data.link; // updated
      } else {
        alert("❌ Failed to generate secure download link.");
      }
    })
    .catch((err) => console.error("Error creating download link:", err));
}
