fetch("http://localhost:3000/create-download-link")
   .then(res => res.json())
   .then(data => window.location.href = data.link);
