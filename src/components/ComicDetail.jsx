export default function ComicDetail() {
  return (
    <div>
      <div className="detail-header">
        <img
          src="${c.cover}"
          alt="${c.title}"
          onerror="this.src='https://via.placeholder.com/300x400?text=No+Cover'"
        />
        <div>
          <h1>title</h1>
          <div className="meta">Author: Tidak diketahui</div>
          <div>
            <span className="genre-tag">asd</span>
          </div>
          <p className="synopsis">Tidak ada sinopsis.</p>$
          <button
            id="readFirst"
            style="margin-top:10px;padding:10px 18px;border-radius:10px;border:none;background:var(--accent-2);color:#062;font-weight:700;cursor:pointer;"
            onClick={() => (location.hash = "#")}
          >
            ▶ Baca dari Awal
          </button>
        </div>
      </div>
      <h2 className="section-title">Daftar Chapter (1)</h2>
      <ul className="chapter-list" id="chapterList">
        <div className="state">Belum ada chapter.</div>
        <a href="#/read/${comicId}/${ch.id}">
          <span>Chapter 1 asdasd</span>
          <span className="date">tanggal rilis</span>
        </a>
      </ul>
    </div>
  );
}
