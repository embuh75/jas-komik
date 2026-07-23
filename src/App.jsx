import "./App.css";
import Header from "./components/Header";
import ComicCard from "./components/ComicCard";
import Pagination from "./components/Pagination";
import { useQuery } from "@tanstack/react-query";

function App() {
  const {
    isPending,
    error,
    data: favorites,
  } = useQuery({
    queryKey: ["doujinshi"],
    queryFn: async () => {
      const id = 6620885; //nhentai id
      const username = "saia"; //nhentai username
      const response = await fetch(`/api/users/${id}/${username}`);

      return await response.json();
    },
    select: (data) => data.recent_favorites,
  });

  return (
    <>
      <Header />
      <h2 className="section-title">Komik Terbaru</h2>
      <div className="grid" id="comicGrid">
        {isPending && <div className="state">Loading....</div>}
        {error && (
          <div className="state">An error has occurred: {error.message}</div>
        )}
        {favorites?.map((item) => (
          <ComicCard
            id={item.id}
            thumbnail={item.thumbnail}
            en_title={item.english_title}
            pages={item.num_pages}
          />
        ))}
      </div>
      {/* {favorites.length == 0 && (<div className="state">Tidak ada komik ditemukan.</div>)} */}
      <Pagination />
    </>
  );
}

export default App;
