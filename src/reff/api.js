// ============================================
// api.js — Integrasi dengan MangaDex API (resmi & gratis)
// Dokumentasi: https://api.mangadex.org/docs/
// ============================================

const API_BASE_URL = "https://nhentai.net/api/v2";

async function getThumbnailUrl(path) {
  try {
    const cdn = await fetch(`${API_BASE_URL}/cdn`);
    if(cdn.ok) {
      const res = await cdn.json();
      return `${res.thumb_servers[1]}/${path}`;
    }

    throw new Error('gagal fetch api')
  } catch(error) {
    return "https://via.placeholder.com/300x400?text=No+Cover";
  }
}

async function getTags(id) {
  try {
    const tag = await fetch(`API_BASE_URL/tags/${id}`);
    const res = await tag.json();
    return res;
  }
  catch(error) {
    return null;
  }
}

function getTitle(attributes) {
  const titleObj = attributes.title || {};
  return (
    titleObj.en ||
    titleObj["ja-ro"] ||
    Object.values(titleObj)[0] ||
    "Tanpa Judul"
  );
}

function mapMangaToComic(m) {
  const attrs = m.attributes;
  const coverRel = (m.relationships || []).find((r) => r.type === "cover_art");
  const authorRel = (m.relationships || []).find((r) => r.type === "author");
  return {
    id: m.id,
    title: m.english_title,
    titleJP: m.japanese_title,
    cover: getThumbnailUrl(m.thumbnail),
    tagId: getTags(m.tag_id),
    pages: m.num_pages
    latestChapter: attrs.lastChapter || null,
    genres: (attrs.tags || [])
      .filter((t) => t.attributes.group === "genre")
      .map((t) => t.attributes.name.en || Object.values(t.attributes.name)[0]),
    author: authorRel?.attributes?.name || "Tidak diketahui",
    synopsis:
      attrs.description?.en || Object.values(attrs.description || {})[0] || "",
  };
}

const Api = {
  // Ambil daftar komik (home page) — pakai endpoint /manga
  async getComicList({ page = 1, per_page = 25, genre = "", query = "" } = {}) {
    const limit = 20;
    const offset = (page - 1) * limit;
    const url = new URL(`${API_BASE_URL}/galleries`);
    url.searchParams.set("page", page);
    url.searchParams.set("per_page", per_page);
    url.searchParams.set("limit", limit);
    url.searchParams.set("offset", offset);
    url.searchParams.append("includes[]", "cover_art");
    url.searchParams.append("includes[]", "author");
    url.searchParams.set("order[latestUploadedChapter]", "desc");
    url.searchParams.set("availableTranslatedLanguage[]", "en");
    if (query) url.searchParams.set("title", query);

    const res = await fetch(url);
    if (!res.ok) throw new Error("Gagal mengambil daftar komik");
    const json = await res.json();

    // const totalPages = Math.max(1, Math.ceil(json.total / limit));
    return {
      data: json.result.map(mapMangaToComic),
      totalPages: json.total,
    };
  },

  // Ambil detail satu komik + daftar chapter
  async getComicDetail(comicId) {
    const mangaUrl = new URL(`${API_BASE_URL}/manga/${comicId}`);
    mangaUrl.searchParams.append("includes[]", "cover_art");
    mangaUrl.searchParams.append("includes[]", "author");

    const mangaRes = await fetch(mangaUrl);
    if (!mangaRes.ok) throw new Error("Gagal mengambil detail komik");
    const mangaJson = await mangaRes.json();
    const comic = mapMangaToComic(mangaJson.data);

    // Ambil daftar chapter (bahasa Inggris, urut berdasarkan nomor chapter)
    const chapters = [];
    let offset = 0;
    const limit = 100;
    let total = Infinity;

    while (offset < total && offset < 500) {
      const chUrl = new URL(`${API_BASE_URL}/manga/${comicId}/feed`);
      chUrl.searchParams.set("limit", limit);
      chUrl.searchParams.set("offset", offset);
      chUrl.searchParams.append("translatedLanguage[]", "en");
      chUrl.searchParams.set("order[chapter]", "asc");
      chUrl.searchParams.append("contentRating[]", "safe");
      chUrl.searchParams.append("contentRating[]", "suggestive");

      const chRes = await fetch(chUrl);
      if (!chRes.ok) break;
      const chJson = await chRes.json();
      total = chJson.total;

      chJson.data.forEach((c) => {
        chapters.push({
          id: c.id,
          number: c.attributes.chapter || "?",
          title: c.attributes.title || "",
          releasedAt: (c.attributes.publishAt || "").slice(0, 10),
        });
      });
      offset += limit;
    }

    // Hapus duplikat nomor chapter (ambil versi pertama tiap nomor)
    const seen = new Set();
    comic.chapters = chapters.filter((c) => {
      if (seen.has(c.number)) return false;
      seen.add(c.number);
      return true;
    });

    return comic;
  },

  // Ambil halaman-halaman gambar dari satu chapter
  async getChapterPages(comicId, chapterId) {
    const atHomeRes = await fetch(
      `${API_BASE_URL}/at-home/server/${chapterId}`,
    );
    if (!atHomeRes.ok) throw new Error("Gagal mengambil halaman chapter");
    const atHomeJson = await atHomeRes.json();

    const { baseUrl, chapter } = atHomeJson;
    const pages = chapter.data.map(
      (fileName) => `${baseUrl}/data/${chapter.hash}/${fileName}`,
    );

    // Ambil info chapter saat ini untuk cari prev/next
    const chRes = await fetch(`${API_BASE_URL}/chapter/${chapterId}`);
    const chJson = await chRes.json();
    const currentNumber = parseFloat(chJson.data.attributes.chapter);

    // Ambil daftar chapter manga ini untuk menentukan next/prev berdasarkan nomor
    const feedUrl = new URL(`${API_BASE_URL}/manga/${comicId}/feed`);
    feedUrl.searchParams.set("limit", 500);
    feedUrl.searchParams.append("translatedLanguage[]", "en");
    feedUrl.searchParams.set("order[chapter]", "asc");
    const feedRes = await fetch(feedUrl);
    const feedJson = await feedRes.json();
    const sorted = feedJson.data
      .filter((c) => c.attributes.chapter)
      .sort(
        (a, b) =>
          parseFloat(a.attributes.chapter) - parseFloat(b.attributes.chapter),
      );

    const idx = sorted.findIndex((c) => c.id === chapterId);
    const prevChapterId = idx > 0 ? sorted[idx - 1].id : null;
    const nextChapterId = idx < sorted.length - 1 ? sorted[idx + 1].id : null;

    return {
      chapterId,
      comicId,
      number: currentNumber,
      pages,
      prevChapterId,
      nextChapterId,
    };
  },

  async searchComics(query) {
    return this.getComicList({ query });
  },
};
