import "./style.css";

export default function ComicCard({ thumbnail, en_title, pages }) {
  return (
    <div className="comic-card">
      <img
        src={`https://t3.nhentai.net/${thumbnail}`}
        alt={en_title}
        loading="lazy"
        onError={() => {
          this.src = "https://via.placeholder.com/300x400?text=No+Cover";
        }}
      />
      <div className="info">
        <div className="title">{en_title}</div>
        <div className="chapter">{pages}</div>
      </div>
    </div>
  );
}
