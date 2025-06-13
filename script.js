const API_KEY = "AIzaSyCNU2vVr_cVpWelmZjKPj-oZ61Hg22jJ2k";
const FOLDER_ID = "1KXkE7QkH1pbtva72rKK9L0Te-elEXgHm";
let tokenClient, accessToken;

window.onload = () => {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: "659934871827-o7gvshtrc4jo90gvuai376018r1mfdv5.apps.googleusercontent.com",
    scope: "https://www.googleapis.com/auth/drive.readonly",
    callback: (tokenResponse) => {
      if (tokenResponse.error) {
        console.error(tokenResponse);
        alert("Authentication failed.");
        return;
      }
      accessToken = tokenResponse.access_token;
      document.getElementById("auth").style.display = "none";
      document.getElementById("content").style.display = "block";
    }
  });

  document.querySelector(".g_id_signin").addEventListener("click", () => {
    tokenClient.requestAccessToken();
  });

  document.getElementById("signOutBtn").addEventListener("click", () => {
    google.accounts.oauth2.revoke(accessToken, () => {
      document.getElementById("auth").style.display = "block";
      document.getElementById("content").style.display = "none";
    });
  });

  document.getElementById("listImages").addEventListener("click", listImages);
};

function listImages() {
  fetch(
    `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+(mimeType='image/jpeg'+or+mimeType='image/png')&fields=files(id,name,thumbnailLink,webContentLink)&key=${API_KEY}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const list = document.getElementById("imageList");
      list.innerHTML = "";
      data.files.forEach((file) => {
        const li = document.createElement("li");
        li.innerHTML = `<img src="${file.thumbnailLink}" alt="${file.name}" title="${file.name}" />`;
        list.appendChild(li);
      });
    })
    .catch((err) => {
      console.error("Failed to fetch images:", err);
      alert("Failed to list images.");
    });
}
