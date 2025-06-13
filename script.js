const folderId = "1KXkE7QkH1pbtva72rKK9L0Te-elEXgHm";
const apiKey = "AIzaSyCNU2vVr_cVpWelmZjKPj-oZ61Hg22jJ2k";

function listImages() {
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+(mimeType='image/jpeg'+or+mimeType='image/png')&key=${apiKey}&fields=files(id,name,thumbnailLink,webContentLink)`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("imageContainer");
      container.innerHTML = "";

      if (!data.files || data.files.length === 0) {
        container.innerText = "No images found.";
        return;
      }

      data.files.forEach(file => {
        const img = document.createElement("img");
        img.src = `https://drive.google.com/uc?export=view&id=${file.id}`;
        img.alt = file.name;
        container.appendChild(img);
      });
    })
    .catch(err => {
      console.error("Failed to list images", err);
      alert("Error fetching images.");
    });
}
