import "./style.css";
/* import { getCDN } from "../api/getCDN";
import { useQuery } from "@tanstack/react-query"; */

export default function ComicCard({ thumbnail, en_title, pages }) {
  /* const { data: thumb } = useQuery({
    queryKey: ["cdn"],
    queryFn: async () => getCDN(),
    select: (data) => data.thumb_servers,
  }); */

  return (
    <div className="comic-card">
      <img
        src={`https://t1.nhentai.net/${thumbnail}`}
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
