import "./styles.css";
import Header from "../components/Header";
import ComicCard from "../components/ComicCard";
import { useQuery } from "@tanstack/react-query";
import { getByTag } from "../api/galleries";

export default function Home() {
  const {
    isPending,
    error,
    data: galleries,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => getByTag(),
    select: (data) => data,
  });
  return (
    <div>
      <Header />
      <h2 className="section-title">Komik Terbaru</h2>
      <div className="grid" id="comicGrid">
        {isPending && <div className="state">Loading....</div>}
        {error && (
          <div className="state">An error has occurred: {error.message}</div>
        )}
        {galleries?.result?.map((item) => (
          <ComicCard
            key={item.id}
            thumbnail={item.thumbnail}
            en_title={item.english_title}
            pages={item.num_pages}
          />
        ))}
      </div>
    </div>
  );
}
