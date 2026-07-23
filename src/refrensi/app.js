// ============================================
// app.js — Router + UI komik reader
// Navigasi berbasis hash: #/  #/comic/:id  #/read/:comicId/:chapterId
// ============================================

const app = document.getElementById("app");
const toastEl = document.getElementById("toast");

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.remove("hidden");
  setTimeout(() => toastEl.classList.add("hidden"), 3000);
}

function showLoading() {
  app.innerHTML = `<div class="state"><div class="spinner"></div>Memuat...</div>`;
}

function showError(msg) {
  app.innerHTML = `<div class="state">⚠️ ${msg}</div>`;
}

// ---------- Router ----------
async function router() {
  const hash = location.hash || "#/";
  const parts = hash.replace("#/", "").split("/").filter(Boolean);

  window.scrollTo(0, 0);

  if (parts.length === 0) {
    return renderHome();
  }
  if (parts[0] === "comic" && parts[1]) {
    return renderComicDetail(parts[1]);
  }
  if (parts[0] === "read" && parts[1] && parts[2]) {
    return renderReader(parts[1], parts[2]);
  }
  return renderHome();
}
window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);

// ---------- Home ----------
let currentPage = 1;
let currentQuery = "";

async function renderHome(page = currentPage, query = currentQuery) {
  currentPage = page;
  currentQuery = query;
  showLoading();
  try {
    const result = await Api.getComicList(/* { page, query } */);
    const comics = result.data || [];
    const totalPages = result.totalPages || 1;

    app.innerHTML = `
      <h2 class="section-title">${query ? `Hasil untuk "${query}"` : "Komik Terbaru"}</h2>
      <div class="grid" id="comicGrid"></div>
      <div class="pagination">
        <button id="prevPage" ${page <= 1 ? "disabled" : ""}>&larr; Sebelumnya</button>
        <span style="align-self:center;color:var(--muted)">Halaman ${page} / ${totalPages}</span>
        <button id="nextPage" ${page >= totalPages ? "disabled" : ""}>Selanjutnya &rarr;</button>
      </div>
    `;

    const grid = document.getElementById("comicGrid");
    if (comics.length === 0) {
      grid.innerHTML = `<div class="state">Tidak ada komik ditemukan.</div>`;
    } else {
      comics.forEach((c) => grid.appendChild(comicCard(c)));
    }

    document.getElementById("prevPage").onclick = () => renderHome(page - 1, query);
    document.getElementById("nextPage").onclick = () => renderHome(page + 1, query);
  } catch (e) {
    showError(e.message);
  }
}

function comicCard(c) {
  const div = document.createElement("div");
  div.className = "comic-card";
  div.innerHTML = `
    <img src="https://via.placeholder.com/300x400?text=No+Cover" alt="${c.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x400?text=No+Cover'"/>
    <div class="info">
      <div class="title">${c.title}</div>
      <div class="chapter">${c.pages}</div>
    </div>
  `;
  div.onclick = () => (location.hash = `#/comic/${c.id}`);
  return div;
}

// ---------- Detail Komik ----------
async function renderComicDetail(comicId) {
  showLoading();
  try {
    const c = await Api.getComicDetail(comicId);
    const genres = (c.genres || []).map((g) => `<span class="genre-tag">${g}</span>`).join("");
    const chapters = (c.chapters || []);

    app.innerHTML = `
      <div class="detail-header">
        <img src="${c.cover}" alt="${c.title}" onerror="this.src='https://via.placeholder.com/300x400?text=No+Cover'"/>
        <div>
          <h1>${c.title}</h1>
          <div class="meta">Author: ${c.author || "Tidak diketahui"}</div>
          <div>${genres}</div>
          <p class="synopsis">${c.synopsis || "Tidak ada sinopsis."}</p>
          ${chapters.length ? `<button id="readFirst" style="margin-top:10px;padding:10px 18px;border-radius:10px;border:none;background:var(--accent-2);color:#062;font-weight:700;cursor:pointer;">▶ Baca dari Awal</button>` : ""}
        </div>
      </div>
      <h2 class="section-title">Daftar Chapter (${chapters.length})</h2>
      <ul class="chapter-list" id="chapterList"></ul>
    `;

    const list = document.getElementById("chapterList");
    if (chapters.length === 0) {
      list.innerHTML = `<div class="state">Belum ada chapter.</div>`;
    } else {
      chapters
        .slice()
        .sort((a, b) => b.number - a.number)
        .forEach((ch) => {
          const li = document.createElement("li");
          li.innerHTML = `
            <a href="#/read/${comicId}/${ch.id}">
              <span>Chapter ${ch.number}${ch.title ? " - " + ch.title : ""}</span>
              <span class="date">${ch.releasedAt || ""}</span>
            </a>`;
          list.appendChild(li);
        });

      const firstBtn = document.getElementById("readFirst");
      if (firstBtn) {
        const sorted = chapters.slice().sort((a, b) => a.number - b.number);
        firstBtn.onclick = () => (location.hash = `#/read/${comicId}/${sorted[0].id}`);
      }
    }
  } catch (e) {
    showError(e.message);
  }
}

// ---------- Reader ----------
async function renderReader(comicId, chapterId) {
  showLoading();
  try {
    const ch = await Api.getChapterPages(comicId, chapterId);
    const pages = ch.pages || [];

    app.innerHTML = `
      <div class="reader">
        <div class="reader-topbar">
          <a href="#/comic/${comicId}">&larr; Kembali ke detail</a>
          <span class="chapter-title">Chapter ${ch.number ?? ""}</span>
        </div>
        <div id="pagesContainer"></div>
        <div class="reader-nav">
          <button id="prevChBtn" ${!ch.prevChapterId ? "disabled" : ""}>&larr; Prev</button>
          <button id="topBtn">⬆ Atas</button>
          <button id="nextChBtn" ${!ch.nextChapterId ? "disabled" : ""}>Next &rarr;</button>
        </div>
      </div>
    `;

    const container = document.getElementById("pagesContainer");
    if (pages.length === 0) {
      container.innerHTML = `<div class="state">Halaman tidak ditemukan.</div>`;
    } else {
      pages.forEach((url, i) => {
        const img = document.createElement("img");
        img.src = url;
        img.loading = "lazy";
        img.alt = `Halaman ${i + 1}`;
        img.onerror = () => (img.src = "https://via.placeholder.com/800x1200?text=Gagal+Memuat");
        container.appendChild(img);
      });
    }

    document.getElementById("prevChBtn").onclick = () => {
      if (ch.prevChapterId) location.hash = `#/read/${comicId}/${ch.prevChapterId}`;
    };
    document.getElementById("nextChBtn").onclick = () => {
      if (ch.nextChapterId) location.hash = `#/read/${comicId}/${ch.nextChapterId}`;
      else showToast("Ini chapter terakhir.");
    };
    document.getElementById("topBtn").onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });

    // Navigasi keyboard: kiri/kanan untuk pindah chapter
    document.onkeydown = (e) => {
      if (e.key === "ArrowRight" && ch.nextChapterId) location.hash = `#/read/${comicId}/${ch.nextChapterId}`;
      if (e.key === "ArrowLeft" && ch.prevChapterId) location.hash = `#/read/${comicId}/${ch.prevChapterId}`;
    };
  } catch (e) {
    showError(e.message);
  }
}

// ---------- Search ----------
document.getElementById("searchBtn").addEventListener("click", doSearch);
document.getElementById("searchInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") doSearch();
});
function doSearch() {
  const q = document.getElementById("searchInput").value.trim();
  location.hash = "#/";
  renderHome(1, q);
}