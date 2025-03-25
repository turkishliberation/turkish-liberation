
function toggleSources(id) {
  const section = document.getElementById(id);
  section.style.display = section.style.display === "block" ? "none" : "block";
}

function shareTo(platform) {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent("Check out this important page!");
  let shareUrl = "";

  switch (platform) {
    case "facebook":
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      break;
    case "twitter":
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
      break;
    case "linkedin":
      shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`;
      break;
  }

  window.open(shareUrl, "_blank");
}

function loadLanguage(lang) {
  fetch(`content/${lang}.json`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("title").textContent = data.title;
      document.getElementById("main").textContent = data.main;

      data.claims.forEach((claim, index) => {
        const article = document.getElementById(`claim-${index + 1}`);
        article.querySelector("h2").textContent = claim.title;
        article.querySelector("p").textContent = claim.description;

        const sourcesDiv = document.getElementById(`sources-${index + 1}`);
        const ul = sourcesDiv.querySelector("ul");
        ul.innerHTML = ""; // Clear previous links

        if (claim.sources && claim.sources.length > 0) {
          claim.sources.forEach((src) => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = src.url;
            a.textContent = src.text;
            a.target = "_blank";
            li.appendChild(a);
            ul.appendChild(li);
          });
        }
      });

      const alsoSeeList = document.getElementById("also-see-links");
      alsoSeeList.innerHTML = "";
      data.also_see.forEach((item) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = item.url;
        a.textContent = item.text;
        a.target = "_blank";
        li.appendChild(a);
        alsoSeeList.appendChild(li);
      });

      document.querySelector("#also-see h2").textContent = data.labels.also_see;
      document.querySelector("#share h2").textContent = data.labels.share;
      document.querySelector("#qr-code p").textContent = data.labels.qr_code

      const sloganEl = document.querySelector(".slogan-text");
      if (sloganEl && data.slogan) {
        if (Array.isArray(data.slogan)) {
          sloganEl.innerHTML = data.slogan.map(line => line).join("<br>");
        } else {
          sloganEl.textContent = data.slogan;
        }
      }
    });
}

function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  loadLanguage(lang);
}

document.addEventListener("DOMContentLoaded", () => {

  const savedLang = localStorage.getItem("lang") || "en";
  setLanguage(savedLang);

  const siteUrl = window.location.origin; // Dynamically gets your domain
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(siteUrl)}&size=150x150`;
  const qrImgElement = document.querySelector('#qr-code img');
  qrImgElement.src = qrImageUrl;
});
