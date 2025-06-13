// Google API client config
const CLIENT_ID = '659934871827-o7gvshtrc4jo90gvuai376018r1mfdv5.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCNU2vVr_cVpWelmZjKPj-oZ61Hg22jJ2k';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/drive";

const signInButton = document.getElementById("signin-button");
const signOutButton = document.getElementById("signout-button");

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(() => {
    const authInstance = gapi.auth2.getAuthInstance();

    authInstance.isSignedIn.listen(updateSigninStatus);
    updateSigninStatus(authInstance.isSignedIn.get());

    signInButton.onclick = () => authInstance.signIn();
    signOutButton.onclick = () => authInstance.signOut();
  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    signInButton.style.display = 'none';
    signOutButton.style.display = 'inline';
    loadImages();
  } else {
    signInButton.style.display = 'inline';
    signOutButton.style.display = 'none';
  }
}

function loadImages() {
  const imageGrid = document.getElementById("image-grid");
  imageGrid.innerHTML = '';
  gapi.client.drive.files.list({
    q: "(mimeType='image/jpeg' or mimeType='image/png') and '1KXkE7QkH1pbtva72rKK9L0Te-elEXgHm' in parents and trashed=false",
    fields: "files(id, name, thumbnailLink, webContentLink)"
  }).then(response => {
    const files = response.result.files;
    if (files && files.length > 0) {
      files.forEach(file => {
        const tile = document.createElement('div');
        tile.className = 'image-tile';
        tile.innerHTML = `<img src="${file.thumbnailLink}" alt="${file.name}" /><p>${file.name}</p>`;
        tile.onclick = () => showFullscreen(file.webContentLink);
        imageGrid.appendChild(tile);
      });
    }
  });
}

function showFullscreen(link) {
  const fs = document.createElement('div');
  fs.className = 'fullscreen';
  fs.innerHTML = `<button onclick="this.parentNode.remove()">Close</button><img src="${link}" alt="image" />`;
  document.body.appendChild(fs);
}

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

document.addEventListener("DOMContentLoaded", handleClientLoad);
