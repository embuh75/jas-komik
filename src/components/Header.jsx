import "./style.css";

export default function Header() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a href="#/" className="brand">
          📖 KomikKu
        </a>
        <div className="search-box">
          <input
            id="searchInput"
            type="text"
            placeholder="Cari judul komik..."
          />
          <button id="searchBtn">Cari</button>
        </div>
      </div>
    </header>
  );
}
