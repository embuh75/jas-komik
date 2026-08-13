import "./styles.css";
import ComicCard from "../components/ComicCard";
import { useQuery } from "@tanstack/react-query";
import { getByTag } from "../api/galleries";
import { NavLink } from "react-router-dom";

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
      <h2 className="section-title">Komik Terbaru</h2>
      <div className="grid" id="comicGrid">
        {isPending && <div className="state">Loading....</div>}
        {error && (
          <div className="state">An error has occurred: {error.message}</div>
        )}
        {galleries?.result?.map((item) => (
          <NavLink key={item.id} to={`komik/${item.id}`}>
            <ComicCard
              thumbnail={item.thumbnail}
              en_title={item.english_title}
              pages={item.num_pages}
            />
          </NavLink>
        ))}
      </div>
    </div>
  );
}
